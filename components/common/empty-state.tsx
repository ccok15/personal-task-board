import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-8 text-center">
        <p className="text-heading text-lg font-semibold">{title}</p>
        <p className="mx-auto max-w-xl text-sm/7 text-[var(--muted)]">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
