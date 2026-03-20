# Wallet Connect UX Flow

## User Journey Map

### First-Time User (No Wallet Connected)

```
┌─────────────────────────────────┐
│    Landing Page                 │
│                                 │
│  [  Connect Wallet Button  ]    │
│                                 │
│  By continuing, you agree to    │
│  our Terms & Privacy Policy     │
└────────────┬────────────────────┘
             │ User clicks button
             ▼
┌─────────────────────────────────┐
│  ◀ Connect Your Wallet          │  ← Drawer from bottom
├─────────────────────────────────┤
│                                 │
│  RECOMMENDED                    │
│  [💳 Coinbase Wallet Icon]      │  ← Easy access
│                                 │
├─────────────────────────────────┤
│        More options             │  ← Separator
├─────────────────────────────────┤
│  [🦊 MetaMask Icon]             │  ← Other options
│  [Other wallets...]             │
│                                 │
└────────────┬────────────────────┘
             │ User selects wallet
             ▼
┌─────────────────────────────────┐
│  Wallet Extension Popup         │
│  [Sign In / Connect Button]     │  ← Browser extension asks
└────────────┬────────────────────┘
             │ User signs in wallet
             ▼
┌─────────────────────────────────┐
│    App is Now Connected!        │
│                                 │
│  [💳 0x12ab...cd34] [Dropdown] │  ← Address displayed
│                                 │
│  (User can now access app       │
│   and make transactions)        │
└─────────────────────────────────┘
```

### Return User (Last Connector Remembered)

```
┌──────────────────────┬──────────────────┐
│ Continue with        │                  │
│ Coinbase Wallet      │  More Wallets    │  ← Two options
└──────────┬───────────┴──────────┬───────┘
           │                      │
    Click left button      Click right button
           │                      │
           ▼                      ▼
    ┌─────────────┐      ┌─────────────────┐
    │ Instant     │      │  ◀ Wallets      │
    │ connection  │      │                 │
    │ (fast!)     │      │ RECOMMENDED     │
    └─────────────┘      │ [Coinbase]      │
                         │                 │
                         │ More options    │
                         │ [MetaMask...]   │
                         └─────────────────┘
```

### Connected User (Account Menu)

```
┌────────────────────────────────┐
│ [💳 0x12ab...cd34] [▼ Dropdown]│
└────────────┬───────────────────┘
             │ Click dropdown
             ▼
┌────────────────────────────────┐
│ 🚪 Disconnect                  │
└────────────────────────────────┘
```

## State Flow Diagram

```
              ┌─────────────────────┐
              │   App Loads         │
              └──────────┬──────────┘
                         │
                    Check if
                  wallet connected
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    Connected       Not Connected    Check last
         │          & first time     connector
         │               │               │
         │               │      ┌────────┴────────┐
         │               │      │                 │
         ▼               ▼      ▼                 ▼
    ┌─────────┐    ┌──────────┐  Exists      Not Exists
    │ Show    │    │ Show     │    │              │
    │ Address │    │ Connect  │    │              │
    │ Button  │    │ Button   │    ▼              ▼
    └────┬────┘    └────┬─────┘  ┌──────────┐  ┌──────────┐
         │              │         │Show      │  │Show      │
         │              ▼         │Quick     │  │Connect   │
         │         ┌──────────┐   │Connect   │  │Button    │
         │         │Open      │   │Button    │  │          │
         │         │Drawer    │   └─────┬────┘  └────┬─────┘
         │         └────┬─────┘         │            │
         │              │         ┌──────────────────┘
         │              │         │
         │              └────┬────┘
         │                   │
         │              Show Drawer
         │              with Wallets
         │                   │
         │              Select Wallet
         │                   │
         │              Save to Storage
         │                   │
         ▼                   ▼
    ┌───────────────────────────┐
    │  Update Connected State   │
    │  (useAccount hook)        │
    └───────────────────────────┘
```

## Component Lifecycle

### Initial Load

```
useEffect (localStorage check)
  ↓
Load "offrail_last_connector"
  ↓
Set lastConnectorId state
```

### User Click "Connect"

```
setIsOpen(true)
  ↓
Drawer appears from bottom
  ↓
User selects connector
```

