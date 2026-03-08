import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, UserRound } from "lucide-react";

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
    <article className="tech-panel rounded-2xl p-4 md:p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
            {showVisibility ? <TaskVisibilityBadge isPublic={task.isPublic} /> : null}
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white md:text-xl">{task.title}</h2>
            <p className="text-sm/7 text-[var(--muted)]">
              {task.description || "未补充详细说明。"}
            </p>
          </div>

          <div className="grid gap-2 text-sm text-[var(--muted)] md:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-center gap-2">
              <UserRound className="size-4" />
              <span>{task.submitterName || "未署名"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              <span>期望完成：{formatDate(task.dueDate)}</span>
            </div>
            {showCompletedAt ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                <span>完成时间：{formatDateTime(task.completedAt)}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Clock3 className="size-4" />
              <span>最近更新：{formatDateTime(task.updatedAt)}</span>
            </div>
          </div>
        </div>

        {actions || editHref ? (
          <div className="flex w-full shrink-0 flex-col items-stretch gap-3 xl:w-auto xl:items-end">
            {actions}
            {editHref ? (
              <Button asChild className="w-full sm:w-auto" size="sm" variant="secondary">
                <Link href={editHref}>编辑</Link>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
