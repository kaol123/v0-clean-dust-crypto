"use client"

const APP_VERSION = "1.7.5"
const BUILD_DATE = "2026-01-11"

export function VersionBadge() {
  return (
    <div className="fixed bottom-1 right-1 z-50">
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-md px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
        v{APP_VERSION} • {BUILD_DATE}
      </div>
    </div>
  )
}
