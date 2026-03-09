# Offrail Finance

## Overview

Offrail Finance is a blockchain-based mobile/web application that enables users to perform various financial transactions using stablecoins (USDC and USDT) across multiple blockchain networks. The app facilitates sending and receiving money, buying mobile airtime, paying bills, and other payment services, bridging traditional financial needs with decentralized technology. It integrates with Paycrest for cross-border and telecom payments, providing a seamless experience for users in regions like Kenya.

## Features

- **Wallet Connection**: Connect via Coinbase Wallet (smart wallet) or MetaMask
- **Balance Display**: View wallet balance in local currency (KES) with real-time exchange rates
- **Send Money**: Transfer stablecoins to other addresses
- **Receive Money**: Generate QR codes for receiving payments
- **Buy Airtime**: Purchase mobile airtime using USDC on the Base network via Paycrest
- **Pay Bills**: Pay utility bills and other services
- **Pay Till**: Make payments to merchant tills
- **Buy Bundles**: Purchase data bundles
- **Withdraw/Deposit**: Manage funds withdrawal and deposits
- **Transaction History**: View and track past transactions
- **Profile Management**: User profile with account details, security settings, and notifications
- **Dark/Light Theme**: Toggle between themes for better user experience

## Architecture

The application follows a modern web architecture with a focus on blockchain integration:

- **Frontend**: Built with Next.js and React, providing a responsive mobile-first UI using Tailwind CSS and Radix UI components. OnchainKit from Coinbase handles wallet interactions and UI elements.
- **Backend**: Server-side logic is handled through Next.js API routes, processing requests for airtime purchases and webhook handling.
- **Blockchain Components**: Uses Wagmi and Viem libraries for Ethereum-compatible blockchain interactions, supporting networks like Base, Arbitrum, Polygon, and Ethereum Mainnet.
- **External Integrations**: Integrates with Paycrest API for payment processing and telecom services.
- **Databases**: No persistent database is implemented in the codebase; data is managed through external APIs and wallet states.

```
[Frontend (Next.js/React)] <-> [API Routes] <-> [Paycrest API]
       |
       v
[Blockchain Networks (Base, Arbitrum, etc.)]
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Radix UI, Lucide React icons
- **Backend**: Next.js API Routes (Node.js)
- **Blockchain**: Wagmi, Viem, Coinbase OnchainKit
- **State Management**: React Query (TanStack), React Context
- **HTTP Client**: Axios
- **UI Libraries**: Shadcn/ui components, Vaul (drawer), Sonner (toasts)
- **Development**: TypeScript, ESLint, PostCSS
- **External APIs**: Paycrest for payments and telecom integrations

## Project Structure

```
/app                 # Next.js app directory with pages and API routes
  /api               # API endpoints (buy-airtime, webhooks)
/components          # Reusable React components
  /ui                # UI library components (buttons, dialogs, etc.)
  /sheets            # Modal sheets for transactions (SendMoneySheet, etc.)
/contexts            # React contexts (UserContext)
/hooks               # Custom React hooks (useTokenBalance, etc.)
/lib                 # Utility libraries
/utils               # Helper functions and token configurations
/wagmi               # Wagmi configuration for blockchain
/public              # Static assets
```

## Installation

### Prerequisites

- Node.js 18 or later
- npm or yarn package manager
- A wallet like Coinbase Wallet or MetaMask

### Steps

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd my-onchainkit-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the required variables (see Environment Variables section).

4. **Run the development server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production** (optional):
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

The following environment variables are required:

- `NEXT_PAYCREST_BASE_URL`: Base URL for the Paycrest API
- `NEXT_PAYCREST_API_KEY`: API key for authenticating with Paycrest
- `PAYCREST_RETURN_ADDRESS`: Return address for Paycrest transactions
- `NEXT_PUBLIC_ENV`: Environment setting ("development" or "production") to toggle between testnet and mainnet chains

## Usage

1. **Connect Wallet**: On the main page, connect your Coinbase Wallet or MetaMask to access the app.
2. **View Balance**: The balance card displays your wallet balance in KES, converted from USDC.
3. **Perform Transactions**:
   - Tap action buttons (Send, Receive, Buy Airtime, etc.) to open transaction sheets.
   - For sending money: Enter recipient details and amount.
   - For buying airtime: Provide phone number and amount; the app handles USDC transfer via Paycrest.
4. **Transaction History**: View past transactions in the main feed.
5. **Profile**: Access user settings, theme toggle, and wallet management.

Example user flow: Connect wallet → View balance → Select "Buy Airtime" → Enter phone number and amount → Confirm transaction → Receive confirmation via webhook.

## API Endpoints

- `POST /api/buy-airtime`: Initiates an airtime purchase order via Paycrest, sending USDC on Base network.
- `POST /api/webhooks/orders`: Handles Paycrest webhooks for order status updates (created, completed, failed).

## Payment / Blockchain Flow

Transactions involving external payments (e.g., buying airtime) use the following flow:

1. User initiates transaction in the app (e.g., buy airtime).
2. App calls Paycrest API to create an order, specifying amount in USDC, recipient details, and return address.
3. Paycrest processes the blockchain transaction on the specified network (Base).
4. Webhooks notify the app of order status.
5. Funds are transferred to the recipient (e.g., telecom provider for airtime).

Blockchain interactions for wallet connections and balances are handled via Wagmi, supporting multiple chains.

## Contributing

We welcome contributions to Offrail Finance! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make your changes and ensure tests pass.
4. Commit your changes: `git commit -m 'Add your feature'`.
5. Push to the branch: `git push origin feature/your-feature`.
6. Open a pull request.

Please follow the existing code style and include appropriate tests for new features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
