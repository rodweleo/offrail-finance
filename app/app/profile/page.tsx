"use client";

import {
  User,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import PageHeader from "@/components/PageHeader";
import { WalletDropdownDisconnect, Wallet } from "@/components/WalletConnect";
import { useAccount, useDisconnect } from "wagmi";
import { shortenAddress } from "@/utils";
import { Button } from "@/components/ui/button";
const menuItems = [
  {
    icon: User,
    label: "Account Details",
    path: "/app/profile/account-details",
  },
  { icon: Shield, label: "Security & PIN", path: "/app/profile/security" },
  { icon: Bell, label: "Notifications", path: "/app/profile/notifications" },
  {
    icon: HelpCircle,
    label: "Help & Support",
    path: "/app/profile/help-support",
  },
];

const Profile = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { disconnect } = useDisconnect();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-4">
        <PageHeader title="Profile" />
        <div className="bg-card rounded-2xl p-5 card-shadow flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">
              {"Guest".charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground">Guest</h3>
            <p className="text-sm text-muted-foreground">
              {" "}
              {shortenAddress(address!)}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl card-shadow overflow-hidden mb-3">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.path)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-secondary/50 transition-colors border-b border-border last:border-0 cursor-pointer"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-foreground text-left">
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Dark mode toggle */}
        <div className="bg-card rounded-2xl card-shadow overflow-hidden mb-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-secondary/50 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="flex-1 text-sm font-medium text-foreground text-left">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {isConnected && (
          <Button
            onClick={() => disconnect()}
            variant="destructive"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl cursor-pointer font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        )}
      </div>
    </div>
  );
};

export default Profile;
