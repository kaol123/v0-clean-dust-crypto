"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Loader2, Check, AlertCircle, Sparkles, ArrowRight, Wallet } from "lucide-react"

export type SwapStep = {
  id: string
  tokenSymbol: string
  status: "pending" | "swapping" | "sending-commission" | "completed" | "failed"
  errorMessage?: string
}

interface ProgressModalProps {
  isOpen: boolean
  steps: SwapStep[]
  currentTokenIndex: number
  totalTokens: number
}

export function ProgressModal({ isOpen, steps, currentTokenIndex, totalTokens }: ProgressModalProps) {
  const { t } = useLanguage()
  const [dots, setDots] = useState("")

  // Animate dots
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const completedSteps = steps.filter((s) => s.status === "completed").length
  const failedSteps = steps.filter((s) => s.status === "failed").length
  const progress = totalTokens > 0 ? ((completedSteps + failedSteps) / totalTokens) * 100 : 0

  const getStatusIcon = (status: SwapStep["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="h-5 w-5 text-green-400" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      case "swapping":
      case "sending-commission":
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
    }
  }

  const getStatusText = (step: SwapStep) => {
    switch (step.status) {
      case "completed":
        return t.swapCompleted || "Completed"
      case "failed":
        return step.errorMessage || t.swapFailed || "Failed"
      case "swapping":
        return t.swappingToken || "Swapping"
      case "sending-commission":
        return t.sendingCommission || "Sending commission"
      default:
        return t.waiting || "Waiting"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-background via-background to-primary/5 border border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t.processingSwaps || "Processing Swaps"}
            {dots}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {t.pleaseConfirmTransactions || "Please confirm all transactions in your wallet"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{t.progress || "Progress"}</span>
            <span>
              {completedSteps + failedSteps} / {totalTokens}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="p-6 max-h-64 overflow-y-auto">
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  step.status === "swapping" || step.status === "sending-commission"
                    ? "bg-primary/10 border border-primary/30"
                    : step.status === "completed"
                      ? "bg-green-500/10 border border-green-500/20"
                      : step.status === "failed"
                        ? "bg-red-500/10 border border-red-500/20"
                        : "bg-muted/30"
                }`}
              >
                {getStatusIcon(step.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{step.tokenSymbol}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">SOL</span>
                  </div>
                  <p
                    className={`text-xs truncate ${
                      step.status === "failed" ? "text-red-400" : "text-muted-foreground"
                    }`}
                  >
                    {getStatusText(step)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Wallet className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-200">
              {t.doNotCloseWindow || "Do not close this window. Confirm each transaction in your Phantom wallet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
