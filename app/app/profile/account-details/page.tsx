"use client";

import { ArrowLeft, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { shortenAddress } from "@/utils";
import { toast } from "sonner";

const AccountDetails = () => {
  const router = useRouter();
  const { address } = useAccount();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const details = [
    { label: "Full Name", value: "Guest" },
    // { label: "Phone Number", value: profile.phone },
    {
      label: "Wallet Address",
      value: shortenAddress(address!),
      copyable: true,
      fullValue: address,
    },
    // { label: "Network", value: profile.network },
    {
      label: "Member Since",
      value: new Date().toLocaleDateString(undefined, {}),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Account Details</h1>
        </div>

        <div className="px-4 pt-4 space-y-3">
          <div className="bg-card rounded-2xl card-shadow overflow-hidden">
            {details.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0"
              >
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {item.value}
                  </span>
                  {item.copyable && (
                    <button
                      onClick={() =>
                        copyToClipboard(item.fullValue!, item.label)
                      }
                      className="p-1 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
