"use client"

import { AlertTriangle, ExternalLink, CheckCircle, Clock, FileText } from "lucide-react"
import { useState } from "react"

export function PhantomUnblockInfo() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-orange-500 mb-2">Domínio Bloqueado pela Phantom Wallet</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Seu domínio <span className="font-mono text-orange-400">cryptodustcleaner.xyz</span> está temporariamente
            bloqueado por ser novo. Isto é normal para proteção contra fraudes.
          </p>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-orange-400 hover:text-orange-300 underline mb-3"
          >
            {isExpanded ? "Ocultar soluções" : "Ver como resolver →"}
          </button>

          {isExpanded && (
            <div className="space-y-4 mt-4 text-sm">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Solução Oficial (Recomendado)</h4>
                    <p className="text-muted-foreground mb-3">
                      Use o formulário oficial da Phantom para solicitar revisão do seu domínio:
                    </p>
                    <a
                      href="https://docs.google.com/forms/d/1JgIxdmolgh_80xMfQKBKx9-QPC7LRdN6LHpFFW8BlKM/viewform"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Abrir Formulário de Revisão
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <p className="text-xs text-muted-foreground mt-2">Timeline: 3-7 dias úteis</p>
                  </div>
                </div>
              </div>

              <div className="bg-background/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Aguardar Reputação Natural</h4>
                    <p className="text-muted-foreground">
                      Domínios novos são bloqueados automaticamente. Após 2-4 semanas sem atividade suspeita, podem ser
                      desbloqueados automaticamente.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Testar Agora (Temporário)</h4>
                    <p className="text-muted-foreground">
                      Na Phantom, clique em &quot;Continuar na mesma (não seguro)&quot; para testar.
                      <br />
                      <span className="text-yellow-500 font-semibold">
                        ⚠️ Apenas faça isso porque VOCÊ desenvolveu o código e sabe que é seguro.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground border-t border-border pt-3">
                <p className="font-semibold mb-2">Documentação Oficial:</p>
                <div className="space-y-1">
                  <a
                    href="https://docs.phantom.com/developer-powertools/domain-and-transaction-warnings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300"
                  >
                    Domain and Transaction Warnings
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <br />
                  <a
                    href="https://help.phantom.app/hc/en-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300"
                  >
                    Phantom Support Center
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
