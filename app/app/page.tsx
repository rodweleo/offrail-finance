"use client";

import { useState } from "react";
import {
  Send,
  Receipt,
  Phone,
  Wifi,
  ArrowDownToLine,
  CreditCard,
  QrCode,
  ArrowDownLeft,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import BalanceCard from "@/components/BalanceCard";
import ActionButton from "@/components/ActionButton";
import TransactionItem from "@/components/TransactionItem";
import BottomNav from "@/components/BottomNav";
import TransactionDetailSheet from "@/components/TransactionDetailSheet";
import SendMoneySheet from "@/components/sheets/SendMoneySheet";
import PayBillSheet from "@/components/sheets/PayBillSheet";
import PayTillSheet from "@/components/sheets/PayTillSheet";
import BuyAirtimeSheet from "@/components/sheets/BuyAirtimeSheet";
import BuyBundlesSheet from "@/components/sheets/BuyBundlesSheet";
import WithdrawSheet from "@/components/sheets/WithdrawSheet";
import ReceiveMoneySheet from "@/components/sheets/ReceiveMoneySheet";
import DepositSheet from "@/components/sheets/DepositSheet";
import { useUser } from "@/contexts/UserContext";
import { Transaction } from "@/components/TransactionItem";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { shortenAddress } from "@/utils";
import { useUserPaycrestOrders } from "@/hooks/use-paycrest";
import { RecentTransactions } from "@/components/RecentTransactions";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

type SheetType =
  | "send"
  | "paybill"
  | "paytill"
  | "airtime"
  | "bundles"
  | "cashout"
  | "receive"
  | "deposit"
  | null;

const Home = () => {
  const { address } = useAccount();
  const { theme, setTheme } = useTheme();
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  const actions = [
    {
      icon: Send,
      label: "Send",
      sheet: "send" as SheetType,
      color: "bg-primary/15 text-primary",
    },
    {
      icon: ArrowDownLeft,
      label: "Receive",
      sheet: "receive" as SheetType,
      color: "bg-blue-500/15 text-blue-600",
    },
    // {
    //   icon: Receipt,
    //   label: "Pay Bill",
    //   sheet: "paybill" as SheetType,
    //   color: "bg-orange-500/15 text-orange-600",
    // },
    // {
    //   icon: CreditCard,
    //   label: "Pay Till",
    //   sheet: "paytill" as SheetType,
    //   color: "bg-purple-500/15 text-purple-600",
    // },
    // {
    //   icon: Phone,
    //   label: "Airtime",
    //   sheet: "airtime" as SheetType,
    //   color: "bg-cyan-500/15 text-cyan-600",
    // },
    // {
    //   icon: Wifi,
    //   label: "Bundles",
    //   sheet: "bundles" as SheetType,
    //   color: "bg-pink-500/15 text-pink-600",
    // },
    {
      icon: ArrowDownToLine,
      label: "Cash out",
      sheet: "cashout" as SheetType,
      color: "bg-red-500/15 text-red-600",
    },
    {
      icon: QrCode,
      label: "Deposit",
      sheet: "deposit" as SheetType,
      color: "bg-amber-500/15 text-amber-600",
    },
  ];

  const close = () => setActiveSheet(null);

  return (
    <div className="bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 ">
        <div className="flex items-center justify-between mb-5 top-0 sticky z-50 bg-background/80 backdrop-blur-sm py-3">
          <div>
            <p className="text-sm text-muted-foreground">{getGreeting()}</p>
            <h1 className="text-xl font-bold text-foreground">
              {address ? shortenAddress(address) : ""}
            </h1>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-xl bg-card card-shadow flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        <div className="mb-6">
          <BalanceCard />
        </div>

        <div className={`grid grid-cols-${actions.length / 2} gap-3 mb-6`}>
          {actions.map((action) => (
            <ActionButton
              key={action.sheet}
              icon={action.icon}
              label={action.label}
              onClick={() => setActiveSheet(action.sheet)}
              color={action.color}
            />
          ))}
        </div>

        <RecentTransactions />
      </div>

      <SendMoneySheet open={activeSheet === "send"} onClose={close} />
      <PayBillSheet open={activeSheet === "paybill"} onClose={close} />
      <PayTillSheet open={activeSheet === "paytill"} onClose={close} />
      <BuyAirtimeSheet open={activeSheet === "airtime"} onClose={close} />
      <BuyBundlesSheet open={activeSheet === "bundles"} onClose={close} />
      <WithdrawSheet open={activeSheet === "cashout"} onClose={close} />
      <ReceiveMoneySheet open={activeSheet === "receive"} onClose={close} />
      <DepositSheet open={activeSheet === "deposit"} onClose={close} />
    </div>
  );
};

export default Home;
