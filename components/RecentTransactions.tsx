"use client";

import { useUserPaycrestOrders } from "@/hooks/use-paycrest";
import { useAccount } from "wagmi";
import TransactionItem from "./TransactionItem";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionDetailSheet from "./TransactionDetailSheet";
import { useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RecentTransactions = () => {
  const { address } = useAccount();
  const { data: transactions, isLoading: isLoadingOrders } =
    useUserPaycrestOrders({
      address: address || "",
    });
  const [selectedTx, setSelectedTx] = useState(null);

  const recentTransactions =
    !isLoadingOrders && transactions ? transactions.slice(0, 4) : [];

  return (
    <>
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingOrders ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentTransactions.map((tx) => (
                <TransactionItem
                  key={tx._id}
                  transaction={tx}
                  onClick={() => setSelectedTx(tx)}
                />
              ))}
            </div>
          )}

          {!isLoadingOrders && recentTransactions.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ArrowRightLeft />
                </EmptyMedia>
                <EmptyTitle>No transactions</EmptyTitle>
                <EmptyDescription>
                  No Recent Transactions found. You can create one at any time.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>{/* <Button>Add data</Button> */}</EmptyContent>
            </Empty>
          )}
        </CardContent>
      </Card>
      <TransactionDetailSheet
        transaction={selectedTx}
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </>
  );
};
