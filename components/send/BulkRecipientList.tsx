import { X, Plus } from "lucide-react";

export interface BulkEntry {
  id: string;
  recipient: string;
  amount: string;
  accountName?: string;
}

interface Props {
  entries: BulkEntry[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChangeRecipient: (id: string, value: string) => void;
  onChangeAmount: (id: string, value: string) => void;
  recipientPlaceholder: string;
  amountLabel: string;
  recipientType?: "tel" | "text";
}

const BulkRecipientList = ({
  entries,
  onAdd,
  onRemove,
  onChangeRecipient,
  onChangeAmount,
  recipientPlaceholder,
  amountLabel,
  recipientType = "tel",
}: Props) => {
  return (
    <div className="space-y-3">
      {entries.map((entry, idx) => (
        <div
          key={entry.id}
          className="rounded-xl bg-accent/30 border border-border p-3 relative"
        >
          {entries.length > 1 && (
            <button
              onClick={() => onRemove(entry.id)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-destructive" />
            </button>
          )}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              #{idx + 1}
            </span>
          </div>
          <input
            type={recipientType}
            placeholder={recipientPlaceholder}
            value={entry.recipient}
            onChange={(e) => onChangeRecipient(entry.id, e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm mb-2"
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder={`${amountLabel} 0.00`}
            value={entry.amount}
            onChange={(e) =>
              onChangeAmount(entry.id, e.target.value.replace(/[^0-9.]/g, ""))
            }
            className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm font-semibold"
          />
        </div>
      ))}

      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-primary/40 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Recipient
      </button>
    </div>
  );
};

export default BulkRecipientList;
