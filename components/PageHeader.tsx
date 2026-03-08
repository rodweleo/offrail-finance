"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 pb-2">
      <button
        onClick={() => router.back()}
        className="w-10 h-10 rounded-xl bg-card card-shadow flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
    </div>
  );
};

export default PageHeader;
