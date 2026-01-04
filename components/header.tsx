"use client"

import { LanguageSwitcher } from "@/components/language-switcher"

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <LanguageSwitcher />
      </div>
    </header>
  )
}
