import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function shellQuote(value:string) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}