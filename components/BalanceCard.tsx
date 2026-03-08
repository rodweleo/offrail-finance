import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { useAccount, useBalance } from "wagmi";
import { config } from "./Providers";
import { shortenAddress } from "@/utils";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useTokenExchangeRate } from "@/hooks/useTokenExchangeRate";

const BalanceCard = () => {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const { address, isConnecting } = useAccount();
  const { balance: usdcBalance } = useTokenBalance("USDC");
  const { data: balance, isLoading: isLoadingBalance } = useBalance({
    address,
    config,
  });
  const {
    data: exchangeRate,
    isLoading: isLoadingExchangeRate,
    error: exchangeRateError,
  } = useTokenExchangeRate(usdcBalance);

  const copyWallet = () => {
    navigator.clipboard.writeText(address!);
    setCopied(true);
    toast("Wallet address copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="gradient-balance rounded-2xl p-6 text-primary-foreground card-shadow-lg">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm opacity-80 font-medium">Wallet Balance</p>
        <button
          onClick={() => setVisible(!visible)}
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          {visible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
      </div>
      <h2 className="text-3xl font-bold tracking-tight mb-1">
        {visible && !isLoadingExchangeRate && !exchangeRateError
          ? `KES ${exchangeRate?.toFixed(2)}`
          : "KES ••••••"}
      </h2>
      <p className="text-sm opacity-70 mb-3">
        {!isLoadingBalance && visible ? `≈ ${usdcBalance} USDC` : `≈ •••• USDC`}
      </p>
      <button
        onClick={copyWallet}
        className="flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        <span className="font-mono">
          {isConnecting && !address ? "..." : shortenAddress(address!)}
        </span>
      </button>
    </div>
  );
};

export default BalanceCard;
