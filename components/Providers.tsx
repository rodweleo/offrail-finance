"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";
import { ReactNode } from "react";
import { UserProvider } from "@/contexts/UserContext";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getConfig } from "@/wagmi/config";
import { ThemeProvider } from "next-themes";

export const queryClient = new QueryClient();

export const config = getConfig();

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            <OnchainKitProvider
              apiKey={process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY}
              projectId={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
              chain={base}
              miniKit={{
                enabled: true,
              }}
              config={{
                appearance: {
                  mode: "auto", // 'light' | 'dark' | 'auto'
                  name: "Offrail Finance",
                },
                wallet: {
                  display: "modal", // 'modal' | 'drawer'
                  preference: "all", // 'all' | 'smartWalletOnly' | 'eoaOnly'
                },
                paymaster:
                  process.env.NODE_ENV === "development"
                    ? process.env.NEXT_TESTNET_PAYMASTER_URL
                    : process.env.NEXT_MAINNET_PAYMASTER_URL,
              }}
            >
              {children}
            </OnchainKitProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </UserProvider>
  );
};
