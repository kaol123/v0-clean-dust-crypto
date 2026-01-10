import { type NextRequest, NextResponse } from "next/server"
import { Connection, PublicKey } from "@solana/web3.js"
import { createJupiterApiClient } from "@jup-ag/api"

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com"

export async function POST(request: NextRequest) {
  try {
    const { inputMint, outputMint, amount, userPublicKey, slippageBps = 500 } = await request.json()

    console.log("[v0] Jupiter API Route - Using official @jup-ag/api library")
    console.log("[v0] Swap params:", {
      inputMint,
      outputMint,
      amount,
      userPublicKey,
      slippageBps,
    })

    const connection = new Connection(RPC_ENDPOINT)
    const jupiterQuoteApi = createJupiterApiClient()

    console.log("[v0] Fetching quote using Jupiter SDK...")

    const quote = await jupiterQuoteApi.quoteGet({
      inputMint,
      outputMint,
      amount: Number(amount),
      slippageBps,
    })

    if (!quote) {
      console.error("[v0] No quote received from Jupiter")
      return NextResponse.json(
        {
          error: "No liquidity available for this token",
          noLiquidity: true,
        },
        { status: 400 },
      )
    }

    console.log("[v0] Quote received! Output amount:", quote.outAmount)

    const swapResult = await jupiterQuoteApi.swapPost({
      swapRequest: {
        quoteResponse: quote,
        userPublicKey: new PublicKey(userPublicKey),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: "auto",
      },
    })

    console.log("[v0] Swap transaction generated successfully")

    return NextResponse.json({
      success: true,
      quote,
      swapTransaction: swapResult.swapTransaction,
      outAmount: quote.outAmount,
    })
  } catch (error: any) {
    console.error("[v0] Jupiter API Route exception:", error)

    const errorMessage = error.message || "Internal server error"
    const isLiquidityError =
      errorMessage.includes("No route found") ||
      errorMessage.includes("insufficient liquidity") ||
      errorMessage.includes("No quotes")

    return NextResponse.json(
      {
        error: errorMessage,
        noLiquidity: isLiquidityError,
      },
      { status: isLiquidityError ? 400 : 500 },
    )
  }
}
