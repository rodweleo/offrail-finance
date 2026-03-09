import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log(body);

    const signature = request.headers.get("X-Paycrest-Signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    if (
      !verifyPaycrestSignature(
        body,
        signature,
        process.env.NEXT_PAYCREST_API_SECRET!,
      )
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { event, data } = body;

    switch (event) {
      case "order.created":
        await handleOrderCreated(data);
        break;
      case "order.completed":
        await handleOrderCompleted(data);
        break;
      case "order.failed":
        await handleOrderFailed(data);
        break;
      default:
        console.log(`Unknown event: ${event}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

async function handleOrderCreated(data: any) {
  // TODO: Process order creation
  console.log("Order created:", data);
}

async function handleOrderCompleted(data: any) {
  // TODO: Process order completion
  console.log("Order completed:", data);
}

async function handleOrderFailed(data: any) {
  // TODO: Process order failure
  console.log("Order failed:", data);
}

function verifyPaycrestSignature(
  requestBody: any,
  signatureHeader: string,
  secretKey: string,
) {
  const calculatedSignature = calculateHmacSignature(requestBody, secretKey);
  return signatureHeader === calculatedSignature;
}

function calculateHmacSignature(data: any, secretKey: string) {
  const crypto = require("crypto");
  const key = Buffer.from(secretKey);
  const hash = crypto.createHmac("sha256", key);
  hash.update(data);
  return hash.digest("hex");
}
