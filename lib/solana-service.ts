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

export class SolanaService {
  private connection: Connection

  constructor() {
    this.connection = new Connection(RPC_ENDPOINT, "confirmed")
  }

  private async getTokenMetadata(mint: string): Promise<{ symbol: string; name: string; logoURI?: string }> {
    try {
      console.log("[v0] Fetching metadata from DexScreener for", mint.slice(0, 6))
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`)
      const data = await response.json()

      if (data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0]
        const baseToken = pair.baseToken

        console.log("[v0] Found on DexScreener:", baseToken.symbol, baseToken.name)
        return {
          symbol: baseToken.symbol || mint.slice(0, 4).toUpperCase(),
          name: baseToken.name || "Unknown Token",
          logoURI: baseToken.logoURI,
        }
      }
    } catch (error) {
      console.log("[v0] DexScreener lookup failed for", mint.slice(0, 6))
    }

    console.log("[v0] No metadata found for", mint.slice(0, 6), "- using fallback")
    return {
      symbol: mint.slice(0, 4).toUpperCase(),
      name: "Unknown Token",
      logoURI: undefined,
    }
  }

  private async getTokenPrices(mints: string[]): Promise<Map<string, number>> {
    try {
      const priceMap = new Map<string, number>()

      console.log("[v0] Fetching prices for", mints.length, "tokens via DexScreener...")

      for (const mint of mints) {
        try {
          const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`)
          const data = await response.json()

          if (data.pairs && data.pairs.length > 0) {
            const sortedPairs = data.pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))
            const bestPair = sortedPairs[0]
            const price = Number.parseFloat(bestPair.priceUsd || 0)

