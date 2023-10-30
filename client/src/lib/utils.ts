import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Nullable<T extends Record<string, any>> = {[K in keyof T] : T[K] | null};
