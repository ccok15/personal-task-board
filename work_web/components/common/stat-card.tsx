import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
};

export function StatCard({ label, value, hint, icon }: StatCardProps) {
  return (
    <Card className="scan-line">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-2">
          <p className="kicker">{label}</p>
          <p className="text-heading text-3xl font-semibold">{value}</p>
          <p className="text-sm text-[var(--muted)]">{hint}</p>
        </div>
        <div className="icon-chip rounded-2xl p-3">{icon}</div>
      </CardContent>
    </Card>
  );
}
