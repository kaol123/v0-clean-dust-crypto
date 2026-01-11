"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Wallet,
  Power,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Smartphone,
  Search,
  Copy,
  Check,
} from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { useLanguage } from "@/contexts/language-context"

export function WalletConnect() {
  const { connected, connecting, publicKey, connect, disconnect, connectionError } = useWallet()
  const { t } = useLanguage()

  const [hasPhantom, setHasPhantom] = useState<boolean | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isInPhantomBrowser, setIsInPhantomBrowser] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)
  const [siteUrl, setSiteUrl] = useState("")

  useEffect(() => {
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setIsMobile(checkMobile)
    setSiteUrl(window.location.origin)

    const checkPhantom = () => {
      const phantom = (window as any).solana
      const isPhantom = phantom?.isPhantom === true
      setHasPhantom(isPhantom)
      setIsInPhantomBrowser(isPhantom && checkMobile)
    }

    checkPhantom()
    const timeout = setTimeout(checkPhantom, 1000)
    return () => clearTimeout(timeout)
  }, [])

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    } catch (err) {
      const textArea = document.createElement("textarea")
      textArea.value = siteUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    }
  }

  if (isMobile && !isInPhantomBrowser && hasPhantom === false) {
    return (
      <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
            <Smartphone className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-purple-400">{t.openInPhantomBrowser}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.mobileInstructions}</p>
          </div>

          <div className="w-full mt-2 p-3 rounded-lg bg-background/50 border border-border/50">
            <h3 className="font-semibold text-sm text-foreground mb-2">{t.howToOpen}</h3>
            <ol className="text-left space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs text-purple-400">
                  1
                </span>
                <span>{t.mobileStep1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs text-purple-400">
                  2
                </span>
                <span className="flex items-center gap-2 flex-wrap">
                  {t.mobileStep2}
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-lg bg-purple-500/30 border border-purple-500/50">
                    <Search className="h-3 w-3 text-purple-400" />
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs text-purple-400">
                  3
                </span>
                <span>{t.mobileStep3}</span>
              </li>
            </ol>
          </div>

          <div className="w-full mt-1">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border">
              <code className="flex-1 text-sm text-muted-foreground truncate">{siteUrl}</code>
              <Button
                onClick={copyUrl}
                size="sm"
                variant={urlCopied ? "default" : "outline"}
                className={`gap-2 shrink-0 ${urlCopied ? "bg-green-500 hover:bg-green-500" : ""}`}
              >
                {urlCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    {t.urlCopied}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {t.copyUrl}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (!isMobile && hasPhantom === false) {
    return (
      <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-4">
        <div className="flex flex-col items-center text-center gap-3 sm:flex-row sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-500/20">
            <Download className="h-6 w-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-purple-400">{t.phantomNotInstalled}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.phantomNotInstalledDesc}</p>
          </div>
          <Button asChild size="default" className="gap-2 bg-purple-600 hover:bg-purple-700">
            <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer">
              <Download className="h-5 w-5" />
              {t.installPhantom}
            </a>
          </Button>
        </div>
      </Card>
    )
  }

  if (hasPhantom === null) {
    return (
      <Card className="border-2 border-border/50 bg-card p-4">
        <div className="flex items-center justify-center gap-3 py-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="text-muted-foreground">{t.connecting}</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-border/50 bg-card p-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${connected ? "bg-green-500/20" : "bg-primary/20"}`}
          >
            {connected ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Wallet className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">{connected ? t.walletConnected : t.connectWallet}</h2>
            {connected && publicKey ? (
              <p className="font-mono text-sm text-muted-foreground">
                {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{t.connectPhantom}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {connected ? (
            <Button onClick={disconnect} variant="destructive" size="default" className="gap-2">
              <Power className="h-4 w-4" />
              {t.disconnect}
            </Button>
          ) : (
            <Button onClick={connect} disabled={connecting} size="default" className="gap-2">
              <Wallet className="h-4 w-4" />
              {connecting ? t.connecting : t.connectButton}
            </Button>
          )}
        </div>
      </div>

      {connectionError === "phantom_blocked" && !connected && (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-500">{t.connectionBlocked}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.connectionBlockedDesc}</p>
              <ol className="mt-2 space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                <li>{t.connectionBlockedStep1}</li>
                <li>{t.connectionBlockedStep2}</li>
                <li>{t.connectionBlockedStep3}</li>
                <li>{t.connectionBlockedStep4}</li>
              </ol>
              <Button
                onClick={connect}
                variant="outline"
                size="sm"
                className="mt-3 gap-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 bg-transparent"
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
