import { useState } from "react";
import { Copy, Check, Link2, QrCode, Smartphone, Wallet } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import TransactionSheet from "@/components/TransactionSheet";
import { useUser } from "@/contexts/UserContext";
import { useAccount } from "wagmi";

interface Props {
  open: boolean;
  onClose: () => void;
}

type ReceiveMode = null | "request" | "share";

const ReceiveMoneySheet = ({ open, onClose }: Props) => {
  const { address } = useAccount();
  const { profile } = useUser();
  const [mode, setMode] = useState<ReceiveMode>(null);
  const [requestAmount, setRequestAmount] = useState("");
  const [requestCurrency, setRequestCurrency] = useState<"KES" | "USDC">("KES");
  const [copied, setCopied] = useState<string | null>(null);
  const [linkGenerated, setLinkGenerated] = useState(false);

  const rate = 129.12;

  const resetAll = () => {
    setMode(null);
    setRequestAmount("");
    setRequestCurrency("KES");
    setCopied(null);
    setLinkGenerated(false);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const paymentLink = `https://pay.app/r/${profile.walletAddress.slice(0, 8)}?amount=${requestAmount}&currency=${requestCurrency}`;

  return (
    <TransactionSheet open={open} onClose={handleClose} title="Receive Money">
      <div className="mt-2 mb-4">
        {mode === null && (
          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted-foreground mb-4">
              How would you like to receive?
            </p>
            {/* <button
              onClick={() => setMode("request")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-accent/50 border border-border hover:border-primary/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Link2 className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-sm font-semibold text-foreground">
                  Request Payment
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Generate a link or QR with a specific amount
                </p>
              </div>
            </button> */}
            <button
              onClick={() => setMode("share")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-accent/50 border border-border hover:border-primary/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-sm font-semibold text-foreground">
                  Share Payment Details
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Share your wallet address or phone number
                </p>
              </div>
            </button>
          </div>
        )}

        {mode === "request" && (
          <div className="space-y-4">
            <button
              onClick={() => setMode(null)}
              className="text-xs font-medium text-primary"
            >
              ← Back
            </button>
            {!linkGenerated ? (
              <>
                <div className="flex gap-2 p-1 rounded-xl bg-muted">
                  {(["KES", "USDC"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setRequestCurrency(c)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${requestCurrency === c ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Amount ({requestCurrency})
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={requestAmount}
                    onChange={(e) =>
                      setRequestAmount(e.target.value.replace(/[^0-9.]/g, ""))
                    }
                    className="w-full px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow text-2xl font-bold"
                  />
                  {requestAmount && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      ≈{" "}
                      {requestCurrency === "KES"
                        ? `${(parseFloat(requestAmount || "0") / rate).toFixed(2)} USDC`
                        : `KES ${(parseFloat(requestAmount || "0") * rate).toFixed(2)}`}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setLinkGenerated(true)}
                  disabled={!requestAmount || parseFloat(requestAmount) <= 0}
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
                >
                  Generate Payment Link
                </button>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-card rounded-2xl p-5 border border-border inline-block mx-auto">
                  <QRCodeSVG
                    value={paymentLink}
                    size={180}
                    bgColor="transparent"
                    fgColor="hsl(var(--foreground))"
                    level="M"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {requestCurrency} {requestAmount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scan this QR code to pay
                  </p>
                </div>
                <div className="rounded-xl bg-accent/50 border border-border p-3">
                  <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider font-semibold">
                    Payment Link
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-foreground font-mono truncate flex-1">
                      {paymentLink}
                    </p>
                    <button
                      onClick={() => copyToClipboard(paymentLink, "link")}
                      className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      {copied === "link" ? (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-primary" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        url: paymentLink,
                        title: `Pay ${requestCurrency} ${requestAmount}`,
                      });
                    } else {
                      copyToClipboard(paymentLink, "link");
                    }
                  }}
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Share Link
                </button>
              </div>
            )}
          </div>
        )}

        {mode === "share" && (
          <div className="space-y-4">
            <button
              onClick={() => setMode(null)}
              className="text-xs font-medium text-primary"
            >
              ← Back
            </button>
            <div className="text-center mb-2">
              <div className="bg-card rounded-2xl p-5 border border-border inline-block mx-auto">
                <QRCodeSVG
                  value={address!}
                  size={180}
                  bgColor="transparent"
                  fgColor="hsl(var(--foreground))"
                  level="M"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Scan to get my wallet address
              </p>
            </div>
            <div className="rounded-xl bg-accent/50 border border-border p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Wallet Address
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-foreground font-mono truncate flex-1">
                  {address!}
                </p>
                <button
                  onClick={() => copyToClipboard(address!, "wallet")}
                  className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  {copied === "wallet" ? (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-primary" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TransactionSheet>
  );
};

export default ReceiveMoneySheet;
