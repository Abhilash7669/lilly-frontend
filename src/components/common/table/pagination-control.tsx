"use client";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: (() => Promise<void> | void)
};

export default function PaginationControl({ children, className, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn("bg-primary/60 rounded-md p-2 cursor-pointer", className)}
    >
      {children}
    </div>
  );
}
