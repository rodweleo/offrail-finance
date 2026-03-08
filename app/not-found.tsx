import { Wallet, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center px-6">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-accent/40 blur-3xl" />
    </div>

    <div className="relative z-10 flex flex-col items-center text-center max-w-xs">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center animate-success-pop">
          <SearchX className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
          <Wallet className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>

      <h1 className="text-6xl font-extrabold text-foreground tracking-tight mb-2">
        404
      </h1>
      <p className="text-lg font-semibold text-foreground mb-1">
        Page not found
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Button
        asChild
        className="h-12 px-8 rounded-2xl text-sm font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
      >
        <a href="/">
          <Wallet className="w-4 h-4" />
          Go Home
        </a>
      </Button>
    </div>
  </div>
);

export default NotFound;
