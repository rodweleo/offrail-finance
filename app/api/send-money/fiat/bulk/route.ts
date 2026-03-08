import { NextRequest, NextResponse } from "next/server";

interface BulkTransaction {
  receipientNumber: string;
  amount: string;
  currency?: string;
}

interface BulkTransactionRequest {
  transactions: BulkTransaction[];
}

export async function POST(request: NextRequest) {
  try {
    const body: BulkTransactionRequest = await request.json();

    if (!body.transactions || !Array.isArray(body.transactions)) {
      return NextResponse.json(
        { error: "Invalid request: transactions array is required" },
        { status: 400 },
      );
    }

    // Send bulk transactions to Paycrest API
    // const response = await fetch(
    //   "https://api.paycrest.io/v1/transactions/bulk",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${process.env.PAYCREST_API_KEY}`,
    //     },
    //     body: JSON.stringify({
    //       transactions: body.transactions,
    //     }),
    //   },
    // );

    // if (!response.ok) {
    //   throw new Error(`Paycrest API error: ${response.statusText}`);
    // }

    const result = [] as any[];

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("Bulk transaction error:", error);
    return NextResponse.json(
      { error: "Failed to process bulk transactions" },
      { status: 500 },
    );
  }
}
