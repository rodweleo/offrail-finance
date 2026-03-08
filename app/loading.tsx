import { Wallet } from "lucide-react";
const LoadingScreen = () => (
  <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-accent/40 blur-3xl" />
    </div>
    <div className="relative z-10 flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center animate-pulse">
        <Wallet className="w-7 h-7 text-primary-foreground" />
      </div>
      <span className="text-lg font-bold text-foreground tracking-tight">
        Offrail Finance
      </span>
      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  </div>
);
export default LoadingScreen;
