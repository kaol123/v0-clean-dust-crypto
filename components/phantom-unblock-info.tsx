"use client"

import { AlertTriangle, ExternalLink, CheckCircle, Clock } from "lucide-react"
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
              <div className="bg-background/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      1. Solicitar Revisão no Blowfish (Recomendado)
                    </h4>
                    <p className="text-muted-foreground mb-2">
                      O Blowfish é o serviço de segurança que a Phantom usa. Solicite a remoção do bloqueio:
                    </p>
                    <a
                      href="https://blowfish.xyz/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300"
                    >
                      Acessar Blowfish
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">2. Contatar Phantom Support</h4>
                    <p className="text-muted-foreground mb-2">Solicite revisão manual do seu domínio:</p>
                    <a
                      href="https://help.phantom.app/hc/en-us/requests/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300"
                    >
                      Abrir Ticket de Suporte
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">3. Aguardar (2-4 semanas)</h4>
                    <p className="text-muted-foreground">
                      Domínios novos são bloqueados automaticamente. Após algumas semanas sem atividade suspeita, podem
                      ser desbloqueados automaticamente.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">4. Testar Agora (Use com Cuidado)</h4>
                    <p className="text-muted-foreground">
                      Na Phantom, clique em &quot;Continuar na mesma (não seguro)&quot; para testar.
                      <br />
                      <span className="text-yellow-500 font-semibold">
                        Apenas faça isso porque VOCÊ desenvolveu o código e sabe que é seguro.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground border-t border-border pt-3">
                <p className="font-semibold mb-1">Timeline esperado:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Revisão Blowfish/Phantom: 3-7 dias úteis</li>
                  <li>Desbloqueio automático: 2-4 semanas</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
