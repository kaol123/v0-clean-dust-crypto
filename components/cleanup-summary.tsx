"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Percent, AlertCircle } from "lucide-react"
import type { Token } from "@/types/token"
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { SolanaService } from "@/lib/solana-service"

interface CleanupSummaryProps {
  tokens: Token[]
  cleaning: boolean
  onCleanup: () => void
}

export function CleanupSummary({ tokens, cleaning, onCleanup }: CleanupSummaryProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [failedTokens, setFailedTokens] = useState<{ symbol: string; reason: string }[]>([])

  const dustTokens = tokens.filter((token) => token.usdValue < 5)

  const totalValueSol = dustTokens.reduce((sum, token) => sum + token.solValue, 0)
  const totalValueUsd = dustTokens.reduce((sum, token) => sum + token.usdValue, 0)

  const commissionSol = totalValueSol * 0.1
  const commissionUsd = totalValueUsd * 0.1

  const youReceiveSol = totalValueSol - commissionSol
  const youReceiveUsd = totalValueUsd - commissionUsd

  const handleCleanupDirect = async () => {
    console.log("[v0] ========== DIRECT CLEANUP CLICKED ==========")
    console.log("[v0] Window location:", window.location.href)
    console.log("[v0] Dust tokens:", dustTokens.length)
    console.log("[v0] Tokens passed to component:", tokens.length)
    console.log("[v0] window.solana exists:", "solana" in window)
    // @ts-ignore
    console.log("[v0] window.solana.isPhantom:", window.solana?.isPhantom)
    // @ts-ignore
    console.log("[v0] window.solana.isConnected:", window.solana?.isConnected)
    // @ts-ignore
    console.log("[v0] window.solana.publicKey:", window.solana?.publicKey?.toString())

    if (dustTokens.length === 0) {
      toast({
        title: "No Dust Tokens",
        description: "All your tokens are above $5",
      })
      return
    }

    setIsProcessing(true)
    setFailedTokens([])

    try {
      // @ts-ignore
      const { solana } = window

      console.log("[v0] Got window.solana reference")

      if (!solana?.isPhantom) {
        console.error("[v0] ❌ Phantom not detected!")
        throw new Error("Phantom wallet not found. Please install Phantom.")
      }

      console.log("[v0] ✅ Phantom detected")

      if (!solana.isConnected) {
        console.log("[v0] Wallet not connected, connecting...")
        await solana.connect()
        console.log("[v0] ✅ Connected")
      } else {
        console.log("[v0] ✅ Wallet already connected")
      }

      const publicKey = solana.publicKey?.toString()
      console.log("[v0] Public key:", publicKey)

      if (!publicKey) {
        console.error("[v0] ❌ Could not get public key!")
        throw new Error("Could not get wallet public key")
      }

      console.log("[v0] ✅ Connected wallet:", publicKey)
      console.log("[v0] Starting swap for", dustTokens.length, "tokens...")

      const solanaService = new SolanaService()

      console.log("[v0] Calling swapTokensToSol...")
      const result = await solanaService.swapTokensToSol(dustTokens, publicKey, solana)

      console.log("[v0] ✅ Swap completed!")
      console.log("[v0] Total received:", result.totalSol, "SOL")
      console.log("[v0] Commission:", result.commission, "SOL")
      console.log("[v0] User receives:", result.userReceives, "SOL")
      console.log("[v0] Failed tokens:", result.failedTokens.length)

      const successfulSwaps = dustTokens.length - result.failedTokens.length

      if (result.failedTokens.length > 0) {
        setFailedTokens(result.failedTokens)
      }

      if (successfulSwaps > 0) {
        toast({
          title: t.cleanupComplete,
          description: `${t.youReceived} ${result.userReceives.toFixed(6)} SOL`,
        })
      } else {
        toast({
          title: "No Swaps Completed",
          description: "Unable to swap any tokens. See details below.",
          variant: "destructive",
        })
      }

      console.log("[v0] Calling onCleanup callback...")
      onCleanup()
      console.log("[v0] ========== CLEANUP PROCESS COMPLETE ==========")
    } catch (error: any) {
      console.error("[v0] ❌ Direct cleanup failed:", error)
      console.error("[v0] Error name:", error.name)
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
      toast({
        title: "Cleanup Failed",
        description: error.message || "Could not complete cleanup",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      console.log("[v0] isProcessing set to false")
    }
  }

  const isLoading = cleaning || isProcessing

  console.log("[v0] ========== CLEANUP SUMMARY RENDER ==========")
  console.log("[v0] Total tokens received:", tokens.length)
  console.log("[v0] Dust tokens (< $5):", dustTokens.length)
  console.log("[v0] Is loading:", isLoading)
  console.log("[v0] Button will be rendered:", dustTokens.length > 0)
  console.log("[v0] ===============================================")

  if (dustTokens.length === 0) {
    return (
      <Card className="border-2 border-muted p-6 text-center">
        <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-xl font-semibold">{t.cleanupSummary}</h3>
        <p className="text-muted-foreground">{t.noTokensBelow}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {failedTokens.length > 0 && (
        <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 p-4">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 animate-pulse" />
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 p-2">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-amber-200 mb-2">
                {failedTokens.length}{" "}
                {failedTokens.length > 1 ? t.tokensCouldNotBeSwappedPlural : t.tokensCouldNotBeSwapped}
              </h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {failedTokens.map((token, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-lg px-3 py-1.5 text-sm font-medium text-amber-100"
                    title={token.reason}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    {token.symbol}
                  </span>
                ))}
              </div>
              <p className="text-sm text-amber-200/70">{t.insufficientLiquidity}</p>
            </div>
          </div>
        </div>
      )}

      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">{t.cleanupSummary}</h3>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-background/50 p-4">
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              {t.totalValue}
            </div>
            <p className="text-2xl font-bold">{totalValueSol.toFixed(6)} SOL</p>
            <p className="text-sm text-muted-foreground">${totalValueUsd.toFixed(4)} USD</p>
          </div>

          <div className="rounded-lg bg-background/50 p-4">
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Percent className="h-4 w-4" />
              {t.commissionLabel}
            </div>
            <p className="text-2xl font-bold">{commissionSol.toFixed(6)} SOL</p>
            <p className="text-sm text-muted-foreground">${commissionUsd.toFixed(4)} USD</p>
          </div>

          <div className="rounded-lg bg-accent/10 p-4">
            <div className="mb-1 flex items-center gap-2 text-sm text-accent">
              <Sparkles className="h-4 w-4" />
              {t.youReceive}
            </div>
            <p className="text-2xl font-bold text-accent">{youReceiveSol.toFixed(6)} SOL</p>
            <p className="text-sm text-accent/80">${youReceiveUsd.toFixed(4)} USD</p>
          </div>
        </div>

        <Button
          onClick={() => {
            console.log("[v0] BUTTON ONCLICK FIRED!!!")
            handleCleanupDirect()
          }}
          disabled={isLoading}
          size="lg"
          className="w-full gap-2 bg-gradient-to-r from-primary to-accent text-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Sparkles className="h-5 w-5" />
          {isLoading ? t.cleaning : t.cleanWalletNow}
        </Button>
      </Card>
    </div>
  )
}
