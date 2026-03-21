"use client";

import { ReactNode, useCallback, createContext, useContext } from "react";
import { useChainId, useSendTransaction } from "wagmi";

export interface TransactionCall {
  to: `0x${string}`;
  data: `0x${string}`;
  value?: bigint;
}

export type LifecycleStatus = {
  statusName: "idle" | "transactionPending" | "success" | "error";
  statusData: any;
};

// Create context for passing handleSubmit to children
interface TransactionContextType {
  onSubmit: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransaction must be used within a Transaction component",
    );
  }
  return context;
};

interface TransactionProps {
  chainId: number;
  calls: TransactionCall[];
  onStatus: (status: LifecycleStatus) => void;
  children?: ReactNode | ((props: { onSubmit: () => void }) => ReactNode);
}

/**
 * Custom Transaction component to replace OnchainKit's Transaction
 * Handles sending contract calls via wagmi's sendTransaction
 */
export const Transaction = ({
  chainId,
  calls,
  onStatus,
  children,
}: TransactionProps) => {
  const { sendTransactionAsync } = useSendTransaction();

  const handleSubmit = useCallback(async () => {
    if (!calls || calls.length === 0) {
      onStatus({
        statusName: "error",
        statusData: { message: "No calls to execute", error: "{}" },
      });
      return;
    }

    try {
      // Set pending state immediately
      onStatus({
        statusName: "transactionPending",
        statusData: {},
      });

      // Execute each call and collect hashes
      const hashes: string[] = [];

      for (const call of calls) {
        try {
          const hash = await sendTransactionAsync({
            to: call.to,
            data: call.data,
            value: call.value || undefined,
            chainId: chainId as 1 | 84532 | 8453 | undefined,
          });
          hashes.push(hash);
        } catch (callError: any) {
          console.error("Error sending individual transaction:", callError);
          throw callError;
        }
      }

      // All transactions sent successfully
      onStatus({
        statusName: "success",
        statusData: {
          transactionHash: hashes[0],
          transactionHashes: hashes,
        },
      });
    } catch (error: any) {
      console.error("Transaction error:", error);

      const errorMessage = error?.message || "Transaction failed";
      const shortMessage =
        error?.shortMessage || error?.message || "Unknown error";

      onStatus({
        statusName: "error",
        statusData: {
          message: errorMessage,
          error: JSON.stringify({
            cause: {
              shortMessage: shortMessage,
            },
          }),
        },
      });
    }
  }, [calls, chainId, sendTransactionAsync, onStatus]);

  return (
    <TransactionContext.Provider value={{ onSubmit: handleSubmit }}>
      <div data-transaction-component>
        {typeof children === "function"
          ? (children as (props: { onSubmit: () => void }) => ReactNode)({
              onSubmit: handleSubmit,
            })
          : children}
      </div>
    </TransactionContext.Provider>
  );
};

interface TransactionButtonProps {
  className?: string;
  disabled?: boolean;
  render?: (props: { onSubmit: () => void }) => ReactNode;
  children?: ReactNode;
}

export const TransactionButton = ({
  className = "",
  disabled = false,
  render,
  children,
}: TransactionButtonProps) => {
  const { onSubmit } = useTransaction();

  if (render) {
    return render({ onSubmit });
  }
  return children;
};

export type { LifecycleStatus as TransactionLifecycleStatus };
