import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTokenExchangeRate = (amount: number) => {
  return useQuery({
    queryKey: ["tokenExchangeRate"],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.paycrest.io/v1/rates/usdc/${amount}/kes`,
      );

      return amount * Number(response.data.data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
