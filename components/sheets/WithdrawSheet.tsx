import TransactionSheet from "@/components/TransactionSheet";
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
    href: "/app/cashout/mobile-wallet",
  },
  {
    label: "Bank Account",
    value: "bank_account",
    description: "Cashout to any bank account",
    icon: Building2,
    href: "/app/cashout/bank",
  },
];

const WithdrawSheet = ({ open, onClose }: Props) => {
  const router = useRouter();

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <TransactionSheet open={open} onClose={handleClose} title="Cashout">
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
    </>
  );
};

export default WithdrawSheet;
