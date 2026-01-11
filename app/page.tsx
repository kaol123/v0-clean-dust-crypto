"use client"
import { Hero } from "@/components/hero"
import { Dashboard } from "@/components/dashboard"
import { useWallet } from "@/contexts/wallet-context"

export default function Page() {
  const { connected } = useWallet()

  return (
    <main className={`min-h-screen flex flex-col ${connected ? "overflow-auto" : "overflow-hidden h-screen"}`}>
      {!connected && <Hero />}
      <Dashboard />
    </main>
  )
}
