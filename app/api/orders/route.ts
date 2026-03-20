import { getPaycrestOrdersCollection } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");
    const cursor = req.nextUrl.searchParams.get("cursor"); // last document's _id
    const limit = 5; // items per page

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 },
      );
    }

    const ordersCollection = getPaycrestOrdersCollection();

    const query: Record<string, unknown> = { fromAddress: address };

    // Cursor-based pagination — more reliable than page numbers
    if (cursor) {
      query["_id"] = { $lt: new ObjectId(cursor) };
    }

    const orders = await ordersCollection
      .find(query, {
        projection: {
          _id: 1,
          reference: 1,
          type: 1,
          receipientMemo: 1,
          amount: 1,
          currency: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          token: 1,
          amountInToken: 1,
          description: 1,
          txHash: 1,
        },
      })
      .sort({ _id: -1 }) // _id is naturally sorted by createdAt
      .limit(limit + 1) // fetch one extra to know if there's a next page
      .toArray();

    const hasMore = orders.length > limit;
    const data = hasMore ? orders.slice(0, limit) : orders;
    const nextCursor = hasMore ? data[data.length - 1]._id.toString() : null;

    return NextResponse.json(
      { orders: data, nextCursor, hasMore },
      { status: 200 },
    );
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
