import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Jupiter API Route v1.6.6 - Server-side quote + swap")

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

    // Mode 2: Full quote + swap (server-side - no rate limiting issues)
    const { inputMint, outputMint, amount, userPublicKey, slippageBps = 500 } = body

    console.log("[v0] Full mode - server-side quote + swap")
    console.log("[v0] Input:", inputMint, "Amount:", amount)

    if (!inputMint || !outputMint || !amount || !userPublicKey) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const quoteEndpoints = [
      "https://public.jupiterapi.com/quote",
      "https://quote-api.jup.ag/v6/quote",
      "https://lite-api.jup.ag/swap/v1/quote",
    ]

    let quote = null
    let lastError = ""

    for (let retry = 0; retry < 3; retry++) {
      for (const endpoint of quoteEndpoints) {
        try {
          const quoteUrl = `${endpoint}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
          console.log(`[v0] Trying quote endpoint: ${endpoint} (attempt ${retry + 1})`)

          const quoteResponse = await fetch(quoteUrl, {
            headers: {
              Accept: "application/json",
              "User-Agent": "CryptoDustCleaner/1.0",
            },
          })

          if (quoteResponse.status === 429) {
            console.log(`[v0] Rate limited on ${endpoint}, waiting...`)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            continue
          }

          if (quoteResponse.ok) {
            const quoteText = await quoteResponse.text()
            try {
              const parsed = JSON.parse(quoteText)
              if (parsed && parsed.outAmount) {
                // Clean quote
                delete parsed.platformFee
                delete parsed.platformFeeBps
                quote = parsed
                console.log(`[v0] Quote received from ${endpoint}! Output: ${quote.outAmount}`)
                break
              }
            } catch {
              console.log("[v0] Failed to parse quote response")
            }
          } else {
            const errorText = await quoteResponse.text()
            lastError = errorText.substring(0, 100)
            console.log(`[v0] Quote endpoint failed: ${quoteResponse.status} - ${lastError}`)
          }
        } catch (e: any) {
          console.log(`[v0] Quote endpoint error: ${e.message}`)
          lastError = e.message
        }
      }

      if (quote) break

      // Wait before retry
      if (retry < 2) {
        console.log(`[v0] All endpoints failed, waiting 2s before retry...`)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    if (!quote || !quote.outAmount) {
      console.log("[v0] No quote available from any endpoint")
      return NextResponse.json(
        {
          error: lastError || "No liquidity for this token",
          noLiquidity: true,
        },
        { status: 400 },
      )
    }

    // Get swap transaction
    const swapEndpoints = [
      "https://public.jupiterapi.com/swap",
      "https://quote-api.jup.ag/v6/swap",
      "https://lite-api.jup.ag/swap/v1/swap",
    ]

    for (const endpoint of swapEndpoints) {
      try {
        console.log(`[v0] Trying swap endpoint: ${endpoint}`)

        const swapResponse = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "CryptoDustCleaner/1.0",
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
          console.log(`[v0] Swap endpoint failed: ${swapResponse.status} - ${errorText.substring(0, 200)}`)
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
