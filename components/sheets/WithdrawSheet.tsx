import { useState } from "react";
import TransactionSheet from "@/components/TransactionSheet";
import ConfirmationSheet from "@/components/ConfirmationSheet";
import { Smartphone, ArrowRight, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
}

const withdrawOptions = [
  {
    label: "Mobile Wallet",
    value: "mobile_wallet",
    description: "Cashout fiat to any mobile wallet",
    icon: Smartphone,
    href: "/cashout/mobile-wallet",
  },
  {
    label: "Bank Account",
    value: "bank_account",
    description: "Cashout to any bank account",
    icon: Building2,
    href: "/cashout/bank",
  },
];

const WithdrawSheet = ({ open, onClose }: Props) => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const rate = 129.12;
  const usdcAmount = amount ? (parseFloat(amount) / rate).toFixed(2) : "0.00";

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleClose = () => {
    setPhone("");
    setAmount("");
    setShowConfirm(false);
    setLoading(false);
    setSuccess(false);
    onClose();
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    setSuccess(false);
    if (success) handleClose();
  };

  return (
    <>
      <TransactionSheet
        open={open && !showConfirm}
        onClose={handleClose}
        title="Cashout"
      >
        <ul className="space-y-4 mb-4 mt-2">
          {withdrawOptions.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => router.push(option.href)}
                className="cursor-pointer w-full flex items-center gap-4 p-4 rounded-2xl bg-accent/50 border border-border hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <option.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    To {option.label}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </li>
          ))}
        </ul>
      </TransactionSheet>

      <ConfirmationSheet
        open={showConfirm}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        loading={loading}
        success={success}
        title="Confirm Withdrawal"
        details={[
          { label: "M-Pesa Number", value: phone },
          { label: "Amount", value: `KES ${amount}` },
          { label: "USDC Deducted", value: `${usdcAmount} USDC` },
          { label: "Rate", value: `1 USDC = KES ${rate}` },
        ]}
      />
    </>
  );
};

export default WithdrawSheet;
