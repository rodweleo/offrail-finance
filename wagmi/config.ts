import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { base, baseSepolia, mainnet } from "viem/chains";
import { coinbaseWallet, metaMask } from "wagmi/connectors";

const IS_TESTNET = process.env.NODE_ENV === "development";

const chains: [typeof baseSepolia] | [typeof base, typeof mainnet] = IS_TESTNET
  ? [baseSepolia]
  : [base, mainnet];

const transports: Record<number, any> = IS_TESTNET
  ? {
      [baseSepolia.id]: http(),
    }
  : {
      [base.id]: http(),
      [mainnet.id]: http(),
    };

export function getConfig() {
  return createConfig({
    chains: chains,
    connectors: [
      coinbaseWallet({
        appName: "Offrail Finance",
        preference: "smartWalletOnly",
        version: "4",
      }),
      metaMask(),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports,
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
