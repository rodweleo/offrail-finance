"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  usePaycrestSupportedCurrencies,
  usePaycrestSupportedInstitutionsByCurrency,
  usePaycrestExchangeRate,
} from "@/hooks/use-paycrest";
import BulkRecipientList, {
  BulkEntry,
} from "@/components/send/BulkRecipientList";
import ConfirmationSheet from "@/components/ConfirmationSheet";
import SearchableSelect from "@/components/SearchableSelect";
import PageHeader from "@/components/PageHeader";

type SendType = "single" | "bulk";

let nextId = 1;
const makeEntry = (): BulkEntry => ({
  id: String(nextId++),
  recipient: "",
  amount: "",
  accountName: "",
});

const CashOutBank = () => {
  const router = useRouter();
  const [sendType, setSendType] = useState<SendType>("single");

  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(
    null,
  );
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [bulkEntries, setBulkEntries] = useState<BulkEntry[]>([makeEntry()]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: supportedCurrencies, isLoading: loadingCurrencies } =
    usePaycrestSupportedCurrencies();
  const {
    data: supportedCurrencyInstitutions,
    isLoading: loadingCurrencyInstitutions,
  } = usePaycrestSupportedInstitutionsByCurrency(selectedCurrency!);
  const { data: rate } = usePaycrestExchangeRate({
    token: "usdc",
    currency: selectedCurrency || "kes",
  });

  const currencyOptions = useMemo(
    () =>
      (supportedCurrencies ?? []).map((c) => ({
        value: c.code,
        label: `${c.code} - ${c.name}`,
      })),
    [supportedCurrencies],
  );

  const bankOptions = useMemo(
    () =>
      (supportedCurrencyInstitutions ?? [])
        .filter((i) => i.type === "bank")
        .map((i) => ({ value: i.code, label: i.name })),
    [supportedCurrencyInstitutions],
  );

  const institutionName =
    bankOptions.find((o) => o.value === selectedInstitution)?.label ?? "";
  const currency = selectedCurrency ?? "KES";
  const usdcAmount =
    amount && rate ? (parseFloat(amount) / rate).toFixed(2) : 0;

  const validBulkEntries = bulkEntries.filter((e) => e.recipient && e.amount);
  const bulkTotal = validBulkEntries.reduce(
    (sum, e) => sum + parseFloat(e.amount || "0"),
    0,
  );

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  const canContinue =
    sendType === "bulk"
      ? validBulkEntries.length >= 1 && !!selectedInstitution
      : !!selectedInstitution && !!accountNumber && !!accountName && !!amount;

  const handleCurrencyChange = (val: string) => {
    setSelectedCurrency(val);
    setSelectedInstitution(null);
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    if (success) {
      setSuccess(false);
      router.push("/");
    }
  };

  const getConfirmDetails = () => {
    if (sendType === "bulk") {
      return [
        { label: "Method", value: "Bank Transfer" },
        { label: "Bank", value: institutionName },
        { label: "Recipients", value: `${validBulkEntries.length}` },
        {
          label: "Total Amount",
          value: `${currency} ${bulkTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        },
        { label: "USDC Deducted", value: `${usdcAmount} USDC` },
        { label: "Rate", value: `1 USDC = ${currency} ${rate}` },
      ];
    }
    return [
      { label: "Method", value: "Bank Transfer" },
      { label: "Bank", value: institutionName },
      { label: "Account Number", value: accountNumber },
      { label: "Account Name", value: accountName },
      { label: "Amount", value: `${currency} ${amount}` },
      { label: "USDC Deducted", value: `${usdcAmount} USDC` },
      { label: "Rate", value: `1 USDC = ${currency} ${rate}` },
    ];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pt-4 pb-8">
        {/* Header with compact toggle */}
        <div className="flex items-center justify-between mb-6">
          <PageHeader title="Bank Transfer" />
          <div className="flex gap-0.5 p-0.5 rounded-lg bg-muted">
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

        <div className="space-y-4">
          {/* Currency & Bank row */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Currency
              </label>
              <SearchableSelect
                options={currencyOptions}
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                placeholder="Select currency"
                searchPlaceholder="Search currency..."
                loading={loadingCurrencies}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Bank
              </label>
              <SearchableSelect
                options={bankOptions}
                value={selectedInstitution}
                onChange={setSelectedInstitution}
                placeholder="Select bank"
                searchPlaceholder="Search bank..."
                loading={loadingCurrencyInstitutions}
                disabled={!selectedCurrency}
              />
            </div>
          </div>

          {sendType === "single" ? (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow text-base"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Account Name
                </label>
                <input
                  type="text"
                  placeholder="Enter account holder name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow text-base"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Amount ({currency})
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow text-2xl font-bold"
                />
                {amount && rate! > 0 && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    ≈ {usdcAmount} USDC @ 1 USDC = {currency} {rate}
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
                onAdd={() => setBulkEntries((p) => [...p, makeEntry()])}
                onRemove={(id) =>
                  setBulkEntries((p) => p.filter((e) => e.id !== id))
                }
                onChangeRecipient={(id, v) =>
                  setBulkEntries((p) =>
                    p.map((e) => (e.id === id ? { ...e, recipient: v } : e)),
                  )
                }
                onChangeAmount={(id, v) =>
                  setBulkEntries((p) =>
                    p.map((e) => (e.id === id ? { ...e, amount: v } : e)),
                  )
                }
                recipientPlaceholder="Enter account number"
                amountLabel={currency}
                recipientType="text"
                showAccountName
                onChangeAccountName={(id, v) =>
                  setBulkEntries((p) =>
                    p.map((e) => (e.id === id ? { ...e, accountName: v } : e)),
                  )
                }
              />
              {validBulkEntries.length > 0 && (
                <div className="rounded-xl bg-accent/50 border border-border p-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {validBulkEntries.length} recipient
                    {validBulkEntries.length > 1 ? "s" : ""}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    Total: {currency}{" "}
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
            disabled={!canContinue}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
          >
            {sendType === "bulk"
              ? `Send to ${validBulkEntries.length} Recipient${validBulkEntries.length !== 1 ? "s" : ""}`
              : "Continue"}
          </button>
        </div>
      </div>

      <ConfirmationSheet
        open={showConfirm}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        loading={loading}
        success={success}
        title="Confirm Bank Transfer"
        details={getConfirmDetails()}
      />
    </div>
  );
};

export default CashOutBank;
