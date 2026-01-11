import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { WalletProvider } from "@/contexts/wallet-context"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { VersionBadge } from "@/components/version-badge"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Crypto Dust Cleaner - Clean Your Solana Wallet",
  description:
    "Automatically convert small token balances below $5 into SOL. Clean your Solana wallet dust with just one click.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <WalletProvider>
          <LanguageProvider>
            <Header />
            {children}
            <Toaster />
            <VersionBadge />
          </LanguageProvider>
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  )
}
