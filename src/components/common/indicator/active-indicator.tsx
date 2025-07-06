import { cn } from "@/lib/utils";
import { JSX } from "react";

type Props = {
  className?: string;
}

export default function ActiveIndicator({ className }: Props): JSX.Element {
  return<span className={cn("h-[0.4rem] w-[0.4rem] rounded-full bg-green-400 animate-pulse", className)}></span>;
}