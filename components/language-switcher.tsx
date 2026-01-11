"use client"

import { useLanguage, type Language } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
        <Button variant="outline" size="sm" className="gap-2 bg-transparent px-2">
          <Image
            src={currentLanguage?.flag || "/flags/us.svg"}
            alt={currentLanguage?.name || "English"}
            width={24}
            height={18}
            className="rounded-sm"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src={lang.flag || "/placeholder.svg"}
              alt={lang.name}
              width={24}
              height={18}
              className="rounded-sm"
            />
            <span>{lang.name}</span>
            {language === lang.code && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
