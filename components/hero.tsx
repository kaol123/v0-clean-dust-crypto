"use client"

import { Sparkles, Trash2, Shield, Clock, Lock, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Logo } from "@/components/logo"

interface HeroProps {
  compact?: boolean
}

export function Hero({ compact = false }: HeroProps) {
  const { t } = useLanguage()

  if (compact) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-background to-accent/5 border-b-2 border-primary/20">
        <div className="container mx-auto px-4 py-3">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <div className="flex items-center gap-2">
                <Logo size={28} />
                <h1 className="text-lg font-bold tracking-tight sm:text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t.title}
                </h1>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 border border-accent/20">
                  <Trash2 className="h-3 w-3 text-accent" />
                  <span>{t.commission}</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 border border-green-500/20">
                  <Shield className="h-3 w-3 text-green-500" />
                  <span>{t.secureConnection}</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 border border-blue-500/20">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span>{t.autoDisconnect}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      <div className="container relative mx-auto px-4 py-4 md:py-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary md:px-3 md:py-1.5 md:text-sm md:gap-2">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
            {t.poweredBy}
          </div>

          <div className="mb-2 flex items-center justify-center gap-2 md:gap-3">
            <Logo size={40} className="md:hidden" />
            <Logo size={48} className="hidden md:block" />
            <h1 className="text-balance text-2xl font-bold tracking-tight md:text-5xl">{t.title}</h1>
          </div>

          <p className="mb-3 text-pretty text-sm text-muted-foreground md:text-xl">{t.subtitle}</p>

          <div className="space-y-2 md:space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground md:text-sm md:gap-2">
                <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                {t.commission}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground md:text-sm md:gap-2">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                {t.instantConversion}
              </div>
            </div>

            <div className="mx-auto max-w-2xl rounded-lg border border-green-500/30 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 p-3 md:p-4 md:rounded-xl md:border-2 backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-center gap-1.5 md:gap-2">
                <div className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-green-500/20">
                  <Shield className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                </div>
                <span className="text-sm md:text-base font-semibold text-green-400">{t.securityTitle}</span>
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-background/50 p-2 md:p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                    <Lock className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs md:text-sm font-medium text-green-400">{t.secureConnection}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{t.secureConnectionDesc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-background/50 p-2 md:p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                    <Clock className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs md:text-sm font-medium text-blue-400">{t.autoDisconnect}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{t.autoDisconnectDesc}</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] md:text-xs text-green-400">
                  <CheckCircle className="h-2.5 w-2.5 md:h-3 md:w-3" />
                  {t.noDataStored}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] md:text-xs text-green-400">
                  <CheckCircle className="h-2.5 w-2.5 md:h-3 md:w-3" />
                  {t.readOnlyAccess}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] md:text-xs text-green-400">
                  <CheckCircle className="h-2.5 w-2.5 md:h-3 md:w-3" />
                  {t.transparentFees}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
