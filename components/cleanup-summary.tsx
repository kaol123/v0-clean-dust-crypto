"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Percent } from "lucide-react"
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

  const dustTokens = tokens.filter((token) => token.usdValue < 1)

  const totalValueSol = dustTokens.reduce((sum, token) => sum + token.solValue, 0)
  const totalValueUsd = dustTokens.reduce((sum, token) => sum + token.usdValue, 0)

  const commissionSol = totalValueSol * 0.1
  const commissionUsd = totalValueUsd * 0.1

  const youReceiveSol = totalValueSol - commissionSol
  const youReceiveUsd = totalValueUsd - commissionUsd

  const handleCleanupDirect = async () => {
    console.log("[v0] ========== DIRECT CLEANUP CLICKED ==========")
    console.log("[v0] Dust tokens:", dustTokens.length)

    if (dustTokens.length === 0) {
      toast({
        title: "No Dust Tokens",
        description: "All your tokens are above $1",
      })
      return
    }

    setIsProcessing(true)

    try {
      // @ts-ignore
      const { solana } = window

      if (!solana?.isPhantom) {
        throw new Error("Phantom wallet not found. Please install Phantom.")
      }

      if (!solana.isConnected) {
        console.log("[v0] Wallet not connected, connecting...")
        await solana.connect()
      }

      const publicKey = solana.publicKey?.toString()
      if (!publicKey) {
        throw new Error("Could not get wallet public key")
      }

      console.log("[v0] Connected wallet:", publicKey)
      console.log("[v0] Starting swap for", dustTokens.length, "tokens...")

      const solanaService = new SolanaService()
      const result = await solanaService.swapTokensToSol(dustTokens, publicKey, solana)

      console.log("[v0] Swap completed successfully!")
      console.log("[v0] Total received:", result.totalSol, "SOL")
      console.log("[v0] Commission:", result.commission, "SOL")
      console.log("[v0] User receives:", result.userReceives, "SOL")

      toast({
        title: "Cleanup Complete!",
        description: `You received ${result.userReceives.toFixed(6)} SOL. Commission: ${result.commission.toFixed(6)} SOL`,
      })

      onCleanup()
    } catch (error: any) {
      console.error("[v0] Direct cleanup failed:", error)
      toast({
        title: "Cleanup Failed",
        description: error.message || "Could not complete cleanup",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const isLoading = cleaning || isProcessing

  console.log("[v0] ========== CLEANUP SUMMARY RENDER ==========")
  console.log("[v0] Total tokens received:", tokens.length)
  console.log("[v0] Dust tokens (< $1):", dustTokens.length)
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
        onMouseEnter={() => console.log("[v0] Button mouse enter")}
        onMouseLeave={() => console.log("[v0] Button mouse leave")}
        disabled={isLoading}
        size="lg"
        className="relative z-50 w-full gap-2 bg-gradient-to-r from-primary to-accent text-lg font-semibold pointer-events-auto hover:opacity-90 transition-opacity cursor-pointer"
        style={{ pointerEvents: "auto" }}
      >
        <Sparkles className="h-5 w-5" />
        {isLoading ? t.cleaning : t.cleanWalletNow}
      </Button>
    </Card>
  )
}
