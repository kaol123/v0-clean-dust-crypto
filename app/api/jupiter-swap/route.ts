import { type NextRequest, NextResponse } from "next/server"
import { createJupiterApiClient } from "@jup-ag/api"

const jupiterQuoteApi = createJupiterApiClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Jupiter API Route v1.6.0 - Using @jup-ag/api library")

    // Mode 1: Pre-fetched quote (hybrid mode)
    if (body.quote) {
      console.log("[v0] Received pre-fetched quote, generating swap transaction...")
      const { quote, userPublicKey } = body

      if (!quote || !userPublicKey) {
        return NextResponse.json({ error: "Missing quote or userPublicKey" }, { status: 400 })
      }

      try {
        const swapResult = await jupiterQuoteApi.swapPost({
          swapRequest: {
            quoteResponse: quote,
            userPublicKey: userPublicKey,
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
          },
        })

        if (swapResult.swapTransaction) {
          console.log("[v0] Swap transaction generated successfully")
          return NextResponse.json({
            success: true,
            swapTransaction: swapResult.swapTransaction,
            outAmount: quote.outAmount,
          })
        }
      } catch (e: any) {
        console.log("[v0] Swap generation failed:", e.message)
        return NextResponse.json({ error: e.message }, { status: 400 })
      }

      return NextResponse.json({ error: "Failed to generate swap" }, { status: 400 })
    }

    // Mode 2: Full quote + swap (legacy mode - this is what we need!)
    const { inputMint, outputMint, amount, userPublicKey, slippageBps = 500 } = body

    console.log("[v0] Full mode - quote + swap via @jup-ag/api")
    console.log("[v0] Input:", inputMint, "Amount:", amount)

    if (!inputMint || !outputMint || !amount || !userPublicKey) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Get quote using the library
    let quote
    try {
      quote = await jupiterQuoteApi.quoteGet({
        inputMint,
        outputMint,
        amount,
        slippageBps,
      })

      if (!quote || !quote.outAmount) {
        console.log("[v0] No quote available - token may not have liquidity")
        return NextResponse.json({ error: "No liquidity for this token", noLiquidity: true }, { status: 400 })
      }

      console.log("[v0] Quote received! Output amount:", quote.outAmount)
    } catch (e: any) {
      console.log("[v0] Quote error:", e.message)

      if (e.message?.includes("TOKEN_NOT_TRADABLE") || e.message?.includes("No route found")) {
        return NextResponse.json({ error: "Token not tradable", noLiquidity: true }, { status: 400 })
      }

      return NextResponse.json({ error: e.message, noLiquidity: true }, { status: 400 })
    }

    // Get swap transaction using the library
    try {
      const swapResult = await jupiterQuoteApi.swapPost({
        swapRequest: {
          quoteResponse: quote,
          userPublicKey,
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
        },
      })

      if (!swapResult.swapTransaction) {
        return NextResponse.json({ error: "Failed to generate swap transaction" }, { status: 400 })
      }

      console.log("[v0] Swap transaction generated successfully!")

      return NextResponse.json({
        success: true,
        swapTransaction: swapResult.swapTransaction,
        outAmount: quote.outAmount,
      })
    } catch (e: any) {
      console.error("[v0] Swap error:", e.message)
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  } catch (error: any) {
    console.error("[v0] Jupiter API Route exception:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
