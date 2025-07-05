"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ICON_SIZE } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { SetStateAction } from "react";

type Props = {
  header?: {
    title: string;
    description: string;
  };
  cancelText?: string;
  confirmText?: string;
  children: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => Promise<void>;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  side?: "top" | "right" | "bottom" | "left";
};

export default function SidePanel({
  header = { title: "", description: "" },
  cancelText = "Cancel",
  confirmText = "Confirm",
  children,
  onCancel = () => {},
  onConfirm = async () => {},
  open = false,
  setOpen,
  isLoading,
  side="right"
}: Props) {
  function handleCancel(): void {
    if (onCancel) onCancel();
    return;
  }

  async function handleConfirm(): Promise<void> {
    if (onConfirm) await onConfirm();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>Open</SheetTrigger>
      <SheetContent
        side={side}
      >
        <ScrollArea className="h-[calc(100dvh-5rem)]">
          {header && (
            <SheetHeader>
              <SheetTitle>{header.title}&#x1F52E;</SheetTitle>
              <SheetDescription>{header.description}</SheetDescription>
              <Separator className="bg-muted-foreground mt-2" />
            </SheetHeader>
          )}
          <div className="grid flex-1 auto-rows-min gap-6 px-4">{children}</div>
        </ScrollArea>
        <SheetFooter className="flex flex-row justify-end items-center gap-2">
          <SheetClose asChild>
            <Button onClick={handleCancel} variant="outline">
              {cancelText}
            </Button>
          </SheetClose>
          <Button 
            disabled={isLoading}
            onClick={handleConfirm}
          >
            {
              isLoading ?
              <LoaderCircle className={`${ICON_SIZE.small} animate-spin`} />
              :
              confirmText
            }
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
