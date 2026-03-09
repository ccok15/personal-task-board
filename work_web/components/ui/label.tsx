import * as React from "react";

import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("form-label mb-2 inline-flex text-sm font-medium", className)}
      {...props}
    />
  );
}
