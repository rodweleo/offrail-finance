import { useReadContract, useChainId } from "wagmi";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";

const IS_TESTNET = process.env.NEXT_PUBLIC_ENV === "testnet";

// Token addresses per chain
const TOKEN_ADDRESSES: Record<number, { USDC?: string; USDT?: string }> = {
  // Mainnet
  8453: {
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    USDT: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  }, // Base
  42161: {
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  }, // Arbitrum
  137: {
    USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  }, // Polygon
  1: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  }, // Ethereum

  // Testnet
  84532: { USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" }, // Base Sepolia
  421614: { USDC: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" }, // Arbitrum Sepolia
};

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export function useTokenBalance(symbol: "USDC" | "USDT" = "USDC") {
  const { address } = useAccount();
  const chainId = useChainId();

  const tokenAddress = TOKEN_ADDRESSES[chainId]?.[symbol] as
    | `0x${string}`
    | undefined;

  const { data, isLoading, isError } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address && !!tokenAddress },
  });

  const balance = data ? parseFloat(formatUnits(data, 6)) : 0;
  const isSupported = !!TOKEN_ADDRESSES[chainId];
  const isTestnet = IS_TESTNET;

  return { balance, isLoading, isError, isSupported, isTestnet, tokenAddress };
}
