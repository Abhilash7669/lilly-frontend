"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OptionList } from "@/lib/types/generic";
import { cn } from "@/lib/utils";

type Props<T, K extends keyof T> = {
  name: K;
  value?: T[K];
  selectData: OptionList;
  selectLabel: string;
  onValueChange: (key: K, value: T[K]) => void;
  className?: string;
};

export default function AppSelect<T, K extends keyof T>({
  selectData,
  onValueChange,
  name,
  value,
  selectLabel = "Label",
  className=""
}: Props<T, K>) {
  // todo: create loaders

  if (!selectData) return "No data found";

  return (
    <Select value={String(value ?? "")} onValueChange={(value) => onValueChange(name, value as T[K])}>
      <SelectTrigger className={cn("cursor-pointer w-full text-xs", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{selectLabel}</SelectLabel>
          {selectData.map((item) => (
            <SelectItem className="text-xs" key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
