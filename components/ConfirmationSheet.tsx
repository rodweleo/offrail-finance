import { useState } from "react";
import { Check } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SlideToConfirm from "@/components/SlideToConfirm";
import axios from "axios";
import { toast } from "sonner";

interface ConfirmationSheetProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  details: { label: string; value: string }[];
  loading?: boolean;
  success?: boolean;
  transactionReference?: string | null;
}

const ConfirmationSheet = ({
  open,
  onClose,
  onConfirm,
  title,
  details,
  loading,
  success,
  transactionReference,
}: ConfirmationSheetProps) => {
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      if (loading) {
        setShowCancelAlert(true);
      } else {
        onClose();
      }
    }
  };

  const handleCancelTransaction = async () => {
    if (!transactionReference) return;
    try {
      setCancelling(true);
      const response = await axios.patch(
        `/api/paycrest/orders/${transactionReference}/cancel`,
      );

      if (!response.data.success) {
        toast.error("Failed to cancel transaction. Please try again.");
        return;
      }

      toast.success("Transaction cancelled.");

      setShowCancelAlert(false);
      onClose();
    } catch (error) {
      console.error("Failed to cancel transaction:", error);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={handleOpenChange}
        dismissible={!loading}
      >
        <DrawerContent className="rounded-t-3xl border-0 bg-card max-w-md mx-auto">
          <DrawerHeader className="px-6 pt-2 pb-0">
            <DrawerTitle className="sr-only">{title}</DrawerTitle>
            <DrawerDescription className="sr-only">
              {title} confirmation
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-6 pb-6 safe-bottom">
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4 animate-success-pop">
                  <Check className="w-8 h-8 text-primary animate-success-check" />
                </div>
                <div className="animate-success-ring absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary/30" />
                <h3 className="text-lg font-bold text-foreground mb-1">
                  Transaction Successful
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your transaction has been processed
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-foreground mb-4">
                  {title}
                </h3>
                <div className="space-y-3 mb-6">
                  {details.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {d.label}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
                <SlideToConfirm onConfirm={onConfirm} loading={loading} />
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={showCancelAlert} onOpenChange={setShowCancelAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Transaction in Progress</AlertDialogTitle>
            <AlertDialogDescription>
              Your transaction is currently being processed. Cancelling now may
              result in a delayed refund to your wallet. Do you want to cancel?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelAlert(false)}>
              Continue Waiting
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelTransaction}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? "Cancelling..." : "Cancel Transaction"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConfirmationSheet;
