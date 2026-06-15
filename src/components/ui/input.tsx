import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ElementType;
}

function Input({ className, type, startIcon: StartIcon, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {StartIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70">
          <StartIcon className="size-5" />
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-placeholder placeholder:text-base selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-md border bg-transparent py-1 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          StartIcon ? "pl-10 pr-4" : "px-4",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
