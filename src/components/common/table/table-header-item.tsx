"use client"

import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";

type Props<T> = {
    text: string;
    column: Column<T, unknown>
}

export default function TableHeaderItem<T>({ text, column }: Props<T>) {
  return (
    <Button
        variant="link"
        className="px-0 text-base-foreground"
        onClick={() => column.getIsSorted() === "desc"}
    >
        <h4 className="text-sm">
            {text}
        </h4>
    </Button>
  )
}