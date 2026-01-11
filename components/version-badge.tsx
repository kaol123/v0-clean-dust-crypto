"use client"

const APP_VERSION = "1.2.3"
const BUILD_DATE = "2026-01-11"

export function VersionBadge() {
  return (
    <div className="fixed bottom-2 right-2 z-50">
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-md px-2 py-1 text-xs text-muted-foreground font-mono">
        v{APP_VERSION} • {BUILD_DATE}
      </div>
    </div>
  )
}
