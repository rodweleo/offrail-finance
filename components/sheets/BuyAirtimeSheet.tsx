import { useCallback, useRef, useState } from "react";
import TransactionSheet from "@/components/TransactionSheet";
import ConfirmationSheet from "@/components/ConfirmationSheet";
import { toast } from "sonner";
import { useWriteContract, useChainId } from "wagmi";
import { SUPPORTED_TOKENS, TESTNET_TOKENS } from "@/utils/tokens";
import { encodeFunctionData, parseUnits } from "viem";
import {
  LifecycleStatus,
  Transaction,
} from "@/components/TransactionComponent";
import { ERC20_ABI } from "@/utils/contracts";

interface Props {
  open: boolean;
  onClose: () => void;
}

const networks = [
  { id: "safaricom", name: "Safaricom" },
  { id: "airtel", name: "Airtel" },
];

const quickAmounts = ["20", "50", "100", "250", "500", "1000"];

const BuyAirtimeSheet = ({ open, onClose }: Props) => {
  const [network, setNetwork] = useState("safaricom");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const chainId = useChainId();
  const { writeContractAsync, isPending } = useWriteContract();
  const onSubmitRef = useRef<(() => void) | null>(null);
  const [calls, setCalls] = useState<any[]>([]);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/buy-airtime", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: phone,
          amount,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to process transaction. Please try again.");
        setLoading(false);
        setSuccess(false);
      }

      const body = await res.json();

      setCalls([
        {
          to: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [
              "0xb5ca45914679a5b1ab3098342bff25cf89aee7ae",
              parseUnits(
                (body.amount + body.senderFee + body.transactionFee).toString(),
                6,
              ),
            ],
          }),
        },
      ]);

      onSubmitRef.current?.();
      // setSuccess(true);
    } catch (e) {
      toast.error("Failed to process transaction. Please try again.");
      setLoading(false);
      setSuccess(false);
    } finally {
      // setLoading(false);
    }
  };

  const handleClose = () => {
    setNetwork("safaricom");
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

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log(status);
    if (status.statusName === "error") {
      console.log(JSON.parse(status.statusData.error));
      toast.error(JSON.parse(status.statusData.error).cause.shortMessage);
      setSuccess(false);
      setLoading(false);
    }
  }, []);

  return (
    <>
      <TransactionSheet
        open={open && !showConfirm}
        onClose={handleClose}
        title="Buy Airtime"
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Network
            </label>
            <div className="flex gap-3">
              {networks.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setNetwork(n.id)}
                  className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                    network === n.id
                      ? "bg-primary text-primary-foreground card-shadow"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  {n.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="0712 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Amount (KES)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0.00"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.]/g, ""))
              }
              className="w-full px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow text-2xl font-bold"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {quickAmounts.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!phone || !amount}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
          >
            Continue
          </button>

          {/* { to: Hex; data?: Hex; value?: bigint } */}
          <Transaction chainId={84532} calls={calls} onStatus={handleOnStatus}>
            {({ onSubmit }: { onSubmit: () => void }) => {
              // Capture onSubmit so we can call it programmatically
              onSubmitRef.current = onSubmit;
              return <></>; // renders nothing
            }}
          </Transaction>
        </div>
      </TransactionSheet>

      <ConfirmationSheet
        open={showConfirm}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        loading={loading}
        success={success}
        title="Confirm Airtime"
        details={[
          {
            label: "Network",
            value: network === "safaricom" ? "Safaricom" : "Airtel",
          },
          { label: "Phone", value: phone },
          { label: "Amount", value: `KES ${amount}` },
        ]}
      />
    </>
  );
};

export default BuyAirtimeSheet;
