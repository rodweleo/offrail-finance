"use client";

import { ArrowLeft, Fingerprint, Lock, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const SecurityPin = () => {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const securityOptions = [
    {
      icon: Lock,
      title: "Change PIN",
      description: "Update your 4-digit transaction PIN",
      action: () =>
        toast({
          title: "Change PIN",
          description: "PIN change flow coming soon",
        }),
    },
    {
      icon: Fingerprint,
      title: "Biometric Authentication",
      description: biometricEnabled
        ? "Enabled — using device biometrics"
        : "Disabled",
      toggle: true,
    },
    {
      icon: Smartphone,
      title: "Trusted Devices",
      description: "1 device registered",
      action: () =>
        toast({
          title: "Trusted Devices",
          description: "Device management coming soon",
        }),
    },
  ];

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
          <h1 className="text-lg font-bold text-foreground">Security & PIN</h1>
        </div>

        <div className="px-4 pt-4 space-y-3">
          <div className="bg-card rounded-2xl card-shadow overflow-hidden">
            {securityOptions.map((item, i) => (
              <button
                key={i}
                onClick={
                  item.toggle
                    ? () => {
                        setBiometricEnabled(!biometricEnabled);
                        toast({
                          title: biometricEnabled
                            ? "Biometrics Disabled"
                            : "Biometrics Enabled",
                        });
                      }
                    : item.action
                }
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-secondary/50 transition-colors border-b border-border last:border-0"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {item.toggle && (
                  <Switch
                    checked={biometricEnabled}
                    onCheckedChange={() => {}}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPin;
