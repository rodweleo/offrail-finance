"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import TransactionItem, { Transaction } from "@/components/TransactionItem";
import TransactionDetailSheet from "@/components/TransactionDetailSheet";
import { useUserPaycrestOrders } from "@/hooks/use-paycrest";
import { useAccount } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";

const filters = [
  { key: "all", label: "All" },
  { key: "send", label: "Sent" },
  { key: "receive", label: "Received" },
  { key: "paybill", label: "Bills" },
  { key: "airtime", label: "Airtime" },
  { key: "deposit", label: "Deposits" },
  { key: "withdraw", label: "Withdrawals" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

const History = () => {
  const { address } = useAccount();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useUserPaycrestOrders({ address: address || "" });

  // Flatten all pages
  const allTransactions = data?.pages.flatMap((page) => page.orders) ?? [];

  // Filter client-side across all loaded pages
  const filtered = allTransactions.filter((tx) => {
    const matchesFilter = activeFilter === "all" || tx.type === activeFilter;
    const matchesSearch =
      !search || tx.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-2">
        <PageHeader title="History" />
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring card-shadow"
          />
        </div>

        {/* Filter chips */}
        {/* <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border hover:bg-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div> */}

        {/* List */}
        <div className="rounded-2xl ">
          {isLoading ? (
            // Initial load skeletons
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No transactions found
            </p>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((tx) => (
                <TransactionItem
                  key={tx._id}
                  transaction={tx}
                  onClick={() => setSelectedTx(tx)}
                />
              ))}

              {/* Sentinel */}
              <div ref={sentinelRef} className="h-1" />

              {/* Next page skeletons */}
              {isFetchingNextPage && (
                <div className="space-y-3 pt-3">
                  {Array.from({ length: 3 }).map((_, i) => (
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
              )}

              {/* End of list */}
              {!hasNextPage && (
                <p className="text-center text-xs text-muted-foreground py-4">
                  All transactions loaded
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <TransactionDetailSheet
        transaction={selectedTx}
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};

export default History;
