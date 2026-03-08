import Link from "next/link";

import { Notice } from "@/components/common/notice";
import { SectionHeading } from "@/components/common/section-heading";
import { SubmitButton } from "@/components/common/submit-button";
import { TaskManagementCard } from "@/components/task/task-management-card";
import { TaskPriorityBadge } from "@/components/task/task-priority-badge";
import { TaskStatusBadge } from "@/components/task/task-status-badge";
import { TaskVisibilityBadge } from "@/components/task/task-visibility-badge";
import { TaskFilterForm } from "@/components/task/task-filter-form";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  type TaskPriorityValue,
  type TaskStatusValue,
} from "@/lib/constants";
import { updateTaskStatusAction } from "@/lib/actions/task-actions";
import { requireAdmin } from "@/lib/auth";
import { getAdminTasks } from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;
type SearchParams = Promise<Record<string, SearchParamValue>>;

function firstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminTasksPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  await requireAdmin();

  const params = (await searchParams) ?? {};
  const status = (firstValue(params.status) ?? "ALL") as TaskStatusValue | "ALL";
  const priority = (firstValue(params.priority) ?? "ALL") as TaskPriorityValue | "ALL";
  const query = firstValue(params.q) ?? "";
  const deleted = firstValue(params.deleted);
  const error = firstValue(params.error);

  const tasks = await getAdminTasks({
    status,
    priority,
    query,
  });

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Task control"
          title="任务管理"
          description="查看全部任务，维护状态、公开性与管理员备注。新建任务统一回到首页。"
        />
      </section>

      {deleted ? <Notice title="任务已删除" variant="success" /> : null}
      {error ? <Notice title="任务不存在" variant="error" /> : null}

      <TaskFilterForm
        actionPath="/admin/tasks"
        priority={priority}
        query={query}
        showQuery
        status={status}
      />

      <section className="space-y-4 md:hidden">
        {tasks.map((task) => (
          <TaskManagementCard
            key={task.id}
            showVisibility
            task={task}
            footer={
              <div className="grid grid-cols-2 gap-2">
                {task.status === "DONE" ? (
                  <Button className="w-full" disabled size="sm" variant="ghost">
                    已完成
                  </Button>
                ) : (
                  <form className="w-full" action={updateTaskStatusAction.bind(null, task.id, "DONE")}>
                    <SubmitButton className="w-full" pendingLabel="处理中..." size="sm">
                      完成
                    </SubmitButton>
                  </form>
                )}
                <Button asChild className="w-full" size="sm" variant="secondary">
                  <Link href={`/admin/tasks/${task.id}`}>编辑</Link>
                </Button>
              </div>
            }
          />
        ))}
      </section>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>任务</TableHead>
              <TableHead>提交人名称</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>优先级</TableHead>
              <TableHead>可见性</TableHead>
              <TableHead>期望时间</TableHead>
              <TableHead>最近更新</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium text-white">{task.title}</TableCell>
                <TableCell>{task.submitterName || "未署名"}</TableCell>
                <TableCell>
                  <TaskStatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  <TaskPriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>
                  <TaskVisibilityBadge isPublic={task.isPublic} />
                </TableCell>
                <TableCell>{formatDate(task.dueDate)}</TableCell>
                <TableCell>{formatDateTime(task.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {task.status === "DONE" ? (
                      <Button disabled size="sm" variant="ghost">
                        已完成
                      </Button>
                    ) : (
                      <form action={updateTaskStatusAction.bind(null, task.id, "DONE")}>
                        <SubmitButton pendingLabel="处理中..." size="sm">
                          完成
                        </SubmitButton>
                      </form>
                    )}
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/admin/tasks/${task.id}`}>编辑</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
