import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Jupiter API Route v1.6.4 - Using direct fetch")

    // Mode 1: Pre-fetched quote (hybrid mode) - receive quote, generate swap
    if (body.quote) {
      console.log("[v0] Received pre-fetched quote, generating swap transaction...")
      const { quote, userPublicKey } = body

      if (!quote || !userPublicKey) {
        return NextResponse.json({ error: "Missing quote or userPublicKey" }, { status: 400 })
      }

      const cleanQuote = { ...quote }
      delete cleanQuote.platformFee
      delete cleanQuote.platformFeeBps

      const swapEndpoints = ["https://public.jupiterapi.com/swap", "https://quote-api.jup.ag/v6/swap"]

      for (const endpoint of swapEndpoints) {
        try {
          console.log(`[v0] Trying swap endpoint: ${endpoint}`)

          const swapResponse = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              quoteResponse: cleanQuote,
              userPublicKey: userPublicKey,
              wrapAndUnwrapSol: true,
              dynamicComputeUnitLimit: true,
            }),
          })

          const responseText = await swapResponse.text()
          console.log(`[v0] Swap response status: ${swapResponse.status}`)

          if (swapResponse.ok) {
            try {
              const swapResult = JSON.parse(responseText)
              if (swapResult.swapTransaction) {
                console.log("[v0] Swap transaction generated successfully")
                return NextResponse.json({
                  success: true,
                  swapTransaction: swapResult.swapTransaction,
                  outAmount: cleanQuote.outAmount,
                })
              }
            } catch {
              console.log("[v0] Failed to parse swap response")
            }
          } else {
            console.log(`[v0] Swap endpoint failed: ${responseText.substring(0, 200)}`)
          }
        } catch (e: any) {
          console.log(`[v0] Swap endpoint error: ${e.message}`)
        }
      }

      return NextResponse.json({ error: "All swap endpoints failed" }, { status: 400 })
    }

    // Mode 2: Full quote + swap
    const { inputMint, outputMint, amount, userPublicKey, slippageBps = 500 } = body

    console.log("[v0] Full mode - quote + swap")
    console.log("[v0] Input:", inputMint, "Amount:", amount)

    if (!inputMint || !outputMint || !amount || !userPublicKey) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const quoteEndpoints = ["https://public.jupiterapi.com/quote", "https://quote-api.jup.ag/v6/quote"]

    let quote = null
    for (const endpoint of quoteEndpoints) {
      try {
        const quoteUrl = `${endpoint}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
        console.log(`[v0] Trying quote endpoint: ${endpoint}`)

        const quoteResponse = await fetch(quoteUrl, {
          headers: {
            Accept: "application/json",
          },
        })

        if (quoteResponse.ok) {
          const quoteText = await quoteResponse.text()
          try {
            quote = JSON.parse(quoteText)
            if (quote && quote.outAmount) {
              console.log(`[v0] Quote received from ${endpoint}! Output: ${quote.outAmount}`)
              break
            }
          } catch {
            console.log("[v0] Failed to parse quote response")
          }
        } else {
          console.log(`[v0] Quote endpoint failed with status: ${quoteResponse.status}`)
        }
      } catch (e: any) {
        console.log(`[v0] Quote endpoint error: ${e.message}`)
      }
    }

    if (!quote || !quote.outAmount) {
      console.log("[v0] No quote available from any endpoint")
      return NextResponse.json({ error: "No liquidity for this token", noLiquidity: true }, { status: 400 })
    }

    // Get swap transaction
    const swapEndpoints = ["https://public.jupiterapi.com/swap", "https://quote-api.jup.ag/v6/swap"]

    for (const endpoint of swapEndpoints) {
      try {
        console.log(`[v0] Trying swap endpoint: ${endpoint}`)

        const swapResponse = await fetch(endpoint, {
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

        if (swapResponse.ok) {
          const swapResult = await swapResponse.json()
          if (swapResult.swapTransaction) {
            console.log("[v0] Swap transaction generated successfully!")
            return NextResponse.json({
              success: true,
              swapTransaction: swapResult.swapTransaction,
              outAmount: quote.outAmount,
            })
          }
        } else {
          const errorText = await swapResponse.text()
          console.log(`[v0] Swap endpoint failed: ${errorText.substring(0, 200)}`)
        }
      } catch (e: any) {
        console.log(`[v0] Swap endpoint error: ${e.message}`)
      }
    }

    return NextResponse.json({ error: "Failed to generate swap transaction" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] Jupiter API Route exception:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
