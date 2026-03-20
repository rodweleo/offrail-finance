"use client";

import { Home, Clock, QrCode, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const tabs = [
  { icon: Home, label: "Home", path: "/app" },
  { icon: Clock, label: "History", path: "/app/history" },
  { icon: User, label: "Profile", path: "/app/profile" },
];

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected, isConnecting } = useAccount();

  useEffect(() => {
    if (!isConnecting && !isConnected && !address) {
      router.push("/");
    }
  }, [address, isConnected, isConnecting]);
  return (
    <div
      className={`sticky bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-40 `}
    >
      <div className="flex items-center justify-around max-w-md mx-auto py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 rounded-full bg-primary" />
              )}
              <tab.icon
                className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
