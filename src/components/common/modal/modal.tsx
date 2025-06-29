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
import { Separator } from "@/components/ui/separator";
import { JSX, SetStateAction } from "react";

type Props = {
  dialogTrigger?: JSX.Element;
  dialogHeader?: {
    title: string | number;
    description: string | number;
  };
  children: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function Modal({
  dialogTrigger,
  dialogHeader = { title: "", description: "" },
  children,
  cancelText = "Cancel",
  confirmText = "Confirm",
  open = false,
  setOpen,
}: Props) {
  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      {dialogTrigger && <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>}
      <DialogContent>
        {dialogHeader && (
          <>
            <DialogHeader>
              <DialogTitle>{dialogHeader.title}&#x1F52E;</DialogTitle>
              <DialogDescription>{dialogHeader.description}</DialogDescription>
            </DialogHeader>
            <Separator className="bg-muted-foreground" />
          </>
        )}
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelText}</Button>
          </DialogClose>
          <Button>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
