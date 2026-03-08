import { useState } from "react";
import TransactionSheet from "@/components/TransactionSheet";
import ConfirmationSheet from "@/components/ConfirmationSheet";

interface Props { open: boolean; onClose: () => void; }

const bundles = [
  { id: "1", name: "1GB - 1 Hour", price: "19", data: "1GB" },
  { id: "2", name: "1.5GB - 3 Hours", price: "50", data: "1.5GB" },
  { id: "3", name: "2.5GB - Till Midnight", price: "100", data: "2.5GB" },
  { id: "4", name: "6GB - 7 Days", price: "250", data: "6GB" },
  { id: "5", name: "12GB - 30 Days", price: "500", data: "12GB" },
  { id: "6", name: "25GB - 30 Days", price: "1000", data: "25GB" },
];

const BuyBundlesSheet = ({ open, onClose }: Props) => {
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedBundle = bundles.find((b) => b.id === selected);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 2000);
  };

  const handleClose = () => {
    setPhone(""); setSelected(null); setShowConfirm(false); setLoading(false); setSuccess(false);
    onClose();
  };

  const handleConfirmClose = () => {
    setShowConfirm(false); setSuccess(false);
    if (success) handleClose();
  };

  return (
    <>
      <TransactionSheet open={open && !showConfirm} onClose={handleClose} title="Buy Bundles">
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
            <input type="tel" placeholder="0712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Select Bundle</label>
            <div className="grid grid-cols-2 gap-3">
              {bundles.map((b) => (
                <button key={b.id} onClick={() => setSelected(b.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selected === b.id ? "bg-primary text-primary-foreground card-shadow-lg scale-[1.02]" : "bg-card border border-border text-foreground card-shadow"
                  }`}>
                  <p className="text-lg font-bold">{b.data}</p>
                  <p className={`text-xs ${selected === b.id ? "opacity-80" : "text-muted-foreground"}`}>{b.name}</p>
                  <p className="text-sm font-semibold mt-1">KES {b.price}</p>
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setShowConfirm(true)} disabled={!phone || !selected}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity">
            Continue
          </button>
        </div>
      </TransactionSheet>

      <ConfirmationSheet open={showConfirm} onClose={handleConfirmClose} onConfirm={handleConfirm}
        loading={loading} success={success} title="Confirm Bundle Purchase"
        details={[
          { label: "Phone", value: phone },
          { label: "Bundle", value: selectedBundle?.name || "" },
          { label: "Amount", value: `KES ${selectedBundle?.price || "0"}` },
        ]} />
    </>
  );
};

export default BuyBundlesSheet;
