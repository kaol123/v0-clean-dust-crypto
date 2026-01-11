export type Language = "en" | "pt" | "es"

export const translations = {
  en: {
    // Hero
    poweredBy: "Powered by Solana",
    title: "Crypto Dust Cleaner",
    subtitle:
      "Clean your Solana wallet from forgotten tokens and small amounts. Automatically convert tokens below $5 into SOL.",
    commission: "Only 10% commission",
    instantConversion: "Instant conversion",

    // Wallet Connect
    connectWallet: "Connect Your Wallet",
    walletConnected: "Wallet Connected",
    connectPhantom: "Connect to your Phantom wallet to get started",
    disconnect: "Disconnect",
    connecting: "Connecting...",
    connectButton: "Connect Phantom",

    // Token List
    yourTokens: "Your Tokens",
    tokensToClean: "Tokens to Clean",
    token: "token",
    tokens: "tokens",
    noTokensFound: "No tokens found in your wallet",
    noTokensBelow: "No tokens below $5 found! Your wallet is clean.",
    unknownToken: "Unknown Token",

    // Cleanup Summary
    cleanupSummary: "Cleanup Summary",
    totalValue: "Total Value",
    commissionLabel: "Commission (10%)",
    youReceive: "You Receive",
    cleanWalletNow: "Clean Wallet Now",
    cleaning: "Cleaning...",
    cleanupComplete: "Cleanup Complete!",
    youReceived: "You received",
    tokensCouldNotBeSwapped: "token could not be swapped",
    tokensCouldNotBeSwappedPlural: "tokens could not be swapped",
    insufficientLiquidity:
      "These tokens may have insufficient liquidity. Try swapping them directly in your Phantom wallet.",

    // Progress Modal
    processingSwaps: "Processing Swaps",
    pleaseConfirmTransactions: "Please confirm all transactions in your wallet",
    progress: "Progress",
    swapCompleted: "Completed",
    swapFailed: "Failed",
    swappingToken: "Swapping token",
    sendingCommission: "Sending commission",
    waiting: "Waiting",
    doNotCloseWindow: "Do not close this window. Confirm each transaction in your Phantom wallet.",

    // Connection Error Translations
    connectionBlocked: "Connection Blocked",
    connectionBlockedDesc: "Phantom may have blocked this domain for security. Try the following:",
    connectionBlockedStep1: "Open Phantom wallet settings",
    connectionBlockedStep2: "Go to 'Trusted Apps' or 'Connected Sites'",
    connectionBlockedStep3: "Remove this site and try connecting again",
    connectionBlockedStep4: "Or try clearing your browser cache",
    tryAgain: "Try Again",

    refresh: "Refresh",
  },
  pt: {
    // Hero
    poweredBy: "Powered by Solana",
    title: "Crypto Dust Cleaner",
    subtitle:
      "Limpe sua carteira Solana de tokens esquecidos e pequenos valores. Converta automaticamente tokens abaixo de $5 em SOL.",
    commission: "Comissão de apenas 10%",
    instantConversion: "Conversão instantânea",

    // Wallet Connect
    connectWallet: "Conecte sua Carteira",
    walletConnected: "Carteira Conectada",
    connectPhantom: "Conecte sua carteira Phantom para começar",
    disconnect: "Desconectar",
    connecting: "Conectando...",
    connectButton: "Conectar Phantom",

    // Token List
    yourTokens: "Seus Tokens",
    tokensToClean: "Tokens para Limpar",
    token: "token",
    tokens: "tokens",
    noTokensFound: "Nenhum token encontrado na sua carteira",
    noTokensBelow: "Nenhum token abaixo de $5 encontrado! Sua carteira está limpa.",
    unknownToken: "Token Desconhecido",

    // Cleanup Summary
    cleanupSummary: "Resumo da Limpeza",
    totalValue: "Valor Total",
    commissionLabel: "Comissão (10%)",
    youReceive: "Você Recebe",
    cleanWalletNow: "Limpar Carteira Agora",
    cleaning: "Limpando...",
    cleanupComplete: "Limpeza Concluída!",
    youReceived: "Você recebeu",
    tokensCouldNotBeSwapped: "token não pôde ser trocado",
    tokensCouldNotBeSwappedPlural: "tokens não puderam ser trocados",
    insufficientLiquidity:
      "Estes tokens podem não ter liquidez suficiente. Tente trocá-los diretamente na sua carteira Phantom.",

    // Progress Modal
    processingSwaps: "Processando Swaps",
    pleaseConfirmTransactions: "Por favor, confirme todas as transações na sua carteira",
    progress: "Progresso",
    swapCompleted: "Concluído",
    swapFailed: "Falhou",
    swappingToken: "Trocando token",
    sendingCommission: "Enviando comissão",
    waiting: "Aguardando",
    doNotCloseWindow: "Não feche esta janela. Confirme cada transação na sua carteira Phantom.",

    // Connection Error Translations
    connectionBlocked: "Conexão Bloqueada",
    connectionBlockedDesc: "A Phantom pode ter bloqueado este domínio por segurança. Tente o seguinte:",
    connectionBlockedStep1: "Abra as configurações da carteira Phantom",
    connectionBlockedStep2: "Vá em 'Apps Confiáveis' ou 'Sites Conectados'",
    connectionBlockedStep3: "Remova este site e tente conectar novamente",
    connectionBlockedStep4: "Ou tente limpar o cache do navegador",
    tryAgain: "Tentar Novamente",

    refresh: "Atualizar",
  },
  es: {
    // Hero
    poweredBy: "Powered by Solana",
    title: "Crypto Dust Cleaner",
    subtitle:
      "Limpia tu billetera Solana de tokens olvidados y pequeños valores. Convierte automáticamente tokens por debajo de $5 en SOL.",
    commission: "Solo 10% de comisión",
    instantConversion: "Conversión instantánea",

    // Wallet Connect
    connectWallet: "Conecta tu Billetera",
    walletConnected: "Billetera Conectada",
    connectPhantom: "Conecta tu billetera Phantom para comenzar",
    disconnect: "Desconectar",
    connecting: "Conectando...",
    connectButton: "Conectar Phantom",

    // Token List
    yourTokens: "Tus Tokens",
    tokensToClean: "Tokens para Limpiar",
    token: "token",
    tokens: "tokens",
    noTokensFound: "No se encontraron tokens en tu billetera",
    noTokensBelow: "¡No se encontraron tokens por debajo de $5! Tu billetera está limpia.",
    unknownToken: "Token Desconocido",

    // Cleanup Summary
    cleanupSummary: "Resumen de Limpieza",
    totalValue: "Valor Total",
    commissionLabel: "Comisión (10%)",
    youReceive: "Recibes",
    cleanWalletNow: "Limpiar Billetera Ahora",
    cleaning: "Limpiando...",
    cleanupComplete: "¡Limpieza Completada!",
    youReceived: "Recibiste",
    tokensCouldNotBeSwapped: "token no pudo ser intercambiado",
    tokensCouldNotBeSwappedPlural: "tokens no pudieron ser intercambiados",
    insufficientLiquidity:
      "Estos tokens pueden no tener suficiente liquidez. Intenta intercambiarlos directamente en tu billetera Phantom.",

    // Progress Modal
    processingSwaps: "Procesando Swaps",
    pleaseConfirmTransactions: "Por favor, confirma todas las transacciones en tu billetera",
    progress: "Progreso",
    swapCompleted: "Completado",
    swapFailed: "Falló",
    swappingToken: "Intercambiando token",
    sendingCommission: "Enviando comisión",
    waiting: "Esperando",
    doNotCloseWindow: "No cierres esta ventana. Confirma cada transacción en tu billetera Phantom.",

    // Connection Error Translations
    connectionBlocked: "Conexión Bloqueada",
    connectionBlockedDesc: "Phantom puede haber bloqueado este dominio por seguridad. Intenta lo siguiente:",
    connectionBlockedStep1: "Abre la configuración de la billetera Phantom",
    connectionBlockedStep2: "Ve a 'Apps de Confianza' o 'Sitios Conectados'",
    connectionBlockedStep3: "Elimina este sitio e intenta conectar nuevamente",
    connectionBlockedStep4: "O intenta limpiar la caché del navegador",
    tryAgain: "Intentar de Nuevo",

    refresh: "Actualizar",
  },
}