### User Selects Connector

```
handleConnect(connector)
  ↓
Save to localStorage
  ↓
connect({ connector })
  ↓
Wallet extension opens
  ↓
User signs
  ↓
useAccount updated
  ↓
Component re-renders
  ↓
Show address instead of connect button
```

### Return Visit

```
App loads
  ↓
localStorage has "offrail_last_connector"
  ↓
lastConnectorId state set
  ↓
Show "Continue with [Wallet]" button
  ↓
User clicks
  ↓
handleConnect(lastConnector)
  ↓
Quick reconnection
```

## Data Flow

### Storage

```
Browser localStorage
│
└─ Key: "offrail_last_connector"
   Value: "coinbaseWallet" or "metaMask" etc.
   Scope: This domain only
   Persists: Until cleared
```

### State Management

```
Component State
├─ isOpen: boolean (drawer visibility)
├─ lastConnectorId: string | null (from storage)
├─ address: string (from wagmi useAccount)
└─ isConnected: boolean (from wagmi useAccount)

Wagmi State
├─ connectors: Connector[] (available wallets)
├─ connect(): function (initiate connection)
└─ disconnect(): function (end connection)
```

## Interaction States

### Button States

#### "Connect Wallet" Button

```
Initial → Hovered → Clicked
  │          │        │
  │          │        └─→ Opens Drawer
  │          └─→ Visual feedback (color change, shadow)
  └─→ Full width, default styling
```

#### "Continue with..." Button

```
  Initial → Hovered → Clicked
    │          │        │
    │          │        └─→ Direct connection
    │          └─→ Highlighted state
    └─→ Shows last wallet + icon
```

#### Connector Buttons (in Drawer)

```
Default → Hovered → Clicked
   │         │        │
   │         │        └─→ Save to storage + Connect
   │         └─→ Secondary style change
   └─→ Shows icon + name
```

## Recommended Connectors Logic

```
All Available Connectors
        │
        ▼
    Filter by:
    - connector.name
    - connector.id
        │
    ┌───┴───┐
    │       │
  Match   No Match
    │       │
    ▼       ▼
  Recommended  Others
    │       │
    └───┬───┘
        │
    Return both
    arrays
```

## localStorage Persistence

```
User connects with Coinbase Wallet
    ↓
handleConnect() called
    ↓
localStorage.setItem(
  "offrail_last_connector",
  "coinbaseWallet"
)
    ↓
Data persists until:
- User clears browser cache
- User disconnects explicitly
- localStorage.removeItem() called
```

## Error Handling

```
Connection Attempt
        │
    ├─ Success
    │   └─→ Save to storage, update state
    │
    ├─ User Rejects
    │   └─→ Drawer stays open, no error shown
    │
    └─ Network Error
        └─→ Handled by wagmi
            └─→ Show in app error state
```

## Mobile Experience

```
Portrait (Full Screen)          Landscape
┌──────────────────┐           ┌────────────────┐
│ ◀ Title          │           │ ◀ Title        │
├──────────────────┤           ├────────────────┤
│ [Recommended]    │           │ [Recommended]  │
│ [Button 1]       │           │ [Btn1] [Btn2]  │
│ [Button 2]       │           │                │
│                  │           │ More options   │
│ More options     │           │ [Btn3] [Btn4]  │
│ [Button 3]       │           │                │
│ [Button 4]       │           │                │
└──────────────────┘           └────────────────┘

Touch-friendly:
✓ Large tap targets
✓ Easy to reach from bottom
✓ Swipe to close
✓ No scrolling needed for most users
```

## Performance Considerations

```
Initial Render
    ├─ useAccount() → Check if connected
    ├─ useConnect() → Get available connectors
    ├─ useEffect() → Check localStorage
    └─ Render UI

On Connection
    ├─ save to localStorage (1ms)
    ├─ wagmi connect() (async)
    ├─ useAccount() updates
    └─ Re-render (fast)

Storage Lookup
    ├─ Synchronous read
    ├─ ~0.1ms on typical device
    └─ Runs once on mount
```

This provides a complete UX flow for your wallet connection system! 🚀
