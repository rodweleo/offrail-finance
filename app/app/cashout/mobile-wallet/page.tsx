"use client";

import { useState, useMemo, useRef, useEffect } from "react";
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
import { useAccount, useChainId } from "wagmi";
import axios from "axios";
import { toast } from "sonner";
import { shortenAddress } from "@/utils";
import { ERC20_ABI } from "@/utils/contracts";
import {
  Transaction,
  LifecycleStatus,
  TransactionButton,
} from "@/components/TransactionComponent";
import { encodeFunctionData, parseUnits } from "viem";
import { ALL_SUPPORTED_TOKENS, SUPPORTED_TOKENS } from "@/utils/tokens";

type SendType = "single" | "bulk";

let nextId = 1;
const makeEntry = (): BulkEntry => ({
  id: String(nextId++),
  recipient: "",
  amount: "",
});

const CashOutMobile = () => {
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const onSubmitRef = useRef<(() => void) | null>(null);

  const [calls, setCalls] = useState<any[]>([]);
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
  const [transactionReference, setTransactionReference] = useState<
    string | null
  >(null);

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

  // Trigger transaction when calls are populated
  useEffect(() => {
    if (calls.length > 0 && onSubmitRef.current) {
      onSubmitRef.current();
    }
  }, [calls]);

  const currencyOptions = useMemo(
    () =>
      (supportedCurrencies ?? []).map((c: any) => ({
        value: c.code,
        label: c.name + " - " + c.code,
      })),
    [supportedCurrencies],
  );

  const providerOptions = useMemo(
    () =>
      (supportedCurrencyInstitutions ?? [])
        .filter((i: any) => i.type === "mobile_money")
        .map((i: any) => ({ value: i.code, label: i.name })),
    [supportedCurrencyInstitutions],
  );

  const institutionName =
    providerOptions.find((o: any) => o.value === selectedInstitution)?.label ??
    "";
  const currency = selectedCurrency ?? "KES";
  const usdcAmount = amount ? (parseFloat(amount) / rate!).toFixed(2) : "0.00";

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

  const handleConfirm = async () => {
    try {
      setLoading(true);

      const data = {
        type: "cashout",
        amount: sendType === "single" ? usdcAmount : bulkTotal.toString(),
        token: "USDC",
        network: "base",
        receipient: {
          institution: selectedInstitution,
          accountIdentifier: sendType === "single" ? phone : "",
          accountName: sendType === "single" ? phone : "",
          memo: sendType === "single" ? `Cashout to ${phone}` : "Bulk cashout",
          currency,
        },
        returnAddress: address,
        fromAddress: address,
        originalAmount: amount,
      };

      const orderResponse = await axios.post(
        "/api/cashout/mobile-wallet",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (orderResponse.status !== 201) {
        toast.error("Failed to create cashout order. Please try again.");
        setLoading(false);
        return;
      }
      const orderDtls = orderResponse.data;
      setTransactionReference(orderDtls.reference);

      const totalAmount =
        Number(orderDtls.amount) +
        Number(orderDtls.senderFee) +
        Number(orderDtls.transactionFee);

      const tokenContractDtls = ALL_SUPPORTED_TOKENS.find(
        (token) => token.symbol === "USDC" && token.chainId === chainId,
      );

      if (tokenContractDtls) {
        const transactionCalls = [
          {
            to: tokenContractDtls?.contractAddress as `0x${string}`,
            data: encodeFunctionData({
              abi: ERC20_ABI,
              functionName: "transfer",
              args: [
                orderDtls.receiveAddress as `0x${string}`,
                parseUnits(totalAmount.toString(), tokenContractDtls.decimals),
              ],
            }),
          },
        ];
        // This will trigger the useEffect which calls onSubmitRef.current()
        setCalls(transactionCalls);
      } else {
        toast.error("Token contract details not found");
        setLoading(false);
      }
    } catch (e) {
      console.error("Cashout error:", e);
      toast.error(
        e.response?.data?.error ||
          "An error occurred during cashout. Please try again.",
      );
      setLoading(false);
    }
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
          value: `${(bulkTotal / rate!).toFixed(2)} USDC`,
        },
        { label: "Rate", value: `1 USDC = ${currency} ${rate!}` },
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
    <div className="bg-background">
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
        transactionReference={transactionReference}
      />

      <Transaction
        chainId={chainId}
        calls={address ? calls : []}
        onStatus={(status: LifecycleStatus) => {
          switch (status.statusName) {
            case "success":
              toast.success(`Transaction was successful!`);
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
            default:
              break;
          }
        }}
      >
        <TransactionButton
          className="hidden"
          render={({ onSubmit }) => {
            // Capture onSubmit so we can call it programmatically
            onSubmitRef.current = onSubmit;
            return <></>;
          }}
        />
      </Transaction>
    </div>
  );
};

export default CashOutMobile;
