import { Badge } from "@/components/ui/badge";
import { taskStatusMeta, type TaskStatusValue } from "@/lib/constants";

type TaskStatusBadgeProps = {
  status: TaskStatusValue;
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const meta = taskStatusMeta[status];

  return <Badge className={meta.className}>{meta.label}</Badge>;
}
