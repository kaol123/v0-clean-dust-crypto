"use client"

import { useLanguage, type Language } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import Image from "next/image"

const languages = [
  { code: "en" as Language, name: "English", flag: "/flags/us.svg" },
  { code: "pt" as Language, name: "Português", flag: "/flags/br.svg" },
  { code: "es" as Language, name: "Español", flag: "/flags/es.svg" },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="gap-2 bg-background/50 backdrop-blur-sm border-2 border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-500/10 px-3 py-2 transition-all"
        >
          <Globe className="h-4 w-4 text-emerald-400" />
          <Image
            src={currentLanguage?.flag || "/flags/us.svg"}
            alt={currentLanguage?.name || "English"}
            width={32}
            height={24}
            className="rounded-sm shadow-sm"
          />
          <span className="text-sm font-medium text-foreground hidden sm:inline">
            {currentLanguage?.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-3 cursor-pointer py-2"
          >
            <Image
              src={lang.flag || "/placeholder.svg"}
              alt={lang.name}
              width={32}
              height={24}
              className="rounded-sm shadow-sm"
            />
            <span className="font-medium">{lang.name}</span>
            {language === lang.code && <span className="ml-auto text-emerald-400">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
