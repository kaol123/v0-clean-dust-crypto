"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, Power, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { useLanguage } from "@/contexts/language-context"

export function WalletConnect() {
  const { connected, connecting, publicKey, connect, disconnect, connectionError } = useWallet()
  const { t } = useLanguage()

  return (
    <Card className="border-2 border-border/50 bg-card p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${connected ? "bg-green-500/20" : "bg-primary/20"}`}
          >
            {connected ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : (
              <Wallet className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="mb-1 text-2xl font-bold">{connected ? t.walletConnected : t.connectWallet}</h2>
            {connected && publicKey ? (
              <p className="font-mono text-sm text-muted-foreground">
                {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
              </p>
            ) : (
              <p className="text-muted-foreground">{t.connectPhantom}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {connected ? (
            <Button onClick={disconnect} variant="destructive" size="lg" className="gap-2">
              <Power className="h-5 w-5" />
              {t.disconnect}
            </Button>
          ) : (
            <Button onClick={connect} disabled={connecting} size="lg" className="gap-2">
              <Wallet className="h-5 w-5" />
              {connecting ? t.connecting : t.connectButton}
            </Button>
          )}
        </div>
      </div>

      {connectionError === "phantom_blocked" && !connected && (
        <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-500">{t.connectionBlocked}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.connectionBlockedDesc}</p>
              <ol className="mt-3 space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                <li>{t.connectionBlockedStep1}</li>
                <li>{t.connectionBlockedStep2}</li>
                <li>{t.connectionBlockedStep3}</li>
                <li>{t.connectionBlockedStep4}</li>
              </ol>
              <Button
                onClick={connect}
                variant="outline"
                size="sm"
                className="mt-4 gap-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 bg-transparent"
              >
                <RefreshCw className="h-4 w-4" />
                {t.tryAgain}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
