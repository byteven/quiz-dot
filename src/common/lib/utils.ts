import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tremor
export const cx = cn;
export const focusRing =
  "outline outline-offset-2 outline-0 focus-visible:outline-2 outline-blue-500 dark:outline-blue-500";
