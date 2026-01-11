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
    autoDisconnect: "Auto-disconnect 2min",
    secureConnection: "Secure Connection",
    securityTitle: "Your Security is Our Priority",
    secureConnectionDesc: "Encrypted and protected data",
    autoDisconnectDesc: "Automatic protection after inactivity",
    noDataStored: "No data stored",
    readOnlyAccess: "Read-only access",
    transparentFees: "Transparent fees",

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

    securitySession: "Security Session",
    autoDisconnectInfo: "Auto-disconnect for your security. Activity resets timer.",
    sessionExpiringSoon: "Session expiring soon! Interact to extend.",
    extendSession: "Extend",
    sessionExpired: "Session Expired",
    sessionExpiredDesc: "Your wallet was disconnected for security.",
    removeFromConnectedAppsTitle: "To fully disconnect:",
    removeFromConnectedApps: "Open Phantom → Settings → Connected Apps → Remove this site",
    refresh: "Refresh",

    phantomNotInstalled: "Phantom Wallet Not Found",
    phantomNotInstalledDesc: "To use this app, you need the Phantom wallet extension installed.",
    installPhantom: "Install Phantom Wallet",

    // Mobile instructions
    openInPhantomBrowser: "Open in Phantom Browser",
    mobileInstructions: "For the best experience on mobile, open this site in the Phantom app browser.",
    howToOpen: "How to open:",
    mobileStep1: "Open the Phantom app on your phone",
    mobileStep2: "Tap the globe icon (browser) at the bottom",
    mobileStep3: "Paste the URL below in the address bar",
    copyUrl: "Copy URL",
    urlCopied: "URL Copied!",
  },
  pt: {
    // Hero
    poweredBy: "Powered by Solana",
    title: "Crypto Dust Cleaner",
    subtitle:
      "Limpe sua carteira Solana de tokens esquecidos e pequenos valores. Converta automaticamente tokens abaixo de $5 em SOL.",
    commission: "Comissão de apenas 10%",
    instantConversion: "Conversão instantânea",
    autoDisconnect: "Desconexão auto 2min",
    secureConnection: "Conexão Segura",
    securityTitle: "Sua Segurança é Nossa Prioridade",
    secureConnectionDesc: "Dados criptografados e protegidos",
    autoDisconnectDesc: "Proteção automática após inatividade",
    noDataStored: "Nenhum dado armazenado",
    readOnlyAccess: "Acesso somente leitura",
    transparentFees: "Taxas transparentes",

    // Wallet Connect
    connectWallet: "Conecte sua Carteira",
    walletConnected: "Carteira Conectada",
    connectPhantom: "Conecte sua billetera Phantom para começar",
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
    doNotCloseWindow: "Não feche esta janela. Confirme cada transação na sua billetera Phantom.",

    // Connection Error Translations
    connectionBlocked: "Conexão Bloqueada",
    connectionBlockedDesc: "A Phantom pode ter bloqueado este domínio por segurança. Tente o seguinte:",
    connectionBlockedStep1: "Abra as configurações da carteira Phantom",
    connectionBlockedStep2: "Vá em 'Apps Confiáveis' ou 'Sites Conectados'",
    connectionBlockedStep3: "Remova este site e tente conectar novamente",
    connectionBlockedStep4: "Ou tente limpar o cache do navegador",
    tryAgain: "Tentar Novamente",

    securitySession: "Sessão de Segurança",
    autoDisconnectInfo: "Desconexão automática para sua segurança. Atividade reinicia o tempo.",
    sessionExpiringSoon: "Sessão expirando em breve! Interaja para estender.",
    extendSession: "Estender",
    sessionExpired: "Sessão Expirada",
    sessionExpiredDesc: "Sua carteira foi desconectada por segurança.",
    removeFromConnectedAppsTitle: "Para desconectar completamente:",
    removeFromConnectedApps: "Abra Phantom → Configurações → Apps Conectadas → Remova este site",
    refresh: "Atualizar",

    phantomNotInstalled: "Phantom Wallet Não Encontrada",
    phantomNotInstalledDesc: "Para usar este app, você precisa da extensão Phantom instalada.",
    installPhantom: "Instalar Phantom Wallet",

    // Mobile instructions
    openInPhantomBrowser: "Abrir no Navegador Phantom",
    mobileInstructions: "Para melhor experiência no celular, abra este site no navegador do app Phantom.",
    howToOpen: "Como abrir:",
    mobileStep1: "Abra o app Phantom no seu celular",
    mobileStep2: "Toque no ícone do globo (navegador) na parte inferior",
    mobileStep3: "Cole a URL abaixo na barra de endereço",
    copyUrl: "Copiar URL",
    urlCopied: "URL Copiada!",
  },
  es: {
    // Hero
    poweredBy: "Powered by Solana",
    title: "Crypto Dust Cleaner",
    subtitle:
      "Limpia tu billetera Solana de tokens olvidados y pequeños valores. Convierte automáticamente tokens por debajo de $5 en SOL.",
    commission: "Solo 10% de comisión",
    instantConversion: "Conversión instantánea",
    autoDisconnect: "Desconexión auto 2min",
    secureConnection: "Conexión Segura",
    securityTitle: "Tu Seguridad es Nuestra Prioridad",
    secureConnectionDesc: "Datos encriptados y protegidos",
    autoDisconnectDesc: "Protección automática tras inactividad",
    noDataStored: "Ningún dato almacenado",
    readOnlyAccess: "Acceso solo lectura",
    transparentFees: "Tarifas transparentes",

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

    securitySession: "Sesión de Seguridad",
    autoDisconnectInfo: "Desconexión automática por tu seguridad. La actividad reinicia el tiempo.",
    sessionExpiringSoon: "¡Sesión expirando pronto! Interactúa para extender.",
    extendSession: "Extender",
    sessionExpired: "Sesión Expirada",
    sessionExpiredDesc: "Tu billetera fue desconectada por seguridad.",
    removeFromConnectedAppsTitle: "Para desconectar completamente:",
    removeFromConnectedApps: "Abre Phantom → Configuración → Apps Conectadas → Elimina este sitio",
    refresh: "Actualizar",

    phantomNotInstalled: "Phantom Wallet No Encontrada",
    phantomNotInstalledDesc: "Para usar esta app, necesitas la extensión Phantom instalada.",
    installPhantom: "Instalar Phantom Wallet",

    // Mobile instructions
    openInPhantomBrowser: "Abrir en Navegador Phantom",
    mobileInstructions: "Para mejor experiencia en móvil, abre este sitio en el navegador de la app Phantom.",
    howToOpen: "Cómo abrir:",
    mobileStep1: "Abre la app Phantom en tu celular",
    mobileStep2: "Toca el ícono del globo (navegador) en la parte inferior",
    mobileStep3: "Pega la URL abajo en la barra de direcciones",
    copyUrl: "Copiar URL",
    urlCopied: "¡URL Copiada!",
  },
}
