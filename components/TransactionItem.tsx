import {
  ArrowUpRight,
  ArrowDownLeft,
  Phone,
  Receipt,
  Wifi,
} from "lucide-react";

export interface Transaction {
  id: string;
  type:
    | "send"
    | "receive"
    | "paybill"
    | "airtime"
    | "bundles"
    | "cashout"
    | "deposit";
  description: string;
  amount: string;
  date: string;
  status: "completed" | "pending" | "failed";
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

const typeColors: Record<Transaction["type"], string> = {
  send: "bg-destructive/10 text-destructive",
  receive: "bg-accent text-accent-foreground",
  paybill: "bg-secondary text-secondary-foreground",
  airtime: "bg-secondary text-secondary-foreground",
  bundles: "bg-secondary text-secondary-foreground",
  cashout: "bg-destructive/10 text-destructive",
  deposit: "bg-accent text-accent-foreground",
};

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

const TransactionItem = ({ transaction, onClick }: TransactionItemProps) => {
  const Icon = typeIcons[transaction.type];
  const colorClass = typeColors[transaction.type];
  const isDebit = ["send", "paybill", "airtime", "bundles", "cashout"].includes(
    transaction.type,
  );

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 py-3 w-full text-left hover:bg-secondary/30 -mx-1 px-1 rounded-xl transition-colors"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {transaction.receipientMemo}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(transaction.updatedAt).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-semibold ${isDebit ? "text-foreground" : "text-primary"}`}
        >
          {isDebit ? "-" : "+"}KES {transaction.amount}
        </p>
        <p
          className={`text-xs capitalize ${
            transaction.status === "completed"
              ? "text-primary"
              : transaction.status === "pending"
                ? "text-warning"
                : "text-destructive"
          }`}
        >
          {transaction.status}
        </p>
      </div>
    </button>
  );
};

export default TransactionItem;
