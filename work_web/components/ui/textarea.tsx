import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "input-surface flex min-h-28 w-full rounded-md px-3 py-2 text-sm outline-none transition",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
