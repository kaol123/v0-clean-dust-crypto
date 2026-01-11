import { type NextRequest, NextResponse } from "next/server"

const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote"
const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6/swap"

// Headers que simulam requisição de navegador
const browserHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Origin: "https://jup.ag",
  Referer: "https://jup.ag/",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { inputMint, outputMint, amount, userPublicKey, slippageBps = 500 } = body

    console.log("[v0] Jupiter API Route v1.0.6 - Using direct fetch")
    console.log("[v0] Environment:", process.env.NODE_ENV)
    console.log("[v0] Swap params:", JSON.stringify({ inputMint, outputMint, amount, userPublicKey, slippageBps }))

    // Validate inputs
    if (!inputMint || !outputMint || !amount || !userPublicKey) {
      console.error("[v0] Missing required parameters")
      return NextResponse.json({ error: "Missing required parameters", noLiquidity: false }, { status: 400 })
    }

    // Step 1: Get quote from Jupiter
    const quoteUrl = `${JUPITER_QUOTE_API}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
    console.log("[v0] Fetching quote from:", quoteUrl)

    const quoteResponse = await fetch(quoteUrl, {
      method: "GET",
      headers: browserHeaders,
    })

    console.log("[v0] Quote response status:", quoteResponse.status)

    const quoteText = await quoteResponse.text()
    console.log("[v0] Quote response text (first 200 chars):", quoteText.substring(0, 200))

    if (!quoteResponse.ok) {
      const isNoRoute =
        quoteText.includes("No route") ||
        quoteText.includes("TOKEN_NOT_TRADABLE") ||
        quoteText.includes("insufficient liquidity") ||
        quoteText.includes("Could not find")
      return NextResponse.json({ error: quoteText, noLiquidity: isNoRoute }, { status: 400 })
    }

    let quote
    try {
      quote = JSON.parse(quoteText)
    } catch (e) {
      console.error("[v0] Failed to parse quote JSON:", quoteText)
      return NextResponse.json(
        { error: "Invalid quote response: " + quoteText.substring(0, 100), noLiquidity: false },
        { status: 400 },
      )
    }

    if (!quote || !quote.outAmount) {
      console.error("[v0] No outAmount in quote:", JSON.stringify(quote))
      return NextResponse.json({ error: "No liquidity available", noLiquidity: true }, { status: 400 })
    }

    console.log("[v0] Quote received! Output amount:", quote.outAmount)

    // Step 2: Get swap transaction
    console.log("[v0] Requesting swap transaction...")

    const swapResponse = await fetch(JUPITER_SWAP_API, {
      method: "POST",
      headers: browserHeaders,
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey: userPublicKey,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
      }),
    })

    console.log("[v0] Swap response status:", swapResponse.status)

    const swapText = await swapResponse.text()
    console.log("[v0] Swap response text (first 200 chars):", swapText.substring(0, 200))

    if (!swapResponse.ok) {
      return NextResponse.json({ error: swapText, noLiquidity: false }, { status: 400 })
    }

    let swapResult
    try {
      swapResult = JSON.parse(swapText)
    } catch (e) {
      console.error("[v0] Failed to parse swap JSON:", swapText)
      return NextResponse.json(
        { error: "Invalid swap response: " + swapText.substring(0, 100), noLiquidity: false },
        { status: 400 },
      )
    }

    if (!swapResult || !swapResult.swapTransaction) {
      console.error("[v0] No swapTransaction in result:", JSON.stringify(swapResult))
      return NextResponse.json({ error: "Failed to generate swap transaction", noLiquidity: false }, { status: 400 })
    }

    console.log("[v0] Swap transaction generated successfully!")

    return NextResponse.json({
      success: true,
      quote,
      swapTransaction: swapResult.swapTransaction,
      outAmount: quote.outAmount,
    })
  } catch (error: any) {
    console.error("[v0] Jupiter API Route exception:", error.name, error.message)
    console.error("[v0] Stack:", error.stack)

    const errorMessage = error.message || "Internal server error"
    const isLiquidityError =
      errorMessage.includes("No route") ||
      errorMessage.includes("insufficient liquidity") ||
      errorMessage.includes("TOKEN_NOT_TRADABLE")

    return NextResponse.json(
      { error: errorMessage, noLiquidity: isLiquidityError },
      { status: isLiquidityError ? 400 : 500 },
    )
  }
}
