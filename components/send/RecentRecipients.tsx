import { Clock, Smartphone, Wallet } from "lucide-react";

export interface Recipient {
  id: string;
  type: "phone" | "wallet";
  label: string;
  value: string; // phone number or wallet address
}

const MOCK_RECENT: Recipient[] = [
  { id: "1", type: "phone", label: "James M.", value: "0712 345 678" },
  { id: "2", type: "phone", label: "Alice W.", value: "0798 765 432" },
  { id: "3", type: "wallet", label: "DeFi Wallet", value: "0x1a2B...9f4E" },
  { id: "4", type: "phone", label: "Brian K.", value: "0700 111 222" },
  { id: "5", type: "wallet", label: "Savings", value: "0xCd3F...8a1B" },
];

interface Props {
  filterType?: "phone" | "wallet";
  onSelect: (recipient: Recipient) => void;
}

const RecentRecipients = ({ filterType, onSelect }: Props) => {
  const filtered = filterType
    ? MOCK_RECENT.filter((r) => r.type === filterType)
    : MOCK_RECENT;

  if (filtered.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Recent</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {filtered.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className="flex flex-col items-center gap-1.5 min-w-[64px] p-2 rounded-xl bg-accent/50 border border-border hover:border-primary/40 transition-all shrink-0"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              {r.type === "phone" ? (
                <Smartphone className="w-4 h-4 text-primary" />
              ) : (
                <Wallet className="w-4 h-4 text-primary" />
              )}
            </div>
            <span className="text-[10px] font-medium text-foreground truncate max-w-[60px]">
              {r.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentRecipients;
