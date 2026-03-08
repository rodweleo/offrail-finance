import axios from "axios";

export function shortenAddress(address: string) {
  return (
    address?.slice(0, 8) +
    "..." +
    address?.slice(address.length - 8, address.length)
  );
}

export async function getExchangeRate(
  token: string,
  amount: number,
  localFiat: string,
) {
  const response = await axios.get(
    `https://api.paycrest.io/v1/rates/${token.toLocaleLowerCase()}/${amount}/${localFiat.toLowerCase()}`,
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch exchange rate", response.data);
  }

  return Number(response.data.data);
}
