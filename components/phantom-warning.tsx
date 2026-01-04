"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PhantomWarning() {
  return (
    <Alert className="border-yellow-500/50 bg-yellow-500/10">
      <AlertTriangle className="h-5 w-5 text-yellow-500" />
      <AlertTitle className="text-lg font-semibold">Important: Deploy to Production</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p className="text-sm">
          Phantom Wallet blocks transactions on preview domains for security reasons. The Clean function will work
          properly only after deploying to your own production domain.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Button size="sm" variant="outline" asChild>
            <a
              href="https://vercel.com/docs/deployments/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              Deploy to Vercel <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a
              href="https://docs.phantom.app/developer-settings/trusted-apps"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              Learn More <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
