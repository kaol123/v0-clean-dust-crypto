"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Coins, DollarSign, RefreshCw } from "lucide-react"
import type { Token } from "@/types/token"
import { useLanguage } from "@/contexts/language-context"
import { useWallet } from "@/contexts/wallet-context"
import Image from "next/image"

interface TokenListProps {
  tokens: Token[]
  loading: boolean
}

export function TokenList({ tokens, loading }: TokenListProps) {
  const { t } = useLanguage()
  const { refreshTokens, refreshing } = useWallet()

  console.log("[v0] TokenList render:", { tokensCount: tokens.length, loading })
  console.log("[v0] TokenList all tokens:", tokens)

  const dustTokens = tokens.filter((token) => token.usdValue < 1)
  console.log("[v0] TokenList dust tokens:", dustTokens.length, dustTokens)

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 text-xl font-semibold">{t.yourTokens}</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (tokens.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Coins className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">{t.noTokensFound}</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold">{t.tokensToClean}</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {dustTokens.length} {dustTokens.length === 1 ? t.token : t.tokens}
          </Badge>
          <Button
            onClick={refreshTokens}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {t.refresh}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {dustTokens.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">{t.noTokensBelow}</p>
          </div>
        ) : (
          dustTokens.map((token, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/20">
                  {token.logoURI ? (
                    <Image
                      src={token.logoURI || "/placeholder.svg"}
                      alt={token.symbol}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                      }}
                    />
                  ) : (
                    <Coins className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{token.symbol}</p>
                  <p className="text-xs text-muted-foreground">{token.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {token.balance.toFixed(4)} {t.tokens}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 font-semibold">
                  <DollarSign className="h-4 w-4" />
                  {token.usdValue > 0 ? token.usdValue.toFixed(4) : "0.0000"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {token.solValue > 0 ? token.solValue.toFixed(6) : "0.000000"} SOL
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
