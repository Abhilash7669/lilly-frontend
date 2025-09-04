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
      className={cn("bg-primary/60 rounded-md p-2 cursor-pointer", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
