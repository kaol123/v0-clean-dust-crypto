import { type NextRequest, NextResponse } from "next/server"
import { createJupiterApiClient } from "@jup-ag/api"

export async function POST(request: NextRequest) {
  const jupiterApi = createJupiterApiClient()

  try {
    const body = await request.json()
    const { inputMint, outputMint, amount, userPublicKey, slippageBps = 500 } = body

    console.log("[v0] Jupiter API Route - Using @jup-ag/api library")
    console.log("[v0] Environment:", process.env.NODE_ENV)
    console.log(
      "[v0] Swap params:",
      JSON.stringify({
        inputMint,
        outputMint,
        amount,
        userPublicKey,
        slippageBps,
      }),
    )

    // Validate inputs
    if (!inputMint || !outputMint || !amount || !userPublicKey) {
      console.error("[v0] Missing required parameters")
      return NextResponse.json({ error: "Missing required parameters", noLiquidity: false }, { status: 400 })
    }

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
      console.log("[v0] Quote response received:", quote ? "success" : "empty")
    } catch (quoteError: any) {
      console.error("[v0] Quote error name:", quoteError.name)
      console.error("[v0] Quote error message:", quoteError.message)
      console.error("[v0] Quote error stack:", quoteError.stack)

      const errorMessage = quoteError.message || "Failed to get quote"
      const isNoRoute =
        errorMessage.includes("No route found") ||
        errorMessage.includes("TOKEN_NOT_TRADABLE") ||
        errorMessage.includes("insufficient liquidity") ||
        errorMessage.includes("Could not find any route")

      return NextResponse.json({ error: errorMessage, noLiquidity: isNoRoute }, { status: 400 })
    }

    if (!quote || !quote.outAmount) {
      console.error("[v0] No quote received from Jupiter - quote object:", JSON.stringify(quote))
      return NextResponse.json({ error: "No liquidity available for this token", noLiquidity: true }, { status: 400 })
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
      console.log("[v0] Swap result received:", swapResult ? "success" : "empty")
    } catch (swapError: any) {
      console.error("[v0] Swap error name:", swapError.name)
      console.error("[v0] Swap error message:", swapError.message)
      console.error("[v0] Swap error stack:", swapError.stack)
      return NextResponse.json(
        { error: swapError.message || "Failed to generate swap transaction", noLiquidity: false },
        { status: 400 },
      )
    }

    if (!swapResult || !swapResult.swapTransaction) {
      console.error("[v0] No swap transaction generated - swapResult:", JSON.stringify(swapResult))
      return NextResponse.json({ error: "Failed to generate swap transaction", noLiquidity: false }, { status: 400 })
    }

    console.log("[v0] Swap transaction generated successfully")

    return NextResponse.json({
      success: true,
      quote,
      swapTransaction: swapResult.swapTransaction,
      outAmount: quote.outAmount,
    })
  } catch (error: any) {
    console.error("[v0] Jupiter API Route exception name:", error.name)
    console.error("[v0] Jupiter API Route exception message:", error.message)
    console.error("[v0] Jupiter API Route exception stack:", error.stack)

    const errorMessage = error.message || "Internal server error"
    const isLiquidityError =
      errorMessage.includes("No route found") ||
      errorMessage.includes("insufficient liquidity") ||
      errorMessage.includes("No quotes") ||
      errorMessage.includes("TOKEN_NOT_TRADABLE")

    return NextResponse.json(
      { error: errorMessage, noLiquidity: isLiquidityError },
      { status: isLiquidityError ? 400 : 500 },
    )
  }
}
