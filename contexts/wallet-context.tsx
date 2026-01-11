"use client"

import { useRef } from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
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
  connectionError: string | null
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
    connectionError: string | null
  }>({
    connected: false,
    connecting: false,
    publicKey: null,
    tokens: [],
    loading: false,
    cleaning: false,
    refreshing: false,
    connectionError: null,
  })

  const { toast } = useToast()
  const solanaService = new SolanaService()

  const connect = async () => {
    setState((prev) => ({ ...prev, connecting: true, connectionError: null }))

    try {
      // @ts-ignore
      const { solana } = window

      if (!solana?.isPhantom) {
        toast({
          title: "Phantom Not Found",
          description: "Please install the Phantom Wallet extension",
          variant: "destructive",
        })
        setState((prev) => ({ ...prev, connecting: false }))
        return
      }

      const response = await solana.connect()
      const pubKeyString = response.publicKey.toString()

      stateRef.current = {
        connected: true,
        publicKey: pubKeyString,
      }

      setState((prev) => ({
        ...prev,
        connected: true,
        publicKey: pubKeyString,
        connecting: false,
        connectionError: null,
      }))

      toast({
        title: "Wallet Connected!",
        description: `${pubKeyString.slice(0, 4)}...${pubKeyString.slice(-4)}`,
      })

      await fetchTokens(pubKeyString)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)

      let userMessage = "Could not connect to wallet"
      let isPhantomBlock = false

      if (errorMessage.includes("Unexpected error") || errorMessage.includes("User rejected")) {
        isPhantomBlock = true
        userMessage = "Connection blocked. Please check if the domain is allowed in Phantom settings."
      }

      setState((prev) => ({
        ...prev,
        connecting: false,
        connectionError: isPhantomBlock ? "phantom_blocked" : "generic_error",
      }))

      toast({
        title: "Connection Error",
        description: userMessage,
        variant: "destructive",
      })
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
        connectionError: null,
      })

      toast({
        title: "Wallet Disconnected",
        description: "You have been disconnected successfully",
      })
    } catch (error) {
      // Silent error handling for disconnect
    }
  }

  const fetchTokens = async (walletAddress: string) => {
    setState((prev) => ({ ...prev, loading: true }))

    try {
      const fetchedTokens = await solanaService.getTokenAccounts(walletAddress)

      setState((prev) => ({ ...prev, tokens: fetchedTokens, loading: false }))

      const dustCount = fetchedTokens.filter((t) => t.usdValue < 5).length

      toast({
        title: "Tokens Loaded!",
        description: `Found ${fetchedTokens.length} tokens (${dustCount} below $5)`,
      })
    } catch (error) {
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
        description: `Found ${fetchedTokens.length} token(s) below $5`,
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh your tokens. Please try again.",
        variant: "destructive",
      })
      setState((prev) => ({ ...prev, refreshing: false }))
    }
  }

  const cleanupWallet = async () => {
    if (!state.publicKey) {
      return
    }
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
        connectionError: state.connectionError,
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
