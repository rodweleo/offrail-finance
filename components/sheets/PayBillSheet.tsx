import { useState } from "react";
import TransactionSheet from "@/components/TransactionSheet";
import ConfirmationSheet from "@/components/ConfirmationSheet";

interface Props { open: boolean; onClose: () => void; }

const PayBillSheet = ({ open, onClose }: Props) => {
  const [paybill, setPaybill] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 2000);
  };

  const handleClose = () => {
    setPaybill(""); setAccount(""); setAmount(""); setShowConfirm(false); setLoading(false); setSuccess(false);
    onClose();
  };

  const handleConfirmClose = () => {
    setShowConfirm(false); setSuccess(false);
    if (success) handleClose();
  };

  return (
    <>
      <TransactionSheet open={open && !showConfirm} onClose={handleClose} title="Pay Bill">
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Paybill Number</label>
            <input type="text" inputMode="numeric" placeholder="e.g. 888880" value={paybill} onChange={(e) => setPaybill(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Account Number</label>
            <input type="text" placeholder="Account number" value={account} onChange={(e) => setAccount(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Amount (KES)</label>
            <input type="text" inputMode="numeric" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow text-2xl font-bold" />
          </div>
          <button onClick={() => setShowConfirm(true)} disabled={!paybill || !account || !amount}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity">
            Continue
          </button>
        </div>
      </TransactionSheet>

      <ConfirmationSheet open={showConfirm} onClose={handleConfirmClose} onConfirm={handleConfirm}
        loading={loading} success={success} title="Confirm Payment"
        details={[
          { label: "Paybill", value: paybill },
          { label: "Account", value: account },
          { label: "Amount", value: `KES ${amount}` },
        ]} />
    </>
  );
};

export default PayBillSheet;
