import { Hero } from "@/components/hero"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
  return (
    <main className="h-screen overflow-hidden flex flex-col">
      <Hero />
      <Dashboard />
    </main>
  )
}
