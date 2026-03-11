import { getPaycrestOrdersCollection } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { reference: string } },
) {
  try {
    const { reference } = params;

    if (!reference) {
      return NextResponse.json(
        { error: "Missing order reference" },
        { status: 400 },
      );
    }

    const ordersCollection = getPaycrestOrdersCollection();
    const result = await ordersCollection.updateOne(
      { reference },
      { $set: { status: "cancelled", updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to cancel order:", error);
    return NextResponse.json(
      {
        error: {
          message: "Failed to cancel order",
          details: String(error),
        },
      },
      { status: 500 },
    );
  }
}
