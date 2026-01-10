import { type NextRequest, NextResponse } from "next/server"

const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote"
const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6/swap"

export async function POST(request: NextRequest) {
  try {
    const { inputMint, outputMint, amount, userPublicKey, slippageBps = 500 } = await request.json()

    console.log("[v0] Jupiter API Route - Using direct fetch (no external library)")
    console.log("[v0] Swap params:", {
      inputMint,
      outputMint,
      amount,
      userPublicKey,
      slippageBps,
    })

    // Step 1: Get quote from Jupiter
    const quoteUrl = `${JUPITER_QUOTE_API}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`

    console.log("[v0] Fetching quote from:", quoteUrl)

    const quoteResponse = await fetch(quoteUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    const quoteText = await quoteResponse.text()
    console.log("[v0] Quote response status:", quoteResponse.status)

    if (!quoteResponse.ok) {
      console.error("[v0] Quote request failed:", quoteText)

      const isNoRoute =
        quoteText.includes("No route found") ||
        quoteText.includes("TOKEN_NOT_TRADABLE") ||
        quoteText.includes("insufficient liquidity")

      return NextResponse.json(
        {
          error: quoteText || "Failed to get quote",
          noLiquidity: isNoRoute,
        },
        { status: 400 },
      )
    }

    let quote
    try {
      quote = JSON.parse(quoteText)
    } catch (e) {
      console.error("[v0] Failed to parse quote response:", quoteText)
      return NextResponse.json(
        {
          error: "Invalid response from Jupiter",
          noLiquidity: true,
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

    // Step 2: Get swap transaction
    const swapRequestBody = {
      quoteResponse: quote,
      userPublicKey: userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
    }

    console.log("[v0] Requesting swap transaction...")

    const swapResponse = await fetch(JUPITER_SWAP_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(swapRequestBody),
    })

    const swapText = await swapResponse.text()
    console.log("[v0] Swap response status:", swapResponse.status)

    if (!swapResponse.ok) {
      console.error("[v0] Swap request failed:", swapText)
      return NextResponse.json(
        {
          error: swapText || "Failed to generate swap transaction",
          noLiquidity: false,
        },
        { status: 400 },
      )
    }

    let swapResult
    try {
      swapResult = JSON.parse(swapText)
    } catch (e) {
      console.error("[v0] Failed to parse swap response:", swapText)
      return NextResponse.json(
        {
          error: "Invalid swap response from Jupiter",
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
