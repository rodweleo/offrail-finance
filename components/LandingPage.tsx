"use client";

import { useState } from "react";
import {
  Wallet,
  Shield,
  Zap,
  ArrowRight,
  Globe,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";

interface LandingProps {
  onEnter: () => void;
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
        <div className="pt-12 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Offrail Finance
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="space-y-5 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              Powered by Base Network
            </div>
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
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { icon: Zap, label: "Instant", sub: "Transfers" },
              { icon: Shield, label: "Secure", sub: "On-chain" },
              { icon: Smartphone, label: "Fiat", sub: "On & Off ramp" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card card-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="pb-10 space-y-3">
          <ConnectWallet />
          <p className="text-center text-[11px] text-muted-foreground pt-1">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
