"use client";

import {
  ArrowLeft,
  MessageCircle,
  FileText,
  Mail,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const faqs = [
  {
    q: "How do I send money?",
    a: "Tap 'Send Money' on the home screen, enter the phone number and amount, then slide to confirm.",
  },
  {
    q: "What are the fees?",
    a: "Pei charges minimal fees on transactions. Exact fees are shown before you confirm each transaction.",
  },
  {
    q: "How do I deposit USDC?",
    a: "Go to the Deposit page and send USDC to your Base wallet address.",
  },
  {
    q: "Is my money safe?",
    a: "Your funds are secured on the Base network using USDC, a fully-backed stablecoin.",
  },
];

const HelpSupport = () => {
  const router = useRouter();

  const contactOptions = [
    {
      icon: MessageCircle,
      label: "Live Chat",
      description: "Chat with our support team",
    },
    {
      icon: Mail,
      label: "Email Support",
      description: "support@offrailfinance.com",
    },
    {
      icon: FileText,
      label: "Terms & Privacy",
      description: "Legal documents",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card">
          <button
            onClick={() => router.push("/profile")}
            className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Help & Support</h1>
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* FAQs */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">
              Frequently Asked Questions
            </h2>
            <div className="bg-card rounded-2xl card-shadow overflow-hidden">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border-b border-border last:border-0"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-secondary/50 transition-colors list-none">
                    <span className="text-sm font-medium text-foreground">
                      {faq.q}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="px-5 pb-4 text-sm text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">
              Contact Us
            </h2>
            <div className="bg-card rounded-2xl card-shadow overflow-hidden">
              {contactOptions.map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-secondary/50 transition-colors border-b border-border last:border-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
