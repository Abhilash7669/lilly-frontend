import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn, ICON_SIZE } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { JSX, SetStateAction } from "react";

type Props = {
  dialogTrigger?: JSX.Element;
  dialogHeader?: {
    title: string | number;
    description: string | number;
  };
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: "destructive" | "default";
  onConfirm: () => Promise<void>;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  className?: string;
  containerClassName?: string;
};

export const Modal = ({
  dialogTrigger,
  dialogHeader = { title: "", description: "" },
  children,
  cancelText = "Cancel",
  confirmText = "Confirm",
  open = false,
  setOpen,
  confirmVariant = "default",
  onConfirm,
  isLoading = false,
  className = "",
  containerClassName = "",
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {dialogTrigger && <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>}
      <DialogContent className={containerClassName}>
        {dialogHeader && (
          <>
            <DialogHeader className="px-2">
              <DialogTitle className="flex items-center">
                {dialogHeader.title}
                <div className="animate-bounce">&#x1F52E;</div>
              </DialogTitle>
              <DialogDescription>{dialogHeader.description}</DialogDescription>
              {children && <Separator className="bg-muted-foreground" />}
            </DialogHeader>
          </>
        )}
        {children && (
          <ScrollArea className={cn("max-h-[26rem] pb-2", className)}>
            {children}
          </ScrollArea>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelText}</Button>
          </DialogClose>
          <Button
            disabled={isLoading}
            onClick={onConfirm}
            variant={confirmVariant}
          >
            {isLoading ? (
              <LoaderCircle className={`${ICON_SIZE.small} animate-spin`} />
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
