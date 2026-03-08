import { useEffect, useRef, useState } from "react";
import { Camera, X, Clipboard } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface Props {
  open: boolean;
  onClose: () => void;
  onScan: (value: string) => void;
}

const QRScannerModal = ({ open, onClose, onScan }: Props) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrScannerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [pasteValue, setPasteValue] = useState("");

  useEffect(() => {
    if (!open) return;

    let mounted = true;
    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!mounted || !scannerRef.current) return;

        const scanner = new Html5Qrcode("qr-reader");
        html5QrScannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decoded) => {
            onScan(decoded);
            scanner.stop().catch(() => {});
            onClose();
          },
          () => {}
        );
      } catch {
        if (mounted) setError("Camera not available. Paste the address below.");
      }
    };

    startScanner();

    return () => {
      mounted = false;
      html5QrScannerRef.current?.stop?.().catch(() => {});
      html5QrScannerRef.current = null;
    };
  }, [open, onScan, onClose]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPasteValue(text);
    } catch {
      // fallback – user types manually
    }
  };

  const handleSubmitPaste = () => {
    if (pasteValue.trim()) {
      onScan(pasteValue.trim());
      onClose();
    }
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[85vh] rounded-t-3xl border-0 bg-card">
        <DrawerHeader className="px-6 pt-2 pb-0">
          <DrawerTitle className="text-lg font-bold text-foreground">
            Scan QR Code
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Scan a wallet QR code or paste an address
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Camera view */}
          <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-muted">
            <div id="qr-reader" ref={scannerRef} className="w-full h-full" />
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted p-4">
                <div className="text-center">
                  <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Paste fallback */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              Or paste a wallet address
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="0x... or ENS name"
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
              />
              <button
                onClick={handlePaste}
                className="px-3 py-2.5 rounded-xl bg-accent/50 border border-border hover:border-primary/40 transition-colors"
                title="Paste from clipboard"
              >
                <Clipboard className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <button
              onClick={handleSubmitPaste}
              disabled={!pasteValue.trim()}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity text-sm"
            >
              Use This Address
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default QRScannerModal;
