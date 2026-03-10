"use client";

import {
  ArrowUpRight,
  ArrowDownLeft,
  Phone,
  Receipt,
  Wifi,
  Copy,
  Check,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { Transaction } from "@/components/TransactionItem";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import Link from "next/link";
import { shortenAddress } from "@/utils";
import { Button } from "./ui/button";

interface Props {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

const typeIcons: Record<Transaction["type"], React.ElementType> = {
  send: ArrowUpRight,
  receive: ArrowDownLeft,
  paybill: Receipt,
  airtime: Phone,
  bundles: Wifi,
  cashout: ArrowUpRight,
  deposit: ArrowDownLeft,
};

const typeLabels: Record<Transaction["type"], string> = {
  send: "Money Sent",
  receive: "Money Received",
  paybill: "Bill Payment",
  airtime: "Airtime Purchase",
  bundles: "Data Bundle",
  cashout: "Cash out",
  deposit: "Deposit",
};

const TransactionDetailSheet = ({ transaction, open, onClose }: Props) => {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const Icon = typeIcons[transaction.type];
  const isDebit = ["send", "paybill", "airtime", "bundles", "cashout"].includes(
    transaction.type,
  );
  const txId = transaction._id;

  const copyTxId = () => {
    navigator.clipboard.writeText(txId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // amountInToken

  const details = [
    { label: "Type", value: typeLabels[transaction.type] },
    {
      label: `Amount (${transaction.currency})`,
      value: `${isDebit ? "-" : "+"}${transaction.currency} ${transaction.amount}`,
    },
    {
      label: `Amount (${transaction.token})`,
      value: `${isDebit ? "-" : "+"} ${transaction.amountInToken} ${transaction.token} `,
    },
    { label: "Description", value: transaction.description },
    { label: "Date", value: new Date(transaction.updatedAt).toLocaleString() },
    { label: "Status", value: transaction.status },
    { label: "Transaction ID", value: txId },
    {
      label: "Transaction Hash",
      value: transaction.txHash ? transaction.txHash : null,
    },
  ];

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="rounded-t-3xl border-0 bg-card max-w-md mx-auto">
        <DrawerHeader className="px-6 pt-2 pb-0">
          <DrawerTitle className="sr-only">Transaction Details</DrawerTitle>
          <DrawerDescription className="sr-only">
            Details for this transaction
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-6 safe-bottom mb-4">
          <div className="flex flex-col items-center mb-5">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
                isDebit ? "bg-destructive/10" : "bg-accent"
              }`}
            >
              <Icon
                className={`w-7 h-7 ${isDebit ? "text-destructive" : "text-accent-foreground"}`}
              />
            </div>
            <p
              className={`text-2xl font-bold ${isDebit ? "text-foreground" : "text-primary"}`}
            >
              {isDebit ? "-" : "+"}
              {transaction.currency} {transaction.amount}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {typeLabels[transaction.type]}
            </p>
          </div>

          <div className="bg-secondary/50 rounded-2xl p-4 space-y-3 mb-4">
            {details.map((d, i) => {
              const isTransactionHash = d.label === "Transaction Hash";
              return (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {d.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-medium text-foreground ${
                        d.label === "Status"
                          ? transaction.status === "settled"
                            ? "text-primary"
                            : transaction.status === "pending"
                              ? "text-warning"
                              : "text-destructive"
                          : ""
                      } capitalize`}
                    >
                      {isTransactionHash && transaction.txHash ? (
                        <Button
                          variant="outline"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Link
                            href={`https://basescan.org/tx/${transaction.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {shortenAddress(transaction.txHash)}
                          </Link>
                        </Button>
                      ) : (
                        d.value
                      )}
                    </span>
                    {d.label === "Transaction ID" && (
                      <button
                        onClick={copyTxId}
                        className="p-1 rounded-lg hover:bg-secondary transition-colors"
                      >
                        {copied ? (
                          <Check className="w-3 h-3 text-primary" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Transaction Receipt",
                  text: `${typeLabels[transaction.type]}: KES ${transaction.amount} — ${new Date(transaction.updatedAt).toLocaleString()}`,
                });
              } else {
                copyTxId();
              }
            }}
            className="w-full py-3.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Receipt
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionDetailSheet;
