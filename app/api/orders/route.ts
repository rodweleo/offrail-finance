import { getPaycrestOrdersCollection } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 },
      );
    }

    const ordersCollection = getPaycrestOrdersCollection();
    const orders = await ordersCollection
      .find({ fromAddress: address }) // use the field name that matches your DB
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      {
        error: {
          message: "Failed to fetch orders",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
