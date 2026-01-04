# Clean Dust Crypto

A Solana-based web application that helps users clean their wallets by automatically converting small token balances (below $1) into SOL.

## Features

- Connect Phantom Wallet
- Automatically detect tokens below $1 in value
- Swap dust tokens to SOL using Jupiter Aggregator
- 10% commission to project wallet, 90% to user
- Multi-language support (English, Portuguese, Spanish)
- Modern DeFi-inspired design

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_PROJECT_WALLET=YourSolanaWalletAddress
   ```

   **Important:** Replace `YourSolanaWalletAddress` with your actual Solana wallet address that will receive the 10% commission.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### Project Wallet

The project wallet receives 10% commission from each cleanup operation. Configure it in your `.env.local` file:

```env
NEXT_PUBLIC_PROJECT_WALLET=YourSolanaWalletAddress
```

### Solana RPC Endpoint

For production, use a reliable RPC provider like:
- Helius: `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`
- QuickNode: `https://YOUR_ENDPOINT.quiknode.pro/`
- Alchemy: `https://solana-mainnet.g.alchemy.com/v2/YOUR_KEY`

## How It Works

1. User connects their Phantom wallet
2. App scans for all SPL tokens in the wallet
3. Filters tokens with total value below $1
4. Displays cleanup summary with commission breakdown
5. User confirms cleanup
6. Tokens are swapped to SOL via Jupiter Aggregator
7. 10% goes to project wallet, 90% to user wallet

## Tech Stack

- **Next.js 16** - React framework
- **Solana Web3.js** - Blockchain interaction
- **Phantom Wallet** - Wallet connection
- **Tailwind CSS v4** - Styling
- **TypeScript** - Type safety

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SOLANA_RPC` | Solana RPC endpoint | Yes |
| `NEXT_PUBLIC_PROJECT_WALLET` | Project wallet for commissions | Yes |

## Development

For testing on devnet:

```env
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
```

## Deployment

### Option 1: Deploy via v0 (Easiest)

1. Click the **"Publish"** button in the top right of the v0 interface
2. Connect your Vercel account if you haven't already
3. Configure the environment variables:
   - `NEXT_PUBLIC_PROJECT_WALLET`: Your Solana wallet address
   - `NEXT_PUBLIC_SOLANA_RPC`: Your Solana RPC endpoint
4. Click deploy and your app will be live in minutes!

### Option 2: Deploy to Vercel via CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in the Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `NEXT_PUBLIC_PROJECT_WALLET` and `NEXT_PUBLIC_SOLANA_RPC`

### Option 3: Deploy to Vercel via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables
6. Click "Deploy"

### Important Notes for Production

- **Phantom Wallet Security**: The Phantom wallet blocks requests from preview/development domains for security. Your app MUST be deployed to production (with a proper domain) for the cleanup functionality to work.
- **RPC Provider**: Use a reliable paid RPC provider for production (Helius, QuickNode, or Alchemy)
- **Custom Domain**: Consider adding a custom domain in Vercel for better branding and trust

## License

MIT
