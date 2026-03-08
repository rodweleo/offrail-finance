import { useState } from "react";
import { Copy, Check, Smartphone, Wallet } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import TransactionSheet from "@/components/TransactionSheet";
import { useUser } from "@/contexts/UserContext";
import { useAccount } from "wagmi";
import { isAddressEqual } from "viem";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

type DepositMode = null | "mpesa" | "crypto";

const DepositSheet = ({ open, onClose }: Props) => {
  const { address } = useAccount();
  const { profile } = useUser();
  const [mode, setMode] = useState<DepositMode>(null);
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetAll = () => {
    setMode(null);
    setAmount("");
    setCopied(false);
    setProcessing(false);
    setSuccess(false);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const copyWallet = () => {
    navigator.clipboard.writeText(address!);
    setCopied(true);
    toast.success("Wallet address copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMpesaDeposit = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      try {
        navigator.vibrate?.(100);
      } catch {}
    }, 2000);
  };

  return (
    <TransactionSheet open={open} onClose={handleClose} title="Deposit">
      <div className="mb-4">
        {mode === null && !success && (
          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted-foreground mb-4">
              Choose how to fund your wallet
            </p>

            {/* <button
              onClick={() => setMode("mpesa")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-accent/50 border border-border hover:border-primary/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-sm font-semibold text-foreground">
                  Fund via M-Pesa
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Deposit KES via STK Push
                </p>
              </div>
            </button> */}

            <button
              onClick={() => setMode("crypto")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-accent/50 border border-border hover:border-primary/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-sm font-semibold text-foreground">
                  Fund via Crypto
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Send USDC on Base network
                </p>
              </div>
            </button>
          </div>
        )}

        {/* {mode === "mpesa" && !success && (
          <div className="space-y-4">
            <button
              onClick={() => setMode(null)}
              className="text-xs font-medium text-primary"
            >
              ← Back
            </button>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Amount (KES)
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 1,000"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="w-full px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow text-2xl font-bold"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              An STK push will be sent to {profile.phone}
            </p>
            <button
              onClick={handleMpesaDeposit}
              disabled={!amount || parseFloat(amount) <= 0 || processing}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
            >
              {processing
                ? "Sending STK Push…"
                : `Deposit KES ${amount || "0"}`}
            </button>
          </div>
        )} */}

        {mode === "crypto" && (
          <div className="space-y-4">
            <button
              onClick={() => setMode(null)}
              className="text-xs font-medium text-primary"
            >
              ← Back
            </button>

            <div className="text-center">
              <div className="bg-card rounded-2xl p-5 border border-border inline-block mx-auto">
                <QRCodeSVG
                  value={address as `0x${string}`}
                  size={180}
                  bgColor="transparent"
                  fgColor="hsl(var(--foreground))"
                  level="M"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Scan to get wallet address
              </p>
            </div>

            <div className="rounded-xl bg-accent/50 border border-border p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Wallet Address
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-foreground font-mono truncate flex-1">
                  {address}
                </p>
                <button
                  onClick={copyWallet}
                  className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-primary" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-accent/30 rounded-xl p-4 text-left space-y-1.5">
              <p className="text-xs font-semibold text-accent-foreground">
                Important
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {/*  */}
                <li>• Minimum deposit: 1 USDC</li>
                <li>• Balance updates in ~30 seconds</li>
              </ul>
            </div>
          </div>
        )}

        {success && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4 animate-success-pop">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              STK Push Sent!
            </h3>
            <p className="text-sm text-muted-foreground">
              Check your phone and enter your M-Pesa PIN
            </p>
            <button
              onClick={handleClose}
              className="mt-6 w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </TransactionSheet>
  );
};

export default DepositSheet;
