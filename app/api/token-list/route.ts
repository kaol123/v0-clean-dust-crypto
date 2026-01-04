import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Token list API route called")

    const response = await fetch("https://token.jup.ag/strict", {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Jupiter API returned ${response.status}`)
    }

    const tokens = await response.json()
    console.log("[v0] Successfully fetched", tokens.length, "tokens from Jupiter")

    return NextResponse.json(tokens)
  } catch (error) {
    console.error("[v0] Error fetching token list:", error)
    return NextResponse.json({ error: "Failed to fetch token list" }, { status: 500 })
  }
}
