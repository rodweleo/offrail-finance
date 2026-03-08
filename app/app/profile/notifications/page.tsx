"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const notificationSettings = [
  {
    id: "transactions",
    label: "Transaction Alerts",
    description: "Get notified for every send, receive & payment",
  },
  {
    id: "promotions",
    label: "Promotions",
    description: "Offers, discounts and feature updates",
  },
  {
    id: "security",
    label: "Security Alerts",
    description: "Login attempts and suspicious activity",
  },
  {
    id: "reminders",
    label: "Payment Reminders",
    description: "Upcoming bills and scheduled payments",
  },
];

const Notifications = () => {
  const router = useRouter();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    transactions: true,
    security: true,
    promotions: false,
    reminders: true,
  });

  const toggle = (id: string) =>
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card">
          <button
            onClick={() => router.push("/profile")}
            className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Notifications</h1>
        </div>

        <div className="px-4 pt-4">
          <div className="bg-card rounded-2xl card-shadow overflow-hidden">
            {notificationSettings.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0"
              >
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Switch
                  checked={enabled[item.id]}
                  onCheckedChange={() => toggle(item.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
