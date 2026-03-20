# OnchainKit to Wagmi/Viem Migration Summary

## Migration Complete ✅

Your OnchainKit app has been successfully migrated to use standalone wagmi and viem. All OnchainKit dependencies have been removed and replaced with custom implementations.

## Changes Made

### 1. **Dependencies Removed**

- Removed `@coinbase/onchainkit` from `package.json`
- All other dependencies remain intact (wagmi, viem, react-query, etc.)

### 2. **New Custom Components Created**

#### `WalletConnect.tsx` - Custom Wallet Connection Component

- Replaces OnchainKit's `ConnectWallet`, `Wallet`, and `WalletDropdownDisconnect`
- Features:
  - `ConnectWallet`: Shows wallet connector options when disconnected, displays connected address when connected
  - `Wallet`: Conditional wrapper that only renders children when wallet is connected
  - `WalletDropdownDisconnect`: Provides a disconnect button
- Uses wagmi hooks: `useConnect()`, `useDisconnect()`, `useAccount()`

#### `TransactionComponent.tsx` - Custom Transaction Handler

- Replaces OnchainKit's `Transaction` and `TransactionButton` components
- Features:
  - Handles ERC20 transfers and contract calls via wagmi's `writeContractAsync`
  - Provides lifecycle status callbacks (idle, transactionPending, success, error)
  - Exposes submit function through render props pattern
  - Type-safe with TypeScript interfaces

### 3. **Updated Files**

#### Core Setup

- **`components/Providers.tsx`**: Removed `OnchainKitProvider`, kept `WagmiProvider` and other providers
- **`app/layout.tsx`**: Removed `SafeArea` wrapper and OnchainKit styles import
- **`wagmi/config.ts`**: Unchanged - already using wagmi directly

#### Wallet Components

- **`components/LandingPage.tsx`**: Updated to use new `ConnectWallet` component
- **`app/app/profile/page.tsx`**: Updated wallet UI and disconnect functionality

#### Transaction Sheets

- **`components/sheets/SendMoneySheet.tsx`**: Updated to use custom `Transaction` component
- **`components/sheets/BuyAirtimeSheet.tsx`**: Updated to use custom `Transaction` component
- **`app/app/cashout/mobile-wallet/page.tsx`**: Updated to use custom `Transaction` component

## Architecture

### Wallet Management

```
WagmiProvider (wagmi/config.ts)
├── QueryClientProvider
├── ThemeProvider
└── UserProvider
    └── App Components
```

Wallet state is managed directly through wagmi hooks:

- `useConnect()` - Get available connectors and connect
- `useDisconnect()` - Disconnect wallet
- `useAccount()` - Get current account info
- `useChainId()` - Get current chain

### Transaction Handling

```
Transaction Component (custom)
├── Uses writeContractAsync from wagmi
├── Handles ERC20 transfers
├── Provides status callbacks
└── Exposes submit function via render props
```

## API Compatibility

### Old OnchainKit Usage

```tsx
<OnchainKitProvider apiKey="..." projectId="..." chain={base}>
  <ConnectWallet />
  <Transaction calls={[...]} onStatus={...}>
    <TransactionButton render={({onSubmit}) => ...} />
  </Transaction>
</OnchainKitProvider>
```

### New Wagmi/Viem Usage

```tsx
<WagmiProvider config={config}>
  <ConnectWallet />
  <Transaction calls={[...]} onStatus={...}>
    {({onSubmit}) => ...}
  </Transaction>
</WagmiProvider>
```

## Next Steps

1. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Test wallet connections**:
   - Coinbase Wallet
   - MetaMask

3. **Test transactions**:
   - Send money to wallet (SendMoneySheet)
   - Buy airtime (BuyAirtimeSheet)
   - Mobile cashout (CashOutMobile page)

4. **Environment Variables**:
   - Verify your `.env.local` has all required variables
   - No CDP API keys are needed anymore (they were for OnchainKit)

## Key Differences from OnchainKit

| Aspect          | OnchainKit             | Wagmi/Viem                        |
| --------------- | ---------------------- | --------------------------------- |
| Provider        | `OnchainKitProvider`   | `WagmiProvider`                   |
| Configuration   | Built-in config        | Custom `wagmi/config.ts`          |
| Wallet UI       | Built-in components    | Custom `WalletConnect.tsx`        |
| Transactions    | Built-in `Transaction` | Custom `TransactionComponent.tsx` |
| Status Handling | Built-in lifecycle     | Custom callbacks                  |
| Styling         | OnchainKit CSS         | Tailwind CSS (existing)           |

## Removed Features

- OnchainKit's pre-built UI components
- OnchainKit's styling/theming system
- OnchainKit's paymaster configuration
- OnchainKit's bundler integration

## Maintained Features

- Wallet connection (Coinbase Wallet, MetaMask)
- ERC20 token transfers
- Multi-chain support
- Transaction status tracking
- Error handling

## Notes

- Your existing Tailwind CSS styling is preserved
- The custom components follow the same API patterns as OnchainKit for easy migration
- All environment variables remain the same (except CDP-related ones which are no longer needed)
- The app is now lighter and more customizable with direct wagmi/viem control
