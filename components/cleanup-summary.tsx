"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Percent, AlertCircle } from "lucide-react"
import type { Token } from "@/types/token"
import { useLanguage } from "@/contexts/language-context"
import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { SolanaService } from "@/lib/solana-service"
import { ProgressModal, type SwapStep } from "@/components/progress-modal"

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

  const [showProgressModal, setShowProgressModal] = useState(false)
  const [swapSteps, setSwapSteps] = useState<SwapStep[]>([])
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0)
  const [showFinalization, setShowFinalization] = useState(false)
  const [finalizationStatus, setFinalizationStatus] = useState<"pending" | "processing" | "completed" | "failed">(
    "pending",
  )

  const dustTokens = tokens.filter((token) => token.usdValue < 5)

  const totalValueSol = dustTokens.reduce((sum, token) => sum + token.solValue, 0)
  const totalValueUsd = dustTokens.reduce((sum, token) => sum + token.usdValue, 0)

  const commissionSol = totalValueSol * 0.1
  const commissionUsd = totalValueUsd * 0.1

  const youReceiveSol = totalValueSol - commissionSol
  const youReceiveUsd = totalValueUsd - commissionUsd

  const updateStepStatus = useCallback((tokenSymbol: string, status: SwapStep["status"], errorMessage?: string) => {
    if (tokenSymbol === "__FINALIZATION__") {
      if (status === "sending-commission") {
        setShowFinalization(true)
        setFinalizationStatus("processing")
      } else if (status === "completed") {
        setFinalizationStatus("completed")
      } else if (status === "failed") {
        setFinalizationStatus("failed")
      }
      return
    }

    setSwapSteps((prev) =>
      prev.map((step) => (step.tokenSymbol === tokenSymbol ? { ...step, status, errorMessage } : step)),
    )
    if (status === "completed" || status === "failed") {
      setCurrentTokenIndex((prev) => prev + 1)
    }
  }, [])

  const handleCleanupDirect = async () => {
    if (dustTokens.length === 0) {
      toast({
        title: "No Dust Tokens",
        description: "All your tokens are above $5",
      })
      return
    }

    setIsProcessing(true)
    setFailedTokens([])
    setShowFinalization(false)
    setFinalizationStatus("pending")

    const initialSteps: SwapStep[] = dustTokens.map((token) => ({
      id: token.mint,
      tokenSymbol: token.symbol,
      status: "pending",
    }))
    setSwapSteps(initialSteps)
    setCurrentTokenIndex(0)
    setShowProgressModal(true)

    try {
      const { solana } = window

      if (!solana?.isPhantom) {
        throw new Error("Phantom wallet not found. Please install Phantom.")
      }

      if (!solana.isConnected) {
        await solana.connect()
      }

      const publicKey = solana.publicKey?.toString()

      if (!publicKey) {
        throw new Error("Could not get wallet public key")
      }

      const solanaService = new SolanaService()

      const result = await solanaService.swapTokensToSol(dustTokens, publicKey, solana, updateStepStatus)

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

      onCleanup()
    } catch (error: any) {
      toast({
        title: "Cleanup Failed",
        description: error.message || "Could not complete cleanup",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setTimeout(() => setShowProgressModal(false), 2000)
    }
  }

  const isLoading = cleaning || isProcessing

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
      <ProgressModal
        isOpen={showProgressModal}
        steps={swapSteps}
        currentTokenIndex={currentTokenIndex}
        totalTokens={dustTokens.length}
        showFinalization={showFinalization}
        finalizationStatus={finalizationStatus}
      />

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
          onClick={handleCleanupDirect}
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
