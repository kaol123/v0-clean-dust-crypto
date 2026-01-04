"use client"

import { Sparkles, Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            {t.poweredBy}
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-7xl">{t.title}</h1>

          <p className="mb-8 text-pretty text-xl text-muted-foreground md:text-2xl">{t.subtitle}</p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trash2 className="h-4 w-4 text-accent" />
              {t.commission}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {t.instantConversion}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
