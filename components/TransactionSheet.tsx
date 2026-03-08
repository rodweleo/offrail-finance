import { ReactNode } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface TransactionSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const TransactionSheet = ({
  open,
  onClose,
  title,
  children,
}: TransactionSheetProps) => {
  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[92vh] rounded-t-3xl border-0 bg-card max-w-md mx-auto">
        <DrawerHeader className="px-6 pt-2 pb-0">
          <DrawerTitle className="text-lg font-bold text-foreground">
            {title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {title} transaction form
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6 overflow-y-auto flex-1 safe-bottom">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionSheet;
