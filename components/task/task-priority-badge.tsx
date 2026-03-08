import { Badge } from "@/components/ui/badge";
import { taskPriorityMeta, type TaskPriorityValue } from "@/lib/constants";

type TaskPriorityBadgeProps = {
  priority: TaskPriorityValue;
};

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const meta = taskPriorityMeta[priority];

  return <Badge className={meta.className}>{meta.label}优先级</Badge>;
}
