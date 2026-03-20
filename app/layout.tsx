import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/Providers";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Offrail Finance",
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
    title: "Offrail Finance",
    description:
      "Offrail Finance enables individuals and businesses to instantly convert cryptocurrency into local currency and supports sending bulk payouts directly to bank accounts or mobile money.",
    type: "website",
    url: "https://offrail-finance.vercel.app",
    siteName: "Offrail Finance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Offrail Finance",
    description:
      "Offrail Finance enables individuals and businesses to instantly convert cryptocurrency into local currency and supports sending bulk payouts directly to bank accounts or mobile money.",
  },
  other: {
    "base:app_id": process.env.NEXT_PUBLIC_BASE_APP_ID!,
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: "https://offrail-finance.vercel.app/icon.png",
      button: {
        title: `Launch Offrail Finance`,
        action: {
          type: "launch_miniapp",
          name: "Offrail Finance",
          url: "https://offrail-finance.vercel.app",
          splashImageUrl: "https://offrail-finance.vercel.app/splash.png",
          splashBackgroundColor: "#000000",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
