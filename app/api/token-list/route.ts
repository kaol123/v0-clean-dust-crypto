import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Token list API route called")

    const response = await fetch("https://token.jup.ag/strict", {
      headers: {
        Accept: "application/json",
      },
    })

    const contentType = response.headers.get("content-type")

    if (!response.ok) {
      // Se a resposta não for ok, tenta ler como texto para logar o erro real
      const errorText = await response.text()
      console.error("[v0] Jupiter API error:", response.status, errorText)
      return NextResponse.json({ error: "Jupiter API unavailable" }, { status: 500 })
    }

    // Verifica se a resposta é JSON válido
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text()
      console.error("[v0] Jupiter returned non-JSON response:", responseText.substring(0, 100))
      return NextResponse.json({ error: "Invalid response format" }, { status: 500 })
    }

    const tokens = await response.json()
    console.log("[v0] Successfully fetched", tokens.length, "tokens from Jupiter")

    return NextResponse.json(tokens)
  } catch (error) {
    console.error("[v0] Error fetching token list:", error)
    return NextResponse.json([])
  }
}
