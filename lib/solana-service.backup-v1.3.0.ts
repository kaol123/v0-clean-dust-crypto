// BACKUP da versão 1.3.0 - FUNCIONANDO COM DUAS TRANSAÇÕES SEPARADAS
// Data: 2026-01-11
// Este arquivo é um backup da versão funcional antes da implementação das taxas integradas

import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import type { Token } from "@/types/token"

const PROJECT_WALLET = process.env.NEXT_PUBLIC_PROJECT_WALLET || ""

if (!PROJECT_WALLET) {
  console.warn("[v0] PROJECT_WALLET not configured. Please set NEXT_PUBLIC_PROJECT_WALLET in .env.local")
}

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com"

const JUPITER_ENDPOINTS = [
  { quote: "https://api.jup.ag/swap/v1/quote", swap: "https://api.jup.ag/swap/v1/swap" },
  { quote: "https://quote-api.jup.ag/v6/quote", swap: "https://quote-api.jup.ag/v6/swap" },
  { quote: "https://public.jupiterapi.com/quote", swap: "https://public.jupiterapi.com/swap" },
]

type ProgressCallback = (
  tokenSymbol: string,
  status: "pending" | "swapping" | "sending-commission" | "completed" | "failed",
  errorMessage?: string,
) => void

export class SolanaService {
  private connection: Connection

  constructor() {
    this.connection = new Connection(RPC_ENDPOINT, "confirmed")
  }

  private async getTokenMetadata(mint: string): Promise<{ symbol: string; name: string; logoURI?: string }> {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`)
      const data = await response.json()

      if (data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0]
        const baseToken = pair.baseToken

        return {
          symbol: baseToken.symbol || mint.slice(0, 4).toUpperCase(),
          name: baseToken.name || "Unknown Token",
          logoURI: baseToken.logoURI,
        }
      }
    } catch (error) {
      // Silent fail
    }

    return {
      symbol: mint.slice(0, 4).toUpperCase(),
      name: "Unknown Token",
      logoURI: undefined,
    }
  }

  private async getTokenPrices(mints: string[]): Promise<Map<string, number>> {
    try {
      const priceMap = new Map<string, number>()

      for (const mint of mints) {
        try {
          const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`)
          const data = await response.json()

