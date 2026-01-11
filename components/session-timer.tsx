"use client"

import { useState, useEffect, useCallback } from "react"
import { Shield, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

interface SessionTimerProps {
  onTimeout: () => void
  initialTime?: number // in seconds, default 120 (2 minutes)
}

export function SessionTimer({ onTimeout, initialTime = 120 }: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isPaused, setIsPaused] = useState(false)
  const { language } = useLanguage()
  const t = translations[language]

  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime)
    setIsPaused(false)
  }, [initialTime])

  const handleTimeout = useCallback(() => {
    onTimeout()
  }, [onTimeout])

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, handleTimeout])

  useEffect(() => {
    const handleActivity = () => {
      if (timeLeft > 0 && timeLeft < initialTime - 10) {
        resetTimer()
      }
    }

    window.addEventListener("click", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("scroll", handleActivity)

    return () => {
      window.removeEventListener("click", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("scroll", handleActivity)
    }
  }, [timeLeft, initialTime, resetTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getProgressColor = () => {
    const percentage = (timeLeft / initialTime) * 100
    if (percentage > 50) return "from-emerald-500 to-green-500"
    if (percentage > 25) return "from-yellow-500 to-amber-500"
    return "from-red-500 to-orange-500"
  }

  const getProgressWidth = () => {
    return `${(timeLeft / initialTime) * 100}%`
  }

  const isLowTime = timeLeft <= 30

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${
        isLowTime
          ? "border-red-500/50 bg-red-500/5 animate-pulse"
          : "border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-green-500/5"
      } p-4 transition-all duration-300`}
    >
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-800">
        <div
          className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-1000 ease-linear`}
          style={{ width: getProgressWidth() }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isLowTime ? "bg-red-500/20" : "bg-emerald-500/20"
            }`}
          >
            <Shield className={`h-5 w-5 ${isLowTime ? "text-red-400" : "text-emerald-400"}`} />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              {t.securitySession || "Security Session"}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono ${
                  isLowTime ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                <Clock className="h-3 w-3" />
                {formatTime(timeLeft)}
              </span>
            </h4>
            <p className="text-xs text-muted-foreground">
              {isLowTime
                ? t.sessionExpiringSoon || "Session expiring soon! Interact to extend."
                : t.autoDisconnectInfo || "Auto-disconnect for your security. Activity resets timer."}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetTimer}
          className={`gap-1.5 text-xs ${
            isLowTime
              ? "border-red-500/50 text-red-400 hover:bg-red-500/10"
              : "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t.extendSession || "Extend"}
        </Button>
      </div>
    </div>
  )
}
