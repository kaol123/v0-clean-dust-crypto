"use client"
import { WalletConnect } from "@/components/wallet-connect"
import { TokenList } from "@/components/token-list"
import { CleanupSummary } from "@/components/cleanup-summary"
import { PhantomWarning } from "@/components/phantom-warning"
import { useWallet } from "@/contexts/wallet-context"
import { useEffect } from "react"

export function Dashboard() {
  const walletState = useWallet()
  const { connected, publicKey, tokens, loading, cleaning, cleanupWallet } = walletState

  useEffect(() => {
    console.log("[v0] ========== DASHBOARD useWallet() RESULT ==========")
    console.log("[v0] RAW connected value:", connected, "type:", typeof connected)
    console.log("[v0] RAW publicKey value:", publicKey, "type:", typeof publicKey)
    console.log("[v0] RAW publicKey === null:", publicKey === null)
    console.log("[v0] RAW tokens.length:", tokens.length)
    console.log("[v0] Tokens data:", JSON.stringify(tokens.map((t) => ({ symbol: t.symbol, usd: t.usdValue }))))
    console.log("[v0] ====================================================")
  }, [connected, publicKey, tokens])

  console.log("[v0] Dashboard render - connected:", connected, "publicKey exists:", !!publicKey)

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <WalletConnect />

        {connected && publicKey && <PhantomWarning />}

        {connected && publicKey && (
          <div className="space-y-8">
            <CleanupSummary tokens={tokens} cleaning={cleaning} onCleanup={cleanupWallet} />
            <TokenList tokens={tokens} loading={loading} />
          </div>
        )}
      </div>
    </section>
  )
}
