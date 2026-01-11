import { type NextRequest, NextResponse } from "next/server"

const JUPITER_SWAP_ENDPOINTS = [
  "https://public.jupiterapi.com/swap",
  "https://quote-api.jup.ag/v6/swap",
  "https://api.jup.ag/swap/v1/swap",
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Jupiter API Route v1.0.8 - Hybrid mode")

    // Check if we received a pre-fetched quote
    if (body.quote) {
      console.log("[v0] Received pre-fetched quote, generating swap transaction...")
      const { quote, userPublicKey } = body

      if (!quote || !userPublicKey) {
        return NextResponse.json({ error: "Missing quote or userPublicKey" }, { status: 400 })
      }

      console.log("[v0] Quote outAmount:", quote.outAmount)

      // Try each swap endpoint
      for (const swapEndpoint of JUPITER_SWAP_ENDPOINTS) {
        try {
          console.log("[v0] Trying swap endpoint:", swapEndpoint)

          const swapResponse = await fetch(swapEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              quoteResponse: quote,
              userPublicKey: userPublicKey,
              wrapAndUnwrapSol: true,
              dynamicComputeUnitLimit: true,
            }),
          })

          console.log("[v0] Swap response status:", swapResponse.status)

          if (!swapResponse.ok) {
            const errorText = await swapResponse.text()
            console.log("[v0] Swap failed:", errorText.substring(0, 200))
            continue
          }

          const swapText = await swapResponse.text()

          // Check if response is valid JSON
          if (swapText.startsWith("Invalid") || swapText.startsWith("<!")) {
            console.log("[v0] Invalid swap response:", swapText.substring(0, 100))
            continue
          }

          const swapResult = JSON.parse(swapText)

          if (swapResult.swapTransaction) {
            console.log("[v0] ✅ Swap transaction generated from:", swapEndpoint)
            return NextResponse.json({
              success: true,
              swapTransaction: swapResult.swapTransaction,
              outAmount: quote.outAmount,
            })
          }
        } catch (e: any) {
          console.log("[v0] Swap endpoint", swapEndpoint, "failed:", e.message)
          continue
        }
      }

      return NextResponse.json({ error: "All swap endpoints failed", noLiquidity: false }, { status: 400 })
    }

    // Legacy mode: full quote + swap (for backward compatibility)
    const { inputMint, outputMint, amount, userPublicKey, slippageBps = 500 } = body

    console.log("[v0] Legacy mode - full quote + swap")

    if (!inputMint || !outputMint || !amount || !userPublicKey) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Get quote
    const quoteUrl = `https://public.jupiterapi.com/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
    console.log("[v0] Fetching quote from:", quoteUrl)

    const quoteResponse = await fetch(quoteUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    })

    if (!quoteResponse.ok) {
      const errorText = await quoteResponse.text()
      console.log("[v0] Quote failed:", errorText)
      return NextResponse.json({ error: errorText, noLiquidity: true }, { status: 400 })
    }

    const quoteText = await quoteResponse.text()

    if (quoteText.startsWith("Invalid") || quoteText.startsWith("<!")) {
      return NextResponse.json({ error: "Invalid quote response", noLiquidity: true }, { status: 400 })
    }

    const quote = JSON.parse(quoteText)

    if (!quote || !quote.outAmount) {
      return NextResponse.json({ error: "No liquidity", noLiquidity: true }, { status: 400 })
    }

    console.log("[v0] Quote received! Output:", quote.outAmount)

    // Get swap
    const swapResponse = await fetch("https://public.jupiterapi.com/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
      }),
    })

    if (!swapResponse.ok) {
      const errorText = await swapResponse.text()
      return NextResponse.json({ error: errorText }, { status: 400 })
    }

    const swapResult = await swapResponse.json()

    if (!swapResult.swapTransaction) {
      return NextResponse.json({ error: "Failed to generate swap" }, { status: 400 })
    }

    console.log("[v0] ✅ Swap transaction generated!")

    return NextResponse.json({
      success: true,
      swapTransaction: swapResult.swapTransaction,
      outAmount: quote.outAmount,
    })
  } catch (error: any) {
    console.error("[v0] Jupiter API Route exception:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
