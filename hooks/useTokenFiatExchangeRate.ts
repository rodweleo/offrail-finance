import { getExchangeRate } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export const useTokenFiatExchangeRate = ({ token, amount, fiatCurrency }) => {
  return useQuery({
    queryKey: ["tokenCurrencyExchangeRate"],
    queryFn: async () => {
      const rate = getExchangeRate(token, amount, fiatCurrency);
      return rate;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
