import { getExchangeRate } from "@/utils";
import { getPaycrestOrdersCollection } from "@/utils/mongodb";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { v4 as UUID } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      returnAddress,
      amount,
      token,
      receipient,
      currency = "KES",
      network = "base",
    } = body;

    // Validate inputs
    if (!receipient || !currency) {
      return NextResponse.json(
        { error: "Recipient and currency are required" },
        { status: 400 },
      );
    }

    const rate = await getExchangeRate(token, amount, currency);

    const reference = UUID();
    const options = {
      amount,
      token: token,
      network,
      recipient: receipient,
      returnAddress,
      rate,
      reference,
    };

    console.log(JSON.stringify(options, null, 2));

    const paycrestResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_PAYCREST_BASE_URL}/sender/orders`,
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

    // store the details in the database for later retrieval and processing
    const ordersCollection = getPaycrestOrdersCollection();
    await ordersCollection.insertOne({
      reference,
      returnAddress,
      amountInToken: amount,
      amountInFiat: (rate * amount).toFixed(2),
      token,
      network,
      receipientInstitution: receipient.institution,
      receipientAccountNumber: receipient.accountIdentifier,
      receipientMemo: receipient.memo || null,
      receipientAccountName: receipient.accountName || null,
      receiverAddress: order.receiverAddress,
      validUntil: new Date(order.validUntil),
      senderFee: order.senderFee,
      transactionFee: order.transactionFee,
      currency,
      rate,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Return the receive address for the user to send USDC to
    return NextResponse.json(
      { ...order },
      {
        status: 201,
        statusText: "Order created successfully!",
      },
    );
  } catch (error) {
    console.error("Order creation error:", error.response.data);
    return NextResponse.json(
      { error: error.response.data ? error.response.data : error },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const orders = getPaycrestOrdersCollection();
    const allOrders = await orders.find({}).toArray();
    return NextResponse.json({ allOrders }, { status: 200 });
  } catch (e) {
    console.error("Error fetching orders:", e);
    return NextResponse.json(
      {
        error: {
          message: "Failed to fetch orders",
          details: e instanceof Error ? e.message : String(e),
        },
      },
      { status: 500 },
    );
  }
}
