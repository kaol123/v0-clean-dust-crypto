import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { inputMint, outputMint, amount, userPublicKey, slippageBps = 300 } = await request.json()

    console.log("[v0] Jupiter API Route - Getting quote for:", {
      inputMint,
      outputMint,
      amount,
      userPublicKey,
      slippageBps,
    })

    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`

    console.log("[v0] Fetching quote from:", quoteUrl)

    const quoteResponse = await fetch(quoteUrl, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!quoteResponse.ok) {
      const errorText = await quoteResponse.text()
      console.error("[v0] Quote error:", errorText)
      return NextResponse.json({ error: `Quote failed: ${errorText}` }, { status: quoteResponse.status })
    }

    const quoteData = await quoteResponse.json()
    console.log("[v0] Quote received:", quoteData)

    const swapResponse = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        quoteResponse: quoteData,
        userPublicKey,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: "auto",
      }),
    })

    if (!swapResponse.ok) {
      const errorText = await swapResponse.text()
      console.error("[v0] Swap error:", errorText)
      return NextResponse.json({ error: `Swap failed: ${errorText}` }, { status: swapResponse.status })
    }

    const swapData = await swapResponse.json()
    console.log("[v0] Swap transaction received")

    return NextResponse.json({
      success: true,
      quote: quoteData,
      swapTransaction: swapData.swapTransaction,
      outAmount: quoteData.outAmount,
    })
  } catch (error: any) {
    console.error("[v0] Jupiter API Route error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
