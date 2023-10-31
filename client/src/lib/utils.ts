import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useToast } from "@/components/ui/use-toast"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkForServerError(status: number, toast: ReturnType<typeof useToast>['toast']) {
  if (status >= 500 && status < 600) {
    toast({
        variant: "destructive",
        title: "Server Error",
        description: "Contact k200338@nu.edu.pk for assistance",
    })
  }
}

export type Nullable<T extends Record<string, any>> = {[K in keyof T] : T[K] | null};
