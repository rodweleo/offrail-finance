import { checkOrderStatus } from "@/utils/paycrest";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const orderDtls = await checkOrderStatus(id);

    if (!orderDtls) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        ...orderDtls,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Transaction lookup error:", error);

    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 },
    );
  }
}
