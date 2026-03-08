import { getExchangeRate } from "@/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, amount, currency = "KES", network = "base" } = body;

    // Validate inputs
    if (!phoneNumber || !amount) {
      return NextResponse.json(
        { error: "phoneNumber and amount are required" },
        { status: 400 },
      );
    }

    const rate = await getExchangeRate("USDC", amount, currency);
    // get the amount of USDC to send based on the exchange rate
    const usdcAmount = (parseFloat(amount) / parseFloat(String(rate))).toFixed(
      6,
    );

    const options = {
      amount: usdcAmount,
      token: "USDC",
      network,
      recipient: {
        institution: "SAFAKEPC",
        accountIdentifier: phoneNumber,
        accountName: phoneNumber, // optional, Paycrest resolves it
        memo: "Buying airtime via Payrail",
      },
      returnAddress: process.env.PAYCREST_RETURN_ADDRESS,
      fiatCurrency: currency,
      rate,
    };

    const paycrestResponse = await axios.post(
      `${process.env.NEXT_PAYCREST_BASE_URL}/sender/orders`,
      options,
      {
        headers: {
          "Content-Type": "application/json",
          "API-Key": process.env.NEXT_PAYCREST_API_KEY,
        },
      },
    );

    if (paycrestResponse.status !== 201) {
      const error = await paycrestResponse.data;
      return NextResponse.json(
        { error: error.message || "Paycrest order failed" },
        { status: paycrestResponse.status },
      );
    }

    const order = await paycrestResponse.data.data;

    // Return the receive address for the user to send USDC to
    return NextResponse.json(
      { ...order },
      {
        status: 201,
        statusText: "Order created successfully!",
      },
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.response.data ? error.response.data : error },
      { status: 500 },
    );
  }
}
