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
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  error: "border-rose-400/30 bg-rose-500/10 text-rose-100",
  info: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100",
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
