import axios from "axios";

export async function checkOrderStatus(orderId: string) {
  try {
    const response = await fetch(
      `https://api.paycrest.io/v1/sender/orders/${orderId}`,
      {
        headers: {
          "API-Key": process.env.NEXT_PAYCREST_API_KEY!,
        },
        cache: "no-store",
      },
    );

    const order = await response.json();

    switch (order.status) {
      case "pending":
        console.log("Order is pending provider assignment");
        break;

      case "validated":
        console.log("Funds have been sent to recipient's bank/mobile network");
        await handleOrderValidated(order);
        break;

      case "settled":
        console.log("Order has been settled on blockchain");
        await handleOrderSettled(order);
        break;

      case "refunded":
        console.log("Order was refunded to sender");
        await handleOrderRefunded(order);
        break;

      case "expired":
        console.log("Order expired without completion");
        await handleOrderExpired(order);
        break;
    }

    return order;
  } catch (error) {
    console.error("Error checking order status:", error);
    throw error;
  }
}

export async function handleOrderValidated(order: any) {
  console.log("Processing validated order", order.id);
}

export async function handleOrderSettled(order: any) {
  console.log("Processing settled order", order.id);
}

export async function handleOrderRefunded(order: any) {
  console.log("Processing refunded order", order.id);
}

export async function handleOrderExpired(order: any) {
  console.log("Processing expired order", order.id);
}

export const getPaycrestSupportedInstitutionsByCurrency = async (
  currency: string,
) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_PAYCREST_BASE_URL}/institutions/${currency}`,
    );
    const data = await response.data;
    return data.data;
  } catch (error) {
    console.error("Error fetching supported institutions:", error);
    return [];
  }
};

export const getPaycrestSupportedCurrencies = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_PAYCREST_BASE_URL}/currencies`,
    );
    const data = await response.data;
    return data.data;
  } catch (error) {
    console.error("Error fetching supported currencies:", error);
    return [];
  }
};
