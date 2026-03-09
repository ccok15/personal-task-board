import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, UserRound } from "lucide-react";

import { ExpandableTaskCard } from "@/components/task/expandable-task-card";
import { TaskPriorityBadge } from "@/components/task/task-priority-badge";
import { TaskStatusBadge } from "@/components/task/task-status-badge";
import { TaskVisibilityBadge } from "@/components/task/task-visibility-badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { TaskRecord } from "@/lib/types";

type TaskListItemProps = {
  task: TaskRecord;
  actions?: ReactNode;
  editHref?: string;
  showVisibility?: boolean;
  showCompletedAt?: boolean;
};

export function TaskListItem({
  task,
  actions,
  editHref,
  showVisibility = false,
  showCompletedAt = false,
}: TaskListItemProps) {
  return (
    <ExpandableTaskCard
      actions={
        actions || editHref ? (
          <>
            {actions}
            {editHref ? (
              <Button asChild className="w-full sm:w-auto" size="sm" variant="secondary">
                <Link href={editHref}>编辑</Link>
              </Button>
            ) : null}
          </>
        ) : null
      }
      badges={
        <>
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
          {showVisibility ? <TaskVisibilityBadge isPublic={task.isPublic} /> : null}
        </>
      }
      details={
        <>
          <p className="text-sm/7 text-[var(--muted)]">{task.description || "未补充详细说明。"}</p>

          <div className="grid gap-2 text-sm text-[var(--muted)] md:grid-cols-2 xl:grid-cols-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
            {showCompletedAt ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{formatDateTime(task.completedAt)}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Clock3 className="size-4 shrink-0" />
              <span>{formatDateTime(task.updatedAt)}</span>
            </div>
          </div>
        </>
      }
      summaryMeta={
        <>
          <div className="flex items-center gap-2">
            <UserRound className="size-4 shrink-0" />
            <span>{task.submitterName || "未署名"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 shrink-0" />
            <span>{formatDateTime(task.createdAt)}</span>
          </div>
        </>
      }
      title={task.title}
    />
  );
}
