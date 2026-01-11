"use client"
import { WalletConnect } from "@/components/wallet-connect"
import { TokenList } from "@/components/token-list"
import { CleanupSummary } from "@/components/cleanup-summary"
import { useWallet } from "@/contexts/wallet-context"

export function Dashboard() {
  const walletState = useWallet()
  const { connected, publicKey, tokens, loading, cleaning, cleanupWallet } = walletState

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <WalletConnect />

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
