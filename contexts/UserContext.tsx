import { createContext, useContext, useState, ReactNode } from "react";
import { Transaction } from "@/components/TransactionItem";

interface UserProfile {
  name: string;
  phone: string;
  walletAddress: string;
  walletShort: string;
  network: string;
  memberSince: string;
}

interface UserContextType {
  profile: UserProfile;
  kesBalance: string;
  usdcBalance: string;
  transactions: Transaction[];
}

const defaultProfile: UserProfile = {
  name: "Rodwell",
  phone: "+254 712 345 678",
  walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  walletShort: "0x1a2b...9f8e",
  network: "Base",
  memberSince: "March 2026",
};

const allTransactions: Transaction[] = [
  { id: "1", type: "send", description: "Sent to 0712***890", amount: "500", date: "Today, 2:30 PM", status: "completed" },
  { id: "2", type: "airtime", description: "Safaricom Airtime", amount: "100", date: "Today, 11:00 AM", status: "completed" },
  { id: "3", type: "paybill", description: "KPLC Prepaid", amount: "1,200", date: "Yesterday", status: "completed" },
  { id: "4", type: "deposit", description: "USDC Deposit", amount: "5,000", date: "Yesterday", status: "completed" },
  { id: "5", type: "bundles", description: "Safaricom 6GB", amount: "250", date: "2 days ago", status: "completed" },
  { id: "6", type: "send", description: "Sent to 0700***123", amount: "1,000", date: "3 days ago", status: "completed" },
  { id: "7", type: "withdraw", description: "Withdraw to M-Pesa", amount: "2,000", date: "4 days ago", status: "completed" },
  { id: "8", type: "paybill", description: "Nairobi Water", amount: "850", date: "5 days ago", status: "completed" },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile] = useState(defaultProfile);
  const [kesBalance] = useState("5,432.00");
  const [usdcBalance] = useState("42.10");
  const [transactions] = useState(allTransactions);

  return (
    <UserContext.Provider value={{ profile, kesBalance, usdcBalance, transactions }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
