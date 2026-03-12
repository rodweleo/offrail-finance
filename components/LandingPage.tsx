"use client";

import { Shield, Zap, ArrowRight, Globe, Smartphone } from "lucide-react";
import {
  ConnectWallet,
  Wallet,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { toast } from "sonner";

interface LandingProps {
  onEnter?: () => void;
}

const Landing = ({ onEnter }: LandingProps) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto px-6">
        {/* Header */}
        <header className="pt-12 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-bold text-foreground tracking-tight">
              Offrail Finance
            </span>
          </div>
          <Image
            src="/icon.png"
            alt="Offrail Finance Logo"
            width={46}
            height={46}
            className="rounded-md"
          />
        </header>

        {/* Hero */}
        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="space-y-5 mb-10">
            <Badge className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20">
              <Globe className="w-3.5 h-3.5" />
              Powered by Base Network
            </Badge>

            <h1 className="text-4xl font-extrabold text-foreground leading-[1.1] tracking-tight">
              Your money,
              <br />
              <span className="text-primary">borderless.</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-[300px]">
              Send, receive and pay bills instantly with USDC stablecoins — no
              bank needed.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-6">
            {[
              { icon: Zap, label: "Instant", sub: "Transfers" },
              { icon: Shield, label: "Secure", sub: "On-chain" },
              {
                icon: Smartphone,
                label: "Fiat Currency",
                sub: "On & Off ramp",
              },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="">
                  <p className="text-sm font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="pb-10 space-y-3">
          <ConnectWallet
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disconnectedLabel="Sign In"
            onConnect={() => {
              toast.success("Welcome to Offrail Finance");
            }}
          />
          <p className="text-center text-[11px] text-muted-foreground pt-1">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
