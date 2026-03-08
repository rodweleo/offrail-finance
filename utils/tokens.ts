export const SUPPORTED_TOKENS = [
  {
    symbol: "USDC",
    contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    network: "base",
    chainId: 8453,
  },
  {
    symbol: "USDT",
    contractAddress: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    decimals: 6,
    network: "base",
    chainId: 8453,
  },
  {
    symbol: "USDC",
    contractAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    decimals: 6,
    network: "arbitrum-one",
    chainId: 42161,
  },
  {
    symbol: "USDT",
    contractAddress: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    decimals: 6,
    network: "arbitrum-one",
    chainId: 42161,
  },
  {
    symbol: "USDC",
    contractAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    decimals: 6,
    network: "polygon",
    chainId: 137,
  },
  {
    symbol: "USDT",
    contractAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    decimals: 6,
    network: "polygon",
    chainId: 137,
  },
  {
    symbol: "USDC",
    contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    network: "ethereum",
    chainId: 1,
  },
  {
    symbol: "USDT",
    contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    network: "ethereum",
    chainId: 1,
  },
] as const;

export const TESTNET_TOKENS = [
  {
    symbol: "USDC",
    contractAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    decimals: 6,
    network: "base-sepolia",
    chainId: 84532,
  },
  {
    symbol: "USDT",
    contractAddress: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
    decimals: 6,
    network: "arbitrum-sepolia",
    chainId: 421614,
  },
];
