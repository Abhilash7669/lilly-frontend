import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ICON_SIZE = {
  xsmall: "h-2 w-2",
  small: "h-3 w-3",
  medium: "h-4 w-4"
}