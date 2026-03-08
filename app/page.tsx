"use client";

import LandingPage from "@/components/LandingPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Page() {
  const { address, isConnecting, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnecting && address && isConnected) {
      router.push("/app");
    }
  }, [isConnecting, address, isConnected]);
  return <LandingPage />;
}
