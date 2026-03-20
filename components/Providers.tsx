"use client";

import { base } from "wagmi/chains";
import { ReactNode } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getConfig } from "@/wagmi/config";
import { ThemeProvider } from "next-themes";

export const queryClient = new QueryClient();

export const config = getConfig();

export const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
