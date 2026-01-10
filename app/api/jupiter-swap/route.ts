import { type NextRequest, NextResponse } from "next/server"
import { createJupiterApiClient } from "@jup-ag/api"

const jupiterApi = createJupiterApiClient()

export async function POST(request: NextRequest) {
  try {
    const { inputMint, outputMint, amount, userPublicKey, slippageBps = 500 } = await request.json()

    console.log("[v0] Jupiter API Route - Using @jup-ag/api library")
    console.log("[v0] Swap params:", {
      inputMint,
      outputMint,
      amount,
      userPublicKey,
      slippageBps,
    })

    // Step 1: Get quote from Jupiter using the official library
    console.log("[v0] Fetching quote via @jup-ag/api...")

    let quote
    try {
      quote = await jupiterApi.quoteGet({
        inputMint,
        outputMint,
        amount: Number(amount),
        slippageBps,
      })
    } catch (quoteError: any) {
      console.error("[v0] Quote error:", quoteError.message)

      const errorMessage = quoteError.message || "Failed to get quote"
      const isNoRoute =
        errorMessage.includes("No route found") ||
        errorMessage.includes("TOKEN_NOT_TRADABLE") ||
        errorMessage.includes("insufficient liquidity") ||
        errorMessage.includes("Could not find any route")

      return NextResponse.json(
        {
          error: errorMessage,
          noLiquidity: isNoRoute,
        },
        { status: 400 },
      )
    }

    if (!quote || !quote.outAmount) {
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

    // Step 2: Get swap transaction using the official library
    console.log("[v0] Requesting swap transaction via @jup-ag/api...")

    let swapResult
    try {
      swapResult = await jupiterApi.swapPost({
        swapRequest: {
          quoteResponse: quote,
          userPublicKey: userPublicKey,
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
        },
      })
    } catch (swapError: any) {
      console.error("[v0] Swap error:", swapError.message)
      return NextResponse.json(
        {
          error: swapError.message || "Failed to generate swap transaction",
          noLiquidity: false,
        },
        { status: 400 },
      )
    }

    if (!swapResult || !swapResult.swapTransaction) {
      console.error("[v0] No swap transaction generated")
      return NextResponse.json(
        {
          error: "Failed to generate swap transaction",
          noLiquidity: false,
        },
        { status: 400 },
      )
    }

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
      errorMessage.includes("No quotes") ||
      errorMessage.includes("TOKEN_NOT_TRADABLE")

    return NextResponse.json(
      {
        error: errorMessage,
        noLiquidity: isLiquidityError,
      },
      { status: isLiquidityError ? 400 : 500 },
    )
  }
}
