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
});

const CashOutMobile = () => {
  const router = useRouter();
  const [sendType, setSendType] = useState<SendType>("single");

  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(
    null,
  );
  const [phone, setPhone] = useState("");
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
    token: "USDC",
    currency: selectedCurrency!,
  });

  const currencyOptions = useMemo(
    () =>
      (supportedCurrencies ?? []).map((c) => ({
        value: c.code,
        label: c.name + " - " + c.code,
      })),
    [supportedCurrencies],
  );

  const providerOptions = useMemo(
    () =>
      (supportedCurrencyInstitutions ?? [])
        .filter((i) => i.type === "mobile_money")
        .map((i) => ({ value: i.code, label: i.name })),
    [supportedCurrencyInstitutions],
  );

  const institutionName =
    providerOptions.find((o) => o.value === selectedInstitution)?.label ?? "";
  const currency = selectedCurrency ?? "KES";
  const usdcAmount = amount ? (parseFloat(amount) / rate).toFixed(2) : "0.00";

  const validBulkEntries = bulkEntries.filter((e) => e.recipient && e.amount);
  const bulkTotal = validBulkEntries.reduce(
    (sum, e) => sum + parseFloat(e.amount || "0"),
    0,
  );

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const canContinue =
    sendType === "bulk"
      ? validBulkEntries.length >= 1 && !!selectedInstitution
      : !!selectedInstitution && !!phone && !!amount;

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
        { label: "Method", value: "Mobile Money" },
        { label: "Provider", value: institutionName },
        { label: "Recipients", value: `${validBulkEntries.length}` },
        {
          label: "Total Amount",
          value: `${currency} ${bulkTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        },
        {
          label: "USDC Deducted",
          value: `${(bulkTotal / rate).toFixed(2)} USDC`,
        },
        { label: "Rate", value: `1 USDC = ${currency} ${rate}` },
      ];
    }
    return [
      { label: "Method", value: "Mobile Money" },
      { label: "Provider", value: institutionName },
      { label: "Phone Number", value: phone },
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
          <PageHeader title="Mobile Transfer" />
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
          {/* Currency & Provider row */}
          <div className="flex flex-col gap-3">
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
                Provider
              </label>
              <SearchableSelect
                options={providerOptions}
                value={selectedInstitution}
                onChange={setSelectedInstitution}
                placeholder="Select provider"
                searchPlaceholder="Search provider..."
                loading={loadingCurrencyInstitutions}
                disabled={!selectedCurrency}
              />
            </div>
          </div>

          {sendType === "single" ? (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                {amount && rate > 0 && (
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
                recipientPlaceholder="0712 345 678"
                amountLabel={currency}
                recipientType="tel"
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
        title="Confirm Mobile Transfer"
        details={getConfirmDetails()}
      />
    </div>
  );
};

export default CashOutMobile;
