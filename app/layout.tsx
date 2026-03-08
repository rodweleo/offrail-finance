import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/Providers";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import "@coinbase/onchainkit/styles.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Offrail Finance | Crypto Off-Ramp & Bulk Payouts",
  description:
    "Offrail Finance enables individuals and businesses to instantly convert cryptocurrency into local currency and supports sending bulk payouts directly to bank accounts or mobile money.",
  keywords: [
    "crypto off ramp",
    "crypto to cash",
    "crypto withdrawal",
    "bulk crypto payouts",
    "crypto to bank",
    "crypto to mpesa",
    "crypto payout infrastructure",
    "Offrail Finance",
  ],

  openGraph: {
    title: "Offrail Finance | Crypto → Cash",
    description:
      "Offrail Finance enables individuals and businesses to instantly convert cryptocurrency into local currency and supports sending bulk payouts directly to bank accounts or mobile money.",
    type: "website",
    url: "https://offrail-finance.vercel.app",
    siteName: "Offrail Finance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Offrail Finance | Crypto to Cash",
    description:
      "Offrail Finance enables individuals and businesses to instantly convert cryptocurrency into local currency and supports sending bulk payouts directly to bank accounts or mobile money.",
  },
  other: {
    "base:app_id": process.env.NEXT_PUBLIC_BASE_APP_ID!,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` font-sans antialiased`}>
        <Providers>
          <SafeArea>
            {children}
            <Toaster />
          </SafeArea>
        </Providers>
      </body>
    </html>
  );
}
