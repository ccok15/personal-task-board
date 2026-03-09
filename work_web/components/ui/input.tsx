import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "input-surface flex h-11 w-full rounded-md px-3 py-2 text-sm outline-none transition",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
