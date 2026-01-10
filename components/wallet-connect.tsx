"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, Power } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { useLanguage } from "@/contexts/language-context"
import { useEffect } from "react"

export function WalletConnect() {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet()
  const { t } = useLanguage()

  useEffect(() => {
    console.log("[v0] ========== WALLET CONNECT RENDER ==========")
    console.log("[v0] connected:", connected)
    console.log("[v0] connecting:", connecting)
    console.log("[v0] publicKey:", publicKey)
    console.log("[v0] Button visible:", !connected)
    console.log("[v0] ==============================================")
  }, [connected, connecting, publicKey])

  const handleConnect = () => {
    console.log("[v0] ========== CONNECT BUTTON CLICKED ==========")
    console.log("[v0] About to call connect()")
    connect()
  }

  return (
    <Card className="border-2 border-border/50 bg-card p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <h2 className="mb-2 text-2xl font-bold">{connected ? t.walletConnected : t.connectWallet}</h2>
          {connected && publicKey ? (
            <p className="font-mono text-sm text-muted-foreground">
              {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
            </p>
          ) : (
            <p className="text-muted-foreground">{t.connectPhantom}</p>
          )}
        </div>

        <div className="flex gap-2">
          {connected ? (
            <Button onClick={disconnect} variant="destructive" size="lg" className="gap-2">
              <Power className="h-5 w-5" />
              {t.disconnect}
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={connecting} size="lg" className="gap-2">
              <Wallet className="h-5 w-5" />
              {connecting ? t.connecting : t.connectButton}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