          if (data.pairs && data.pairs.length > 0) {
            const sortedPairs = data.pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))
            const bestPair = sortedPairs[0]
            const price = Number.parseFloat(bestPair.priceUsd || 0)

            priceMap.set(mint, price)
          } else {
            priceMap.set(mint, 0)
          }

          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
          priceMap.set(mint, 0)
        }
      }

      return priceMap
    } catch (error) {
      return new Map()
    }
  }

  private async getSolPrice(): Promise<number> {
    try {
      const solMint = "So11111111111111111111111111111111111111112"
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${solMint}`)
      const data = await response.json()

      if (data.pairs && data.pairs.length > 0) {
        const price = Number.parseFloat(data.pairs[0].priceUsd)
        return price
      }

      return 180
    } catch (error) {
      return 180
    }
  }

  async getTokenAccounts(walletAddress: string): Promise<Token[]> {
    try {
      const publicKey = new PublicKey(walletAddress)

      const solPrice = await this.getSolPrice()

      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      })

      const accountsWithBalance = []
      const mints = []

      for (const account of tokenAccounts.value) {
        const tokenInfo = account.account.data.parsed.info
        const balance = tokenInfo.tokenAmount.uiAmount

        if (balance > 0) {
          accountsWithBalance.push({
            mint: tokenInfo.mint,
            balance,
            decimals: tokenInfo.tokenAmount.decimals,
          })
          mints.push(tokenInfo.mint)
        }
      }

      const priceMap = await this.getTokenPrices(mints)

      const tokens: Token[] = []

      for (const account of accountsWithBalance) {
        const { mint, balance, decimals } = account

        const metadata = await this.getTokenMetadata(mint)
        const usdPrice = priceMap.get(mint) || 0
        const totalUsdValue = balance * usdPrice

        tokens.push({
          symbol: metadata.symbol,
          name: metadata.name,
          balance,
          usdValue: totalUsdValue,
          solValue: usdPrice > 0 ? totalUsdValue / solPrice : 0,
          mint,
          decimals,
          logoURI: metadata.logoURI,
        })
      }

      return tokens
    } catch (error) {
      throw error
    }
  }

  private async tryJupiterSwap(
    inputMint: string,
    outputMint: string,
    amount: number,
    userPublicKey: string,
    slippageBps = 500,
  ): Promise<{ swapTransaction: string; outAmount: string } | null> {
    let quote = null

    for (const endpoint of JUPITER_ENDPOINTS) {
      try {
        const quoteUrl = `${endpoint.quote}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`

        const quoteResponse = await fetch(quoteUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
        })

        if (!quoteResponse.ok) {
          continue
        }

        const quoteText = await quoteResponse.text()

        if (quoteText.startsWith("Invalid") || quoteText.startsWith("<!") || quoteText.startsWith("<")) {
          continue
        }

        quote = JSON.parse(quoteText)

        if (quote && quote.outAmount) {
          break
        }
      } catch (e: any) {
        continue
      }
    }

    if (!quote) {
      return null
    }

    try {
      const apiResponse = await fetch("/api/jupiter-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote,
          userPublicKey,
        }),
      })

      if (apiResponse.ok) {
        const data = await apiResponse.json()
        if (data.swapTransaction) {
          return { swapTransaction: data.swapTransaction, outAmount: quote.outAmount }
        }
      }
    } catch (e: any) {
      // Silent fail
    }

    return null
  }

  async swapTokensToSol(
    tokens: Token[],
    walletPublicKey: string,
    phantomWallet: any,
    onProgress?: ProgressCallback,
  ): Promise<{
    totalSol: number
    commission: number
    userReceives: number
    signature: string
    failedTokens: { symbol: string; reason: string }[]
  }> {
    try {
      if (!phantomWallet?.isPhantom) {
        throw new Error("Phantom wallet not provided or not found")
      }

      if (!phantomWallet.isConnected) {
        await phantomWallet.connect()
      }

      let totalSolReceived = 0
      const signatures: string[] = []
      const failedTokens: { symbol: string; reason: string }[] = []

      for (const token of tokens) {
        try {
          onProgress?.(token.symbol, "swapping")

          const inputAmount = Math.floor(token.balance * Math.pow(10, token.decimals))

          if (inputAmount < 1) {
            onProgress?.(token.symbol, "failed", "Amount too small")
            failedTokens.push({ symbol: token.symbol, reason: "Amount too small" })
            continue
          }

          const swapResult = await this.tryJupiterSwap(
            token.mint,
            "So11111111111111111111111111111111111111112",
            inputAmount,
            walletPublicKey,
            500,
          )

          if (!swapResult) {
            onProgress?.(token.symbol, "failed", "No liquidity")
            failedTokens.push({ symbol: token.symbol, reason: "No liquidity or all endpoints failed" })
            continue
          }

          const { swapTransaction, outAmount } = swapResult
          const expectedSol = Number(outAmount) / LAMPORTS_PER_SOL

          const swapTransactionBuf = Buffer.from(swapTransaction, "base64")
          const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

          const signedTx = await phantomWallet.signTransaction(transaction)

          const signature = await this.connection.sendRawTransaction(signedTx.serialize(), {
            skipPreflight: false,
            preflightCommitment: "confirmed",
          })

          await this.connection.confirmTransaction(signature, "confirmed")

          onProgress?.(token.symbol, "completed")
          signatures.push(signature)
          totalSolReceived += expectedSol

          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error: any) {
          onProgress?.(token.symbol, "failed", error.message || "Unknown error")
          failedTokens.push({
            symbol: token.symbol,
            reason: error.message || "Unknown error",
          })
        }
      }

      const commission = totalSolReceived * 0.1
      const userReceives = totalSolReceived * 0.9

      // VERSÃO BACKUP: Transação separada para comissão (risco de rejeição)
      if (commission > 0 && PROJECT_WALLET) {
        try {
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: new PublicKey(walletPublicKey),
              toPubkey: new PublicKey(PROJECT_WALLET),
              lamports: Math.floor(commission * LAMPORTS_PER_SOL),
            }),
          )

          const { blockhash } = await this.connection.getLatestBlockhash()
          transaction.recentBlockhash = blockhash
          transaction.feePayer = new PublicKey(walletPublicKey)

          const signedTx = await phantomWallet.signTransaction(transaction)

          const signature = await this.connection.sendRawTransaction(signedTx.serialize())
          await this.connection.confirmTransaction(signature, "confirmed")

          signatures.push(signature)
        } catch (error) {
          // Commission transfer failed but swaps succeeded
        }
      }

      return {
        totalSol: totalSolReceived,
        commission,
        userReceives,
        signature: signatures[0] || "",
        failedTokens,
      }
    } catch (error) {
      throw error
    }
  }

  getProjectWallet(): string {
    return PROJECT_WALLET
  }
}
