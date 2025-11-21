import * as React from "react";
import { cn } from "@/lib/utils";


const inputBase ="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40";


function Input({ className, ...props }: React.ComponentProps<"input">) {
    return <input className={cn(inputBase, className)} {...props} />;
}


export { Input };