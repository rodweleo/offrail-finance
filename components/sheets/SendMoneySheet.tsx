import { useState, useCallback, useRef } from "react";
import {
  Smartphone,
  Wallet,
  ArrowRight,
  Users,
  User,
  ScanLine,
} from "lucide-react";
import TransactionSheet from "@/components/TransactionSheet";
import ConfirmationSheet from "@/components/ConfirmationSheet";
import RecentRecipients, {
  Recipient,
} from "@/components/send/RecentRecipients";
import BulkRecipientList, {
  BulkEntry,
} from "@/components/send/BulkRecipientList";
import QRScannerModal from "@/components/send/QRScannerModal";
import { getExchangeRate } from "@/utils";
import { useTokenFiatExchangeRate } from "@/hooks/useTokenFiatExchangeRate";
import {
  Transaction,
  TransactionButton,
} from "@coinbase/onchainkit/transaction";
import { ERC20_ABI } from "@/utils/contracts";
import { encodeFunctionData, parseUnits } from "viem";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

type SendMode = null | "phone" | "wallet";
type SendType = "single" | "bulk";

let nextId = 1;
const makeEntry = (): BulkEntry => ({
  id: String(nextId++),
  recipient: "",
  amount: "",
});

const SendMoneySheet = ({ open, onClose }: Props) => {
  const [mode, setMode] = useState<SendMode>(null);
  const [sendType, setSendType] = useState<SendType>("single");
  // Single phone
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  // Bulk
  const [bulkEntries, setBulkEntries] = useState<BulkEntry[]>([makeEntry()]);

  const validBulkEntries = bulkEntries.filter((e) => e.recipient && e.amount);
  const bulkTotal = validBulkEntries.reduce(
    (sum, e) => sum + parseFloat(e.amount || "0"),
    0,
  );

  const { data: rate, isLoading: isRateLoading } = useTokenFiatExchangeRate({
    token: "USDC",
    amount: bulkTotal > 0 ? bulkTotal : 1,
    fiatCurrency: "KES",
  });

  // Single wallet
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAmount, setWalletAmount] = useState("");

  // QR
  const [showQR, setShowQR] = useState(false);

  // Confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const onSubmitRef = useRef<(() => void) | null>(null);

  const usdcFromKes = (kes: string) => {
    return kes
      ? (parseFloat(kes) / (!isRateLoading && rate ? rate : 0)).toFixed(2)
      : "0.00";
  };

  const handleConfirm = () => {
    setLoading(true);
    onSubmitRef.current?.();
  };

  const resetAll = () => {
    setMode(null);
    setSendType("single");
    setPhone("");
    setAmount("");
    setWalletAddress("");
    setWalletAmount("");
    setBulkEntries([makeEntry()]);
    setShowConfirm(false);
    setShowQR(false);
    setLoading(false);
    setSuccess(false);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };
  const handleConfirmClose = () => {
    setShowConfirm(false);
    setSuccess(false);
    if (success) handleClose();
  };
  const handleBack = () => {
    setMode(null);
    setSendType("single");
    setBulkEntries([makeEntry()]);
  };

  const handleRecentSelect = useCallback((r: Recipient) => {
    if (r.type === "phone") {
      setMode("phone");
      setPhone(r.value);
    } else {
      setMode("wallet");
      setWalletAddress(r.value);
    }
  }, []);

  const handleQRScan = useCallback(
    (value: string) => {
      if (sendType === "bulk") {
        setBulkEntries((prev) => {
          const empty = prev.find((e) => !e.recipient);
          if (empty) {
            return prev.map((e) =>
              e.id === empty.id ? { ...e, recipient: value } : e,
            );
          }
          return [...prev, { ...makeEntry(), recipient: value }];
        });
      } else {
        setWalletAddress(value);
      }
      setShowQR(false);
    },
    [sendType],
  );

  // Bulk helpers
  const addEntry = () => setBulkEntries((p) => [...p, makeEntry()]);
  const removeEntry = (id: string) =>
    setBulkEntries((p) => p.filter((e) => e.id !== id));
  const changeRecipient = (id: string, v: string) =>
    setBulkEntries((p) =>
      p.map((e) => (e.id === id ? { ...e, recipient: v } : e)),
    );
  const changeAmount = (id: string, v: string) =>
    setBulkEntries((p) =>
      p.map((e) => (e.id === id ? { ...e, amount: v } : e)),
    );

  const isValidAddress = walletAddress.length >= 10;
  const shortenAddress = (addr: string) =>
    addr.length > 14 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  // Quick amounts
  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  // Confirmation details
  const getConfirmDetails = () => {
    if (sendType === "bulk") {
      const currency = mode === "phone" ? "KES" : "USDC";
      return [
        { label: "Recipients", value: `${validBulkEntries.length}` },
        { label: "Total Amount", value: `${currency} ${bulkTotal.toFixed(2)}` },
        ...(mode === "phone"
          ? [
              {
                label: "USDC Total",
                value: `${usdcFromKes(String(bulkTotal))} USDC`,
              },
            ]
          : [
              {
                label: "KES Total",
                value: `KES ${(bulkTotal * (!isRateLoading && rate! ? rate : 0)).toFixed(2)}`,
              },
            ]),
        { label: "Fee", value: mode === "phone" ? "KES 0.00" : "< $0.01" },
      ];
    }
    if (mode === "phone") {
      return [
        { label: "Recipient", value: phone },
        { label: "Amount", value: `KES ${amount}` },
        { label: "USDC Equivalent", value: `${usdcFromKes(amount)} USDC` },
        { label: "Fee", value: "KES 0.00" },
        { label: "Rate", value: `1 USDC = KES ${rate}` },
      ];
    }
    return [
      { label: "To Wallet", value: shortenAddress(walletAddress) },
      { label: "Amount", value: `${walletAmount} USDC` },
      {
        label: "KES Equivalent",
        value: `KES ${(parseFloat(walletAmount || "0") * (!isRateLoading && rate! ? rate : 0)).toFixed(2)}`,
      },
      { label: "Network", value: "Base" },
      { label: "Network Fee", value: "< $0.01" },
    ];
  };

  const canContinue = () => {
    if (sendType === "bulk") return validBulkEntries.length >= 1;
    if (mode === "phone") return !!phone && !!amount;
    return isValidAddress && !!walletAmount;
  };

  return (
    <>
      <TransactionSheet
        open={open && !showConfirm}
        onClose={handleClose}
        title="Send Money"
      >
        <div className="mb-2">
          {/* Mode Selector */}
          {mode === null && (
            <div className="space-y-3 pt-2">
              {/* Recent recipients */}
              {/* <RecentRecipients onSelect={handleRecentSelect} /> */}

              <p className="text-sm text-muted-foreground mt-3 mb-1">
                How would you like to send?
              </p>

              <button
                onClick={() => setMode("phone")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-accent/50 border border-border hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    To Phone Number
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Send KES to any M-Pesa number
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() => setMode("wallet")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-accent/50 border border-border hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    To Crypto Wallet
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Send USDC on Base network
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>
          )}

          {/* Phone Flow */}
          {mode === "phone" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="text-xs font-medium text-primary"
                >
                  ← Back
                </button>
                {/* Single / Bulk toggle */}
                <div className="flex gap-1 p-0.5 rounded-lg bg-muted">
                  <button
                    onClick={() => setSendType("single")}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      sendType === "single"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    <User className="w-3 h-3" /> Single
                  </button>
                  <button
                    onClick={() => setSendType("bulk")}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      sendType === "bulk"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Users className="w-3 h-3" /> Bulk
                  </button>
                </div>
              </div>

              {/* Recent */}
              {/* <RecentRecipients
                filterType="phone"
                onSelect={(r) => {
                  if (sendType === "bulk") {
                    setBulkEntries((prev) => {
                      const empty = prev.find((e) => !e.recipient);
                      if (empty)
                        return prev.map((e) =>
                          e.id === empty.id ? { ...e, recipient: r.value } : e,
                        );
                      return [...prev, { ...makeEntry(), recipient: r.value }];
                    });
                  } else {
                    setPhone(r.value);
                  }
                }}
              /> */}

              {sendType === "single" ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="0712 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow text-base"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Amount (KES)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) =>
                        setAmount(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow text-2xl font-bold"
                    />
                    {amount && (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        ≈ {usdcFromKes(amount)} USDC
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((qa) => (
                      <button
                        key={qa}
                        onClick={() => setAmount(String(qa))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          amount === String(qa)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border text-foreground hover:border-primary/40"
                        }`}
                      >
                        {qa.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <BulkRecipientList
                    entries={bulkEntries}
                    onAdd={addEntry}
                    onRemove={removeEntry}
                    onChangeRecipient={changeRecipient}
                    onChangeAmount={changeAmount}
                    recipientPlaceholder="0712 345 678"
                    amountLabel="KES"
                    recipientType="tel"
                  />
                  {validBulkEntries.length > 0 && (
                    <div className="rounded-xl bg-accent/50 border border-border p-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {validBulkEntries.length} recipient
                        {validBulkEntries.length > 1 ? "s" : ""}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        Total: KES{" "}
                        {bulkTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                </>
              )}

              <button
                onClick={() => setShowConfirm(true)}
                disabled={!canContinue()}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
              >
                {sendType === "bulk"
                  ? `Send to ${validBulkEntries.length} Recipient${validBulkEntries.length !== 1 ? "s" : ""}`
                  : "Continue"}
              </button>
            </div>
          )}

          {/* Wallet Flow */}
          {mode === "wallet" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="text-xs font-medium text-primary"
                >
                  ← Back
                </button>
                <div className="flex gap-1 p-0.5 rounded-lg bg-muted">
                  <button
                    onClick={() => setSendType("single")}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      sendType === "single"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    <User className="w-3 h-3" /> Single
                  </button>
                  <button
                    onClick={() => setSendType("bulk")}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      sendType === "bulk"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Users className="w-3 h-3" /> Bulk
                  </button>
                </div>
              </div>

              {/* Recent */}
              {/* <RecentRecipients
                filterType="wallet"
                onSelect={(r) => {
                  if (sendType === "bulk") {
                    setBulkEntries((prev) => {
                      const empty = prev.find((e) => !e.recipient);
                      if (empty)
                        return prev.map((e) =>
                          e.id === empty.id ? { ...e, recipient: r.value } : e,
                        );
                      return [...prev, { ...makeEntry(), recipient: r.value }];
                    });
                  } else {
                    setWalletAddress(r.value);
                  }
                }}
              /> */}

              {sendType === "single" ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Wallet Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="0x..."
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="flex-1 px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow text-sm font-mono"
                      />
                      {/* <button
                        onClick={() => setShowQR(true)}
                        className="px-3.5 rounded-xl bg-accent/50 border border-border hover:border-primary/40 transition-colors flex items-center justify-center"
                        title="Scan QR Code"
                      >
                        <ScanLine className="w-5 h-5 text-primary" />
                      </button> */}
                    </div>
                    {isValidAddress && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs text-primary font-medium">
                          Valid address
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Amount (USDC)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={walletAmount}
                      onChange={(e) =>
                        setWalletAmount(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow text-2xl font-bold"
                    />
                    {Number(walletAmount) > 0 && !isRateLoading && rate ? (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        ≈ KES{" "}
                        {!isRateLoading && rate
                          ? (parseFloat(walletAmount) * rate).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )
                          : "0.00"}
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-xl bg-accent/50 border border-border p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Network</span>
                      <span className="font-medium text-foreground flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        Base
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-muted-foreground">Est. Fee</span>
                      <span className="font-medium text-primary">
                        {"< $0.01"}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowQR(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <ScanLine className="w-3.5 h-3.5" /> Scan QR
                    </button>
                  </div>
                  <BulkRecipientList
                    entries={bulkEntries}
                    onAdd={addEntry}
                    onRemove={removeEntry}
                    onChangeRecipient={changeRecipient}
                    onChangeAmount={changeAmount}
                    recipientPlaceholder="0x... wallet address"
                    amountLabel="USDC"
                    recipientType="text"
                  />
                  {validBulkEntries.length > 0 && (
                    <div className="rounded-xl bg-accent/50 border border-border p-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {validBulkEntries.length} wallet
                        {validBulkEntries.length > 1 ? "s" : ""}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        Total: {bulkTotal.toFixed(2)} USDC
                      </span>
                    </div>
                  )}
                </>
              )}

              <button
                onClick={() => setShowConfirm(true)}
                disabled={!canContinue()}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
              >
                {sendType === "bulk"
                  ? `Send to ${validBulkEntries.length} Wallet${validBulkEntries.length !== 1 ? "s" : ""}`
                  : "Review Transfer"}
              </button>
            </div>
          )}
        </div>
      </TransactionSheet>

      <ConfirmationSheet
        open={showConfirm}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        loading={loading}
        success={success}
        title={
          sendType === "bulk"
            ? `Bulk ${mode === "phone" ? "Send" : "Transfer"} (${validBulkEntries.length})`
            : mode === "phone"
              ? "Confirm Send"
              : "Confirm Transfer"
        }
        details={getConfirmDetails()}
      />

      <Transaction
        chainId={84532}
        calls={
          walletAddress
            ? [
                {
                  to: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`,
                  data: encodeFunctionData({
                    abi: ERC20_ABI,
                    functionName: "transfer",
                    args: [
                      walletAddress as `0x${string}`,
                      parseUnits(walletAmount.toString(), 6),
                    ],
                  }),
                },
              ]
            : []
        }
        onStatus={(status) => {
          switch (status.statusName) {
            case "success":
              toast.success(
                `Successfully sent to ${shortenAddress(walletAddress)}!`,
              );
              setLoading(false);
              setSuccess(true);
              break;
            case "transactionPending":
              setLoading(true);
              break;
            case "error":
              toast.error(
                `${status.statusData.message}` +
                  ` ${JSON.parse(status.statusData.error).cause.shortMessage}`,
              );
              setLoading(false);
              setSuccess(false);
              break;
          }
        }}
      >
        <TransactionButton
          className="hidden"
          render={({ onSubmit }) => {
            // Capture onSubmit so we can call it programmatically
            onSubmitRef.current = onSubmit;
            return <></>; // renders nothing
          }}
        />
      </Transaction>
      <QRScannerModal
        open={showQR}
        onClose={() => setShowQR(false)}
        onScan={handleQRScan}
      />
    </>
  );
};

export default SendMoneySheet;
