// Script para testar a funcionalidade de swap da Jupiter API
// Este script pode ser executado independentemente para validar o swap

import { VersionedTransaction } from "@solana/web3.js"

const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com"
const SOL_MINT = "So11111111111111111111111111111111111111112"

interface JupiterQuoteResponse {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  priceImpactPct: string
  routePlan: any[]
}

async function testJupiterSwap(tokenMint: string, tokenAmount: string, walletAddress: string) {
  console.log("\n========== JUPITER SWAP TEST ==========")
  console.log("Token Mint:", tokenMint)
  console.log("Amount:", tokenAmount)
  console.log("Wallet:", walletAddress)
  console.log("========================================\n")

  try {
    // Step 1: Get quote from Jupiter
    console.log("[1/4] Getting quote from Jupiter...")
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${tokenMint}&outputMint=${SOL_MINT}&amount=${tokenAmount}&slippageBps=1000`

    console.log("Quote URL:", quoteUrl)

    const quoteResponse = await fetch(quoteUrl)

    if (!quoteResponse.ok) {
      const errorText = await quoteResponse.text()
      throw new Error(`Jupiter quote failed: ${quoteResponse.status} - ${errorText}`)
    }

    const quoteData: JupiterQuoteResponse = await quoteResponse.json()
    console.log("Quote received successfully!")
    console.log("Input amount:", quoteData.inAmount)
    console.log("Output amount (SOL):", quoteData.outAmount)
    console.log("Price impact:", quoteData.priceImpactPct)

    // Step 2: Get swap transaction
    console.log("\n[2/4] Getting swap transaction...")
    const swapResponse = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse: quoteData,
        userPublicKey: walletAddress,
        wrapAndUnwrapSol: true,
        computeUnitPriceMicroLamports: "auto",
      }),
    })

    if (!swapResponse.ok) {
      const errorText = await swapResponse.text()
      throw new Error(`Jupiter swap failed: ${swapResponse.status} - ${errorText}`)
    }

    const swapData = await swapResponse.json()
    console.log("Swap transaction received!")
    console.log("Transaction size (bytes):", swapData.swapTransaction.length)

    // Step 3: Deserialize transaction (to validate structure)
    console.log("\n[3/4] Deserializing transaction...")
    const swapTransactionBuf = Buffer.from(swapData.swapTransaction, "base64")
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf)
    console.log("Transaction deserialized successfully!")
    console.log("Number of signatures:", transaction.signatures.length)
    console.log("Number of instructions:", transaction.message.compiledInstructions.length)

    // Step 4: Simulate transaction (optional, requires connection)
    console.log("\n[4/4] Transaction ready for signing!")
    console.log("✓ Jupiter swap flow validated successfully")
    console.log("\nNext steps:")
    console.log("1. User signs transaction with Phantom wallet")
    console.log("2. Send signed transaction to Solana network")
    console.log("3. Confirm transaction")

    return {
      success: true,
      quote: quoteData,
      transaction: swapData.swapTransaction,
    }
  } catch (error: any) {
    console.error("\n✗ Jupiter swap test failed:", error.message)
    throw error
  }
}

// Test with example data
const exampleTokenMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" // USDC
const exampleAmount = "1000000" // 1 USDC (6 decimals)
const exampleWallet = "9dD7sPJjtBFhyHRu52iATVU2ZKDVvZ44GVU7PztqLeCJ"

testJupiterSwap(exampleTokenMint, exampleAmount, exampleWallet)
  .then(() => {
    console.log("\n========== TEST COMPLETED SUCCESSFULLY ==========\n")
  })
  .catch((error) => {
    console.error("\n========== TEST FAILED ==========")
    console.error(error)
    console.error("=================================\n")
  })
