import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  polygon,
} from "viem/chains";
import { coinbaseWallet, metaMask } from "wagmi/connectors";

const IS_TESTNET = process.env.NEXT_PUBLIC_ENV === "development";

const chains:
  | [typeof baseSepolia, typeof arbitrumSepolia]
  | [typeof base, typeof arbitrum, typeof polygon, typeof mainnet] = IS_TESTNET
  ? [baseSepolia, arbitrumSepolia]
  : [base, arbitrum, polygon, mainnet];

const transports: Record<number, any> = IS_TESTNET
  ? {
      [baseSepolia.id]: http(),
      [arbitrumSepolia.id]: http(),
    }
  : {
      [base.id]: http(),
      [arbitrum.id]: http(),
      [polygon.id]: http(),
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
