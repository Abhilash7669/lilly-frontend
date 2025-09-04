import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ICON_SIZE = {
  xsmall: "h-2 w-2",
  small: "h-3 w-3",
  medium: "h-4 w-4",
  large: "h-5 w-5",
};

export const LILLY_UTILS = {
  pagination: {
    resetPage: 1,
    limit: 10,
  },
};
