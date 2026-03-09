import type { ReactNode } from "react";

import { CalendarDays, Clock3, FileText, UserRound } from "lucide-react";

import { TaskPriorityBadge } from "@/components/task/task-priority-badge";
import { TaskStatusBadge } from "@/components/task/task-status-badge";
import { TaskVisibilityBadge } from "@/components/task/task-visibility-badge";
import type { TaskRecord } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";

type TaskManagementCardProps = {
  task: TaskRecord;
  showVisibility?: boolean;
  showAdminNote?: boolean;
  footer?: ReactNode;
};

export function TaskManagementCard({
  task,
  showVisibility = false,
  showAdminNote = false,
  footer,
}: TaskManagementCardProps) {
  return (
    <article className="tech-panel rounded-2xl p-4">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
          {showVisibility ? <TaskVisibilityBadge isPublic={task.isPublic} /> : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-heading break-words text-lg font-semibold">{task.title}</h3>
          <p className="text-sm/6 text-[var(--muted)]">
            {task.description || "未补充详细说明。"}
          </p>
        </div>

        <div className="grid gap-3 text-sm text-[var(--foreground)]">
          <div className="grid grid-cols-[1rem_5rem_1fr] items-start gap-2">
            <UserRound className="mt-0.5 size-4 text-[var(--muted)]" />
            <span className="text-[var(--muted)]">提交人名称</span>
            <span>{task.submitterName || "未署名"}</span>
          </div>
          <div className="grid grid-cols-[1rem_5rem_1fr] items-start gap-2">
            <Clock3 className="mt-0.5 size-4 text-[var(--muted)]" />
            <span className="text-[var(--muted)]">创建时间</span>
            <span>{formatDateTime(task.createdAt)}</span>
          </div>
          <div className="grid grid-cols-[1rem_5rem_1fr] items-start gap-2">
            <CalendarDays className="mt-0.5 size-4 text-[var(--muted)]" />
            <span className="text-[var(--muted)]">期望时间</span>
            <span>{formatDate(task.dueDate)}</span>
          </div>
          <div className="grid grid-cols-[1rem_5rem_1fr] items-start gap-2">
            <Clock3 className="mt-0.5 size-4 text-[var(--muted)]" />
            <span className="text-[var(--muted)]">最近更新</span>
            <span>{formatDateTime(task.updatedAt)}</span>
          </div>
        </div>

        {showAdminNote && task.adminNote ? (
          <div className="admin-note-panel rounded-xl p-3">
            <div className="admin-note-title mb-2 flex items-center gap-2 text-sm font-semibold">
              <FileText className="size-4" />
              管理员备注
            </div>
            <p className="admin-note-body text-sm/6">{task.adminNote}</p>
          </div>
        ) : null}

        {footer ? <div className="border-t border-[var(--table-row-border)] pt-4">{footer}</div> : null}
      </div>
    </article>
  );
}
