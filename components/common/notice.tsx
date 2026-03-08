import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/utils";

type NoticeProps = {
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
};

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: "notice-success",
  error: "notice-error",
  info: "notice-info",
};

export function Notice({ title, description, variant = "info" }: NoticeProps) {
  const Icon = icons[variant];

  return (
    <div className={cn("rounded-2xl border px-4 py-3", styles[variant])}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-4 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-semibold">{title}</p>
          {description ? <p className="text-sm/6 opacity-90">{description}</p> : null}
        </div>
      </div>
    </div>
  );
}
