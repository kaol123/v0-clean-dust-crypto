"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Percent, AlertCircle, ExternalLink } from "lucide-react"
import type { Token } from "@/types/token"
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { SolanaService } from "@/lib/solana-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
    setFailedTokens([])

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

      console.log("[v0] Swap completed!")
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
          title: "Cleanup Complete!",
          description: `Successfully swapped ${successfulSwaps} token(s). You received ${result.userReceives.toFixed(6)} SOL. Commission: ${result.commission.toFixed(6)} SOL`,
        })
      } else {
        toast({
          title: "No Swaps Completed",
          description: "Unable to swap any tokens. See details below.",
          variant: "destructive",
        })
      }

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
    <div className="space-y-4">
      {failedTokens.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Some Tokens Could Not Be Swapped</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">The following tokens failed to swap:</p>
            <ul className="list-disc pl-5 space-y-1">
              {failedTokens.map((token, i) => (
                <li key={i}>
                  <strong>{token.symbol}</strong>: {token.reason}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-start gap-2 rounded-md bg-destructive/10 p-3">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-1">Alternative Solution:</p>
                <p className="mb-2">
                  You can swap these tokens directly in Phantom wallet using their built-in swap feature:
                </p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Open Phantom wallet</li>
                  <li>Click on the token you want to swap</li>
                  <li>Click "Swap" button</li>
                  <li>Select SOL as output</li>
                  <li>Complete the swap</li>
                </ol>
                <a
                  href="https://help.phantom.app/hc/en-us/articles/4406388623251-How-to-swap-tokens-in-Phantom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Learn more about swapping in Phantom
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </AlertDescription>
        </Alert>
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