            priceMap.set(mint, price)
            console.log("[v0] Price for", mint.slice(0, 6), ":", price, "USD")
          } else {
            console.log("[v0] No price data for", mint.slice(0, 6))
            priceMap.set(mint, 0)
          }

          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
          console.error("[v0] Error fetching price for", mint.slice(0, 6), error)
          priceMap.set(mint, 0)
        }
      }

      return priceMap
    } catch (error) {
      console.error("[v0] Error fetching prices:", error)
      return new Map()
    }
  }

  private async getSolPrice(): Promise<number> {
    try {
      const solMint = "So11111111111111111111111111111111111111112"
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${solMint}`)
      const data = await response.json()

      console.log("[v0] SOL price response:", data.pairs?.[0]?.priceUsd)

      if (data.pairs && data.pairs.length > 0) {
        const price = Number.parseFloat(data.pairs[0].priceUsd)
        console.log("[v0] SOL price:", price)
        return price
      }

      return 180
    } catch (error) {
      console.error("[v0] Error fetching SOL price:", error)
      return 180
    }
  }

  async getTokenAccounts(walletAddress: string): Promise<Token[]> {
    try {
      const publicKey = new PublicKey(walletAddress)

      console.log("[v0] ========== STARTING TOKEN FETCH ==========")
      console.log("[v0] Wallet address:", walletAddress)

      const solPrice = await this.getSolPrice()
      console.log("[v0] Current SOL price:", solPrice, "USD")

      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      })

      console.log("[v0] Found", tokenAccounts.value.length, "total token accounts")

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
          console.log("[v0] Token account:", tokenInfo.mint.slice(0, 8), "- Balance:", balance)
        }
      }

      console.log("[v0] Accounts with balance:", accountsWithBalance.length)

      console.log("[v0] Fetching prices for all tokens...")
      const priceMap = await this.getTokenPrices(mints)
      console.log("[v0] Price map size:", priceMap.size)

      const tokens: Token[] = []

      for (const account of accountsWithBalance) {
        const { mint, balance, decimals } = account

        console.log("[v0] Processing token:", mint.slice(0, 8))
        const metadata = await this.getTokenMetadata(mint)
        const usdPrice = priceMap.get(mint) || 0
        const totalUsdValue = balance * usdPrice

        console.log(
          "[v0] ===",
          metadata.symbol,
          "===",
          "\n  Name:",
          metadata.name,
          "\n  Balance:",
          balance,
          "\n  Price per token:",
          usdPrice,
          "USD",
          "\n  Total USD Value:",
          totalUsdValue,
          "USD",
          "\n  Logo:",
          metadata.logoURI ? "✓" : "✗",
        )

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

      console.log("[v0] ========== FINAL TOKENS ==========")
      console.log("[v0] Total tokens:", tokens.length)
      tokens.forEach((t) => {
        console.log(`[v0] ${t.symbol}: $${t.usdValue.toFixed(6)} USD (${t.balance} tokens)`)
      })
      console.log("[v0] =====================================")

      return tokens
    } catch (error) {
      console.error("[v0] Error fetching token accounts:", error)
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
    // First try API route
    try {
      console.log("[v0] Trying Jupiter via API route...")
      const apiResponse = await fetch("/api/jupiter-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputMint,
          outputMint,
          amount: amount.toString(),
          userPublicKey,
          slippageBps,
        }),
      })

      if (apiResponse.ok) {
        const data = await apiResponse.json()
        if (data.swapTransaction) {
          console.log("[v0] ✅ Got swap transaction from API route")
          return { swapTransaction: data.swapTransaction, outAmount: data.outAmount }
        }
      }
      console.log("[v0] API route failed with status:", apiResponse.status)
    } catch (e: any) {
      console.log("[v0] API route exception:", e.message)
    }

    // Try each Jupiter endpoint directly from browser
    for (const endpoint of JUPITER_ENDPOINTS) {
      try {
        console.log("[v0] Trying Jupiter endpoint:", endpoint.quote)

        // Get quote
        const quoteUrl = `${endpoint.quote}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`

        const quoteResponse = await fetch(quoteUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })

        if (!quoteResponse.ok) {
          console.log("[v0] Quote failed for endpoint:", endpoint.quote, "status:", quoteResponse.status)
          continue
        }

        const quoteText = await quoteResponse.text()

        // Check if response is valid JSON
        if (quoteText.startsWith("Invalid") || quoteText.startsWith("<!") || quoteText.startsWith("<")) {
          console.log("[v0] Invalid response from:", endpoint.quote)
          continue
        }

        const quote = JSON.parse(quoteText)

        if (!quote || !quote.outAmount) {
          console.log("[v0] No valid quote from:", endpoint.quote)
          continue
        }

        console.log("[v0] ✅ Quote received from", endpoint.quote, "- Output:", quote.outAmount)

        // Get swap transaction
        const swapResponse = await fetch(endpoint.swap, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            quoteResponse: quote,
            userPublicKey,
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
            dynamicSlippage: true,
          }),
        })

        if (!swapResponse.ok) {
          console.log("[v0] Swap request failed for endpoint:", endpoint.swap)
          continue
        }

        const swapData = await swapResponse.json()

        if (swapData.swapTransaction) {
          console.log("[v0] ✅ Got swap transaction from:", endpoint.swap)
          return { swapTransaction: swapData.swapTransaction, outAmount: quote.outAmount }
        }
      } catch (e: any) {
        console.log("[v0] Endpoint", endpoint.quote, "failed:", e.message)
        continue
      }
    }

    return null
  }

  async swapTokensToSol(
    tokens: Token[],
    walletPublicKey: string,
    phantomWallet: any,
  ): Promise<{
    totalSol: number
    commission: number
    userReceives: number
    signature: string
    failedTokens: { symbol: string; reason: string }[]
  }> {
    try {
      console.log("[v0] ========== STARTING SWAP PROCESS ==========")
      console.log("[v0] Tokens to swap:", tokens.length)
      console.log("[v0] Wallet:", walletPublicKey)

      if (!phantomWallet?.isPhantom) {
        throw new Error("Phantom wallet not provided or not found")
      }

      if (!phantomWallet.isConnected) {
        console.log("[v0] Wallet not connected, attempting connection...")
        await phantomWallet.connect()
      }

      let totalSolReceived = 0
      const signatures: string[] = []
      const failedTokens: { symbol: string; reason: string }[] = []

      for (const token of tokens) {
        try {
          console.log("[v0] ========================================")
          console.log("[v0] Processing token:", token.symbol)
          console.log("[v0] Balance:", token.balance)
          console.log("[v0] USD Value:", token.usdValue)
          console.log("[v0] Mint:", token.mint)

          const inputAmount = Math.floor(token.balance * Math.pow(10, token.decimals))
          console.log("[v0] Input amount (raw):", inputAmount)

          if (inputAmount < 1) {
            console.log("[v0] ⚠️ Amount too small to swap, skipping", token.symbol)
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
            console.log("[v0] ❌ All Jupiter endpoints failed for", token.symbol)
            failedTokens.push({ symbol: token.symbol, reason: "No liquidity or all endpoints failed" })
            continue
          }

          const { swapTransaction, outAmount } = swapResult
          const expectedSol = Number(outAmount) / LAMPORTS_PER_SOL
          console.log("[v0] Expected SOL output:", expectedSol)

          const swapTransactionBuf = Buffer.from(swapTransaction, "base64")
          const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

          console.log("[v0] Requesting signature from Phantom...")
          const signedTx = await phantomWallet.signTransaction(transaction)

          console.log("[v0] Sending transaction to blockchain...")
          const signature = await this.connection.sendRawTransaction(signedTx.serialize(), {
            skipPreflight: false,
            preflightCommitment: "confirmed",
          })

          console.log("[v0] Transaction sent! Signature:", signature)
          console.log("[v0] Waiting for confirmation...")

          await this.connection.confirmTransaction(signature, "confirmed")

          console.log("[v0] ✅ Swap successful for", token.symbol)
          signatures.push(signature)
          totalSolReceived += expectedSol

          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error: any) {
          console.error("[v0] ❌ Error swapping", token.symbol, ":", error.message)
          failedTokens.push({
            symbol: token.symbol,
            reason: error.message || "Unknown error",
          })
        }
      }

      console.log("[v0] ========================================")
      console.log("[v0] Swap phase completed!")
      console.log("[v0] Total SOL received from swaps:", totalSolReceived)
      console.log("[v0] Failed swaps:", failedTokens.length)

      const commission = totalSolReceived * 0.1
      const userReceives = totalSolReceived * 0.9

      console.log("[v0] Commission (10%):", commission, "SOL")
      console.log("[v0] User keeps (90%):", userReceives, "SOL")

      if (commission > 0 && PROJECT_WALLET) {
        try {
          console.log("[v0] ========================================")
          console.log("[v0] Transferring 10% commission to project wallet...")
          console.log("[v0] Project wallet:", PROJECT_WALLET)
          console.log("[v0] Commission amount:", commission, "SOL")

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

          console.log("[v0] Requesting signature for commission transfer...")
          const signedTx = await phantomWallet.signTransaction(transaction)

          const signature = await this.connection.sendRawTransaction(signedTx.serialize())
          await this.connection.confirmTransaction(signature, "confirmed")

          console.log("[v0] ✅ Commission transferred! Signature:", signature)
          console.log("[v0] User keeps", userReceives, "SOL in their wallet")
          signatures.push(signature)
        } catch (error) {
          console.error("[v0] ❌ Error transferring commission:", error)
        }
      } else if (!PROJECT_WALLET) {
        console.warn("[v0] ⚠️ PROJECT_WALLET not configured - skipping commission transfer")
      } else {
        console.log("[v0] No SOL from swaps - no commission to transfer")
      }

      console.log("[v0] ========== SWAP PROCESS COMPLETED ==========")
      console.log("[v0] Summary:")
      console.log("[v0]   Total SOL from swaps:", totalSolReceived, "SOL")
      console.log("[v0]   Commission sent to project:", commission, "SOL")
      console.log("[v0]   User keeps in wallet:", userReceives, "SOL")
      console.log("[v0]   Failed tokens:", failedTokens.length)
      if (failedTokens.length > 0) {
        console.log(
          "[v0]   Tokens that couldn't be swapped:",
          failedTokens.map((t) => `${t.symbol} (${t.reason})`).join(", "),
        )
      }

      return {
        totalSol: totalSolReceived,
        commission,
        userReceives,
        signature: signatures[0] || "",
        failedTokens,
      }
    } catch (error) {
      console.error("[v0] ========== SWAP PROCESS FAILED ==========")
      console.error("[v0] Fatal error in swap process:", error)
      throw error
    }
  }

  getProjectWallet(): string {
    return PROJECT_WALLET
  }
}
