export interface Token {
  symbol: string
  name: string // Added name field
  balance: number
  usdValue: number
  solValue: number
  mint: string
  decimals: number
  logoURI?: string // Added logo field
}

export interface CleanupResult {
  success: boolean
  txSignature?: string
  solReceived?: number
  error?: string
}
