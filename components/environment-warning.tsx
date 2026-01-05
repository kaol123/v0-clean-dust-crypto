"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, ExternalLink } from "lucide-react"

export function EnvironmentWarning() {
  const [isPreview, setIsPreview] = useState(false)
  const [productionUrl, setProductionUrl] = useState("")

  useEffect(() => {
    const hostname = window.location.hostname
    const isPreviewEnv = hostname.includes("vusercontent.net") || hostname.includes("v0.app")
    setIsPreview(isPreviewEnv)

    // Try to detect production URL from the page
    const prodUrl = hostname.includes("vusercontent.net") ? "https://v0-clean-dust-crypto.vercel.app" : ""
    setProductionUrl(prodUrl)
  }, [])

  if (!isPreview) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full px-4">
      <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-500 mb-1">Ambiente de Preview Detectado</h3>
            <p className="text-sm text-amber-200/90 mb-3">
              Você está acessando o preview do v0. A Phantom Wallet bloqueia transações em domínios de preview por
              segurança. Para usar o app, acesse o domínio de produção da Vercel.
            </p>
            {productionUrl && (
              <a
                href={productionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
              >
                Abrir no domínio de produção
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
