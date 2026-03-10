import { getPaycrestOrdersCollection } from "@/utils/mongodb";
import {
  getPaycrestSupportedCurrencies,
  getPaycrestSupportedInstitutionsByCurrency,
} from "@/utils/paycrest";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePaycrestSupportedInstitutionsByCurrency = (
  currency: string,
) => {
  return useQuery({
    queryKey: ["paycrestSupportedInstitutionsByCurrency", currency],
    queryFn: async () => {
      if (!currency) return [];

      try {
        const response =
          await getPaycrestSupportedInstitutionsByCurrency(currency);
        return response;
      } catch (error) {
        // console.error("Error fetching supported institutions:", error);
        return [];
      }
    },
    refetchInterval: 60000,
    staleTime: 60000,
  });
};

export const usePaycrestSupportedCurrencies = () => {
  return useQuery({
    queryKey: ["paycrestSupportedCurrencies"],
    queryFn: async () => {
      try {
        const response = await getPaycrestSupportedCurrencies();
        return response;
      } catch (error) {
        console.error("Error fetching supported currencies:", error);
        return [];
      }
    },
    refetchInterval: 60000,
    staleTime: 60000,
  });
};

export const usePaycrestExchangeRate = ({
  token,
  currency,
}: {
  token: string;
  currency: string;
}) => {
  return useQuery({
    queryKey: ["paycrestExchangeRate"],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.paycrest.io/v1/rates/${token}/1/${currency}`,
      );

      return Number(response.data.data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUserPaycrestOrders = ({ address }: { address: string }) => {
  return useQuery({
    queryKey: ["paycrestOrders", address],
    queryFn: async () => {
      if (!address) return [];

      try {
        const res = await axios.get(`/api/orders`, {
          params: { address },
        });

        return res.data.orders;
      } catch (e) {
        // console.error("Error fetching user orders:", e);
        return [];
      }
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000,
  });
};
