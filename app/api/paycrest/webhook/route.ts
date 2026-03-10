import { getPaycrestOrdersCollection } from "@/utils/mongodb";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    console.log(body);

    const signature = request.headers.get("X-Paycrest-Signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // if (
    //   !verifyPaycrestSignature(
    //     rawBody,
    //     signature,
    //     process.env.NEXT_PAYCREST_API_SECRET!,
    //   )
    // ) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const { event, data } = body;

    switch (event) {
      case "payment_order.pending":
        await handleOrderPending(data);
        break;
      case "payment_order.validated":
        await handleOrderValidated(data);
        break;
      case "payment_order.settled":
        await handleOrderSettled(data);
        break;
      case "payment_order.expired":
        await handleOrderExpired(data);
        break;
      default:
        console.log(`Unknown event: ${event}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

async function handleOrderPending(data: any) {
  const ordersCollection = getPaycrestOrdersCollection();
  await ordersCollection.updateOne(
    { reference: data.reference },
    {
      $set: {
        status: "pending",
        percentSettled: data.percentSettled,
        amountPaid: data.amountPaid,
        gatewayId: data.gatewayId,
        senderId: data.senderId,
        txHash: data.txHash,
        updatedAt: new Date(),
      },
    },
  );
  console.log("Order pending:", data.reference);
}

async function handleOrderValidated(data: any) {
  const ordersCollection = getPaycrestOrdersCollection();
  await ordersCollection.updateOne(
    { reference: data.reference },
    {
      $set: {
        status: "validated",
        percentSettled: data.percentSettled,
        amountPaid: data.amountPaid,
        gatewayId: data.gatewayId,
        senderId: data.senderId,
        txHash: data.txHash,
        updatedAt: new Date(),
      },
    },
  );
  console.log("Order validated:", data.reference);
}

async function handleOrderSettled(data: any) {
  const ordersCollection = getPaycrestOrdersCollection();
  await ordersCollection.updateOne(
    { reference: data.reference },
    {
      $set: {
        status: "settled",
        percentSettled: data.percentSettled,
        amountPaid: data.amountPaid,
        gatewayId: data.gatewayId,
        senderId: data.senderId,
        txHash: data.txHash,
        updatedAt: new Date(),
      },
    },
  );
  console.log("Order settled:", data.reference);
}

async function handleOrderExpired(data: any) {
  const ordersCollection = getPaycrestOrdersCollection();
  await ordersCollection.updateOne(
    { reference: data.reference },
    { $set: { status: "expired", updatedAt: new Date() } },
  );
  console.log("Order expired:", data.reference);
}

function verifyPaycrestSignature(
  rawBody: string,
  signatureHeader: string,
  secretKey: string,
): boolean {
  const calculatedSignature = calculateHmacSignature(rawBody, secretKey);
  return signatureHeader === calculatedSignature;
}

function calculateHmacSignature(data: string, secretKey: string): string {
  const key = Buffer.from(secretKey);
  const hash = crypto.createHmac("sha256", key);
  hash.update(data);
  return hash.digest("hex");
}
