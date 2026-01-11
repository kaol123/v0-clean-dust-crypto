"use client"
import { WalletConnect } from "@/components/wallet-connect"
import { TokenList } from "@/components/token-list"
import { CleanupSummary } from "@/components/cleanup-summary"
import { SessionTimer } from "@/components/session-timer"
import { useWallet } from "@/contexts/wallet-context"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

export function Dashboard() {
  const walletState = useWallet()
  const { connected, publicKey, tokens, loading, cleaning, cleanupWallet, disconnect } = walletState
  const { language } = useLanguage()
  const t = translations[language]

  const handleSessionTimeout = () => {
    disconnect()
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <WalletConnect />

        {connected && publicKey && (
          <div className="space-y-4">
            <SessionTimer onTimeout={handleSessionTimeout} initialTime={120} />
            <CleanupSummary tokens={tokens} cleaning={cleaning} onCleanup={cleanupWallet} />
            <TokenList tokens={tokens} loading={loading} />
          </div>
        )}
      </div>
    </section>
  )
}
