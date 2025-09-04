"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CustomPagination = React.ComponentPropsWithoutRef<"button"> & {
  className?: string;
};

export default function PaginationControl({
  children,
  className,
  ...props
}: CustomPagination) {
  return (
    <Button
      className={cn(
        "rounded-md p-2 cursor-pointer h-7 w-7 active:scale-95 transition-all",
        className
      )}
      variant="outline"
      {...props}
    >
      {children}
    </Button>
  );
}
