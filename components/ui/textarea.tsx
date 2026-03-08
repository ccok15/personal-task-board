import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-28 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-50 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/50 focus:bg-white/8",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
