import {
  http,
  cookieStorage,
  createConfig,
  createStorage,
  injected,
} from "wagmi";
import { base, baseSepolia, mainnet } from "viem/chains";
import { baseAccount, coinbaseWallet, metaMask } from "wagmi/connectors";
import { Attribution } from "ox/erc8021";

const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [process.env.NEXT_BUILDER_CODE!],
});

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
      injected(),
      baseAccount({
        appName: "Offrail Finance",
      }),
      coinbaseWallet({
        appName: "Offrail Finance",
        preference: "smartWalletOnly",
        version: "4",
      }),
      metaMask(),
    ],
    dataSuffix: DATA_SUFFIX,
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
