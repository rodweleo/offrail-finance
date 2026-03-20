# Enhanced Wallet Connect Component

## Features

Your `WalletConnect` component now includes an improved UX with:

### 1. **Drawer-Based Connection Modal**

- Opens from the bottom of the screen
- Clean, mobile-friendly interface
- Shows "Connect Your Wallet" title

### 2. **Recommended Connectors**

- Displays recommended wallets at the top (e.g., Coinbase Wallet for Base network)
- Clear "Recommended" label with uppercase styling
- These appear first for easier discovery

### 3. **Visual Separator**

- Clean divider between recommended and other connectors
- Shows "More options" text for clarity

### 4. **Other Connectors**

- Additional wallet options listed below the separator
- Fully functional like recommended ones

### 5. **Last Used Connector**

- Automatically remembers the last connector you used
- Shows "Continue with [Wallet Name]" button on next visit
- Includes "More Wallets" button to see all options
- Uses localStorage to persist choice

## How It Works

### Initial Connection

```
Click "Connect Wallet"
  → Drawer opens from bottom
  → See recommended wallets at top
  → See other wallets below separator
  → Choose one and sign in
```

### Subsequent Connections

```
See "Continue with [Last Wallet]" button
  → Click to reconnect instantly
  → Or click "More Wallets" to choose different one
```

## UI States

### Disconnected (First Time)

```
┌─────────────────────────────┐
│  [Connect Wallet Button]    │
└─────────────────────────────┘
```

Click → Opens drawer

### Disconnected (Return User)

```
┌──────────────────────────────────┐
│ [Continue with Coinbase Wallet]  │ [More Wallets]
└──────────────────────────────────┘
```

Click left button → Quick reconnect  
Click right button → See other options

### Connected

```
┌──────────────────────────────┐
│ 💳 0x12ab...cd34  [Dropdown] │
└──────────────────────────────┘
```

Dropdown shows disconnect option

## Drawer Content

When drawer is open, you'll see:

```
┌─────────────────────────────────┐
│     Connect Your Wallet         │
├─────────────────────────────────┤
│ RECOMMENDED                     │
│ [💳 Coinbase Wallet]            │
├─────────────────────────────────┤
│        More options             │
├─────────────────────────────────┤
│ [🦊 MetaMask]                   │
│ [Other wallets...]              │
└─────────────────────────────────┘
```

## Customization

### Change Recommended Connectors

Edit this in `WalletConnect.tsx`:

```tsx
const RECOMMENDED_CONNECTORS = ["Coinbase Wallet", "coinbaseWallet"];
```

Add or remove connector names/IDs as needed.

### Change Storage Key

```tsx
const LAST_CONNECTOR_KEY = "offrail_last_connector";
```

Use your own key if you have multiple apps.

### Customize Labels

```tsx
// In ConnectWallet props
<ConnectWallet
  disconnectedLabel="Choose Your Wallet" // Change this
  onConnect={() => console.log("Connected!")}
/>
```

## Browser Storage

The component uses `localStorage` to remember your choice:

```
Key: "offrail_last_connector"
Value: connector.uid (e.g., "coinbaseWallet")
```

This is cleared when you disconnect or manually clear localStorage.

## Accessibility

- ✅ Proper button semantics
- ✅ Keyboard navigation support (via shadcn/ui Drawer)
- ✅ Screen reader friendly
- ✅ Touch-friendly drawer from bottom
- ✅ Clear visual hierarchy with labels and separators

## API Reference

### Props

```tsx
interface WalletConnectProps {
  className?: string; // Tailwind classes for button
  disconnectedLabel?: string; // Button label (default: "Connect Wallet")
  onConnect?: () => void; // Called after successful connection
}
```

### Usage Examples

#### Basic

```tsx
<ConnectWallet />
```

#### With custom label

```tsx
<ConnectWallet disconnectedLabel="Sign In" />
```

#### With callback

```tsx
<ConnectWallet
  onConnect={() => {
    toast.success("Welcome!");
  }}
/>
```

#### With styling

```tsx
<ConnectWallet className="text-lg" />
```

## Component Structure

```
ConnectWallet
├── Connected State
│   └── DropdownMenu (account + disconnect)
├── Return User (Last Connector)
│   ├── "Continue with..." Button
│   ├── "More Wallets" Button
│   └── Drawer (all connectors)
└── New User
    ├── "Connect Wallet" Button
    └── Drawer (all connectors)
        ├── Recommended Section
        ├── Separator
        └── Other Connectors Section
```

## Features Implemented

✅ Drawer modal from bottom  
✅ Recommended connectors at top  
✅ Visual separator with label  
✅ Other connectors below  
✅ Last used connector detection  
✅ Quick reconnect button  
✅ Wallet icons display  
✅ localStorage persistence  
✅ Full TypeScript support  
✅ Accessible UI

## Browser Support

Works in all modern browsers that support:

- Drawer/Modal APIs
- localStorage
- ES6+ JavaScript

Tested with:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Notes

- Connector icons are fetched from the connector metadata
- If an icon is missing, it still displays the text
- The component is fully responsive
- Works seamlessly with wagmi hooks
- All animations handled by shadcn/ui Drawer
