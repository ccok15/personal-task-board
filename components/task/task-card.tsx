import { CalendarDays, Clock3, FileText, UserRound } from "lucide-react";

import { TaskPriorityBadge } from "@/components/task/task-priority-badge";
import { TaskStatusBadge } from "@/components/task/task-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TaskRecord } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";

type TaskCardProps = {
  task: TaskRecord;
  showAdminNote?: boolean;
};

export function TaskCard({ task, showAdminNote = false }: TaskCardProps) {
  return (
    <Card className="scan-line h-full">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>

        <div className="space-y-2">
          <h3 className="text-heading text-lg font-semibold">{task.title}</h3>
          {task.description ? (
            <p className="text-sm/7 text-[var(--muted)]">{task.description}</p>
          ) : (
            <p className="text-sm text-[var(--muted)]">未补充详细说明。</p>
          )}
        </div>

        <div className="grid gap-2 text-sm text-[var(--muted)] md:grid-cols-2">
          <div className="flex items-center gap-2">
            <UserRound className="size-4" />
            <span>{task.submitterName || "未署名"}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            <span>期望完成：{formatDate(task.dueDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="size-4" />
            <span>最近更新：{formatDateTime(task.updatedAt)}</span>
          </div>
        </div>

        {showAdminNote && task.adminNote ? (
          <div className="admin-note-panel rounded-xl p-4">
            <div className="admin-note-title mb-2 flex items-center gap-2 text-sm font-semibold">
              <FileText className="size-4" />
              管理员备注
            </div>
            <p className="admin-note-body text-sm/7">{task.adminNote}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
