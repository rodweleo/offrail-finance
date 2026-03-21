"use client";

import { ReactNode, useCallback } from "react";
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
    if (calls.length === 0) {
      onStatus({
        statusName: "error",
        statusData: { message: "No calls to execute", error: "{}" },
      });
      return;
    }

    try {
      onStatus({
        statusName: "transactionPending",
        statusData: {},
      });

      // Execute the first call (typically for simple transfers)
      const call = calls[0];

      const hash = await sendTransactionAsync({
        to: call.to,
        data: call.data,
        value: call.value,
        chainId: chainId as 1 | 84532 | 8453 | undefined,
      });

      onStatus({
        statusName: "success",
        statusData: { hash },
      });
    } catch (error: any) {
      onStatus({
        statusName: "error",
        statusData: {
          message: error.message || "Transaction failed",
          error: JSON.stringify({
            cause: {
              shortMessage: error.message || "Unknown error",
            },
          }),
        },
      });
    }
  }, [calls, chainId, sendTransactionAsync, onStatus]);

  // Expose the submit function to children
  const contextValue = {
    onSubmit: handleSubmit,
  };

  return (
    <div data-transaction-component>
      {typeof children === "function"
        ? (children as (props: { onSubmit: () => void }) => ReactNode)(
            contextValue,
          )
        : children}
    </div>
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
  // This component is used as a render-prop pattern connector
  // The actual submit handler is captured by Transaction component
  // through the ref in SendMoneySheet
  if (render) {
    return render({ onSubmit: () => {} });
  }
  return children;
};

export type { LifecycleStatus as TransactionLifecycleStatus };
