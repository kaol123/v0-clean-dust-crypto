"use client"

import { useRef } from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Token } from "@/types/token"
import { SolanaService } from "@/lib/solana-service"

interface WalletContextType {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  tokens: Token[]
  loading: boolean
  cleaning: boolean
  refreshing: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  cleanupWallet: () => Promise<void>
  refreshTokens: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const stateRef = useRef({
    connected: false,
    publicKey: null as string | null,
  })

  const [state, setState] = useState<{
    connected: boolean
    connecting: boolean
    publicKey: string | null
    tokens: Token[]
    loading: boolean
    cleaning: boolean
    refreshing: boolean
  }>({
    connected: false,
    connecting: false,
    publicKey: null,
    tokens: [],
    loading: false,
    cleaning: false,
    refreshing: false,
  })

  const { toast } = useToast()
  const solanaService = new SolanaService()

  useEffect(() => {
    console.log("[v0] ========== STATE UPDATED ==========")
    console.log("[v0] connected:", state.connected)
    console.log("[v0] publicKey:", state.publicKey)
    console.log("[v0] tokens:", state.tokens.length)
    console.log("[v0] ====================================")
  }, [state])

  const connect = async () => {
    console.log("[v0] ========== CONNECT FUNCTION CALLED ==========")
    console.log("[v0] Window location:", typeof window !== "undefined" ? window.location.href : "SSR")
    console.log("[v0] Window.solana exists:", typeof window !== "undefined" && "solana" in window)

    setState((prev) => ({ ...prev, connecting: true }))

    try {
      // @ts-ignore - Added detailed checks for Phantom
      const { solana } = window

      console.log("[v0] window.solana:", solana)
      console.log("[v0] solana.isPhantom:", solana?.isPhantom)

      if (!solana?.isPhantom) {
        console.error("[v0] ❌ Phantom not detected!")
        toast({
          title: "Phantom Not Found",
          description: "Please install the Phantom Wallet extension",
          variant: "destructive",
        })
        setState((prev) => ({ ...prev, connecting: false }))
        return
      }

      console.log("[v0] ✅ Phantom detected, calling connect()...")

      const response = await solana.connect()

      console.log("[v0] ✅ Connect response received:", response)
      console.log("[v0] Response publicKey:", response.publicKey)

      const pubKeyString = response.publicKey.toString()

      console.log("[v0] ✅ GOT PUBLIC KEY:", pubKeyString)

      stateRef.current = {
        connected: true,
        publicKey: pubKeyString,
      }

      setState((prev) => ({
        ...prev,
        connected: true,
        publicKey: pubKeyString,
        connecting: false,
      }))

      console.log("[v0] ✅ STATE UPDATED - calling fetchTokens...")

      toast({
        title: "Wallet Connected!",
        description: `${pubKeyString.slice(0, 4)}...${pubKeyString.slice(-4)}`,
      })

      await fetchTokens(pubKeyString)

      console.log("[v0] ========== CONNECT COMPLETE ==========")
    } catch (error) {
      console.error("[v0] ❌ Connection error:", error)
      console.error("[v0] Error type:", error instanceof Error ? error.constructor.name : typeof error)
      console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))

      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Could not connect to wallet",
        variant: "destructive",
      })
      setState((prev) => ({ ...prev, connecting: false }))
    }
  }

  const disconnect = async () => {
    try {
      // @ts-ignore
      const { solana } = window
      if (solana?.isPhantom) {
        await solana.disconnect()
      }

      stateRef.current = {
        connected: false,
        publicKey: null,
      }

      setState({
        connected: false,
        connecting: false,
        publicKey: null,
        tokens: [],
        loading: false,
        cleaning: false,
        refreshing: false,
      })

      toast({
        title: "Wallet Disconnected",
        description: "You have been disconnected successfully",
      })
    } catch (error) {
      console.error("[v0] Error disconnecting wallet:", error)
    }
  }

  const fetchTokens = async (walletAddress: string) => {
    console.log("[v0] FETCH TOKENS START for", walletAddress)

    setState((prev) => ({ ...prev, loading: true }))

    try {
      const fetchedTokens = await solanaService.getTokenAccounts(walletAddress)

      console.log("[v0] FETCHED", fetchedTokens.length, "tokens")

      setState((prev) => ({ ...prev, tokens: fetchedTokens, loading: false }))

      const dustCount = fetchedTokens.filter((t) => t.usdValue < 1).length

      toast({
        title: "Tokens Loaded!",
        description: `Found ${fetchedTokens.length} tokens (${dustCount} below $1)`,
      })
    } catch (error) {
      console.error("[v0] Error fetching tokens:", error)
      toast({
        title: "Error Loading Tokens",
        description: "Could not fetch your tokens. Please try again.",
        variant: "destructive",
      })
      setState((prev) => ({ ...prev, tokens: [], loading: false }))
    }
  }

  const refreshTokens = async () => {
    if (!state.publicKey) {
      toast({
        title: "No Wallet Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    setState((prev) => ({ ...prev, refreshing: true }))

    try {
      const fetchedTokens = await solanaService.getTokenAccounts(state.publicKey)

      setState((prev) => ({ ...prev, tokens: fetchedTokens, refreshing: false }))

      toast({
        title: "Tokens Refreshed!",
        description: `Found ${fetchedTokens.length} token(s) below $1`,
      })
    } catch (error) {
      console.error("[v0] Error refreshing tokens:", error)
      toast({
        title: "Refresh Failed",
        description: "Could not refresh your tokens. Please try again.",
        variant: "destructive",
      })
      setState((prev) => ({ ...prev, refreshing: false }))
    }
  }

  const cleanupWallet = async () => {
    console.log("[v0] cleanupWallet called - refreshing tokens...")

    if (!state.publicKey) {
      console.error("[v0] No public key in state")
      return
    }

    // Apenas atualizar lista de tokens após o cleanup
    await fetchTokens(state.publicKey)
  }

  return (
    <WalletContext.Provider
      value={{
        connected: state.connected,
        connecting: state.connecting,
        publicKey: state.publicKey,
        tokens: state.tokens,
        loading: state.loading,
        cleaning: state.cleaning,
        refreshing: state.refreshing,
        connect,
        disconnect,
        cleanupWallet,
        refreshTokens,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
