"use client"

import { Sparkles, Trash2, Shield, Clock, Lock, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Logo } from "@/components/logo"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      <div className="container relative mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            {t.poweredBy}
          </div>

          <div className="mb-3 flex items-center justify-center gap-3">
            <Logo size={48} />
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">{t.title}</h1>
          </div>

          <p className="mb-4 text-pretty text-lg text-muted-foreground md:text-xl">{t.subtitle}</p>

          <div className="space-y-3">
            {/* Features principais */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trash2 className="h-4 w-4 text-accent" />
                {t.commission}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                {t.instantConversion}
              </div>
            </div>

            <div className="mx-auto max-w-2xl rounded-xl border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 p-3 backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                  <Shield className="h-4 w-4 text-green-500" />
                </div>
                <span className="text-base font-semibold text-green-400">{t.securityTitle}</span>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                {/* Conexao Segura - Reduzindo padding de p-3 para p-2 */}
                <div className="flex items-center gap-2 rounded-lg bg-background/50 p-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                    <Lock className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-medium text-green-400">{t.secureConnection}</p>
                    <p className="text-xs text-muted-foreground">{t.secureConnectionDesc}</p>
                  </div>
                </div>

                {/* Auto-desconexao - Reduzindo padding de p-3 para p-2 */}
                <div className="flex items-center gap-2 rounded-lg bg-background/50 p-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                    <Clock className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="whitespace-nowrap text-sm font-medium text-blue-400">{t.autoDisconnect}</p>
                    <p className="text-xs text-muted-foreground">{t.autoDisconnectDesc}</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  {t.noDataStored}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  {t.readOnlyAccess}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-green-400">
                  <CheckCircle className="h-3 w-3" />
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
