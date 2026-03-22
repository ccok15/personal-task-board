import { redirect } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { PublicShell } from "@/components/layout/public-shell";
import { TaskManagementCard } from "@/components/task/task-management-card";
import { TaskPriorityBadge } from "@/components/task/task-priority-badge";
import { TaskStatusBadge } from "@/components/task/task-status-badge";
import { TaskFilterForm } from "@/components/task/task-filter-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auth, isAdminSession } from "@/lib/auth";
import { getVisibleTasks } from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;
type SearchParams = Promise<Record<string, SearchParamValue>>;

function firstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) ?? {};
  const query = firstValue(params.q) ?? "";
  const completedOrder = firstValue(params.completedOrder) === "asc" ? "asc" : "desc";

  const session = await auth();
  const isAdmin = isAdminSession(session);

  if (isAdmin) {
    redirect("/admin/tasks");
  }

  const tasks = await getVisibleTasks({
    query,
    completedOrder,
  });

  return (
    <PublicShell>
      <section>
        <TaskFilterForm
          actionPath="/tasks"
          completedOrder={completedOrder}
          query={query}
          queryLabel="标题搜索"
          queryPlaceholder="输入任务标题"
          showCompletedOrder
          showQuery
          showPriority={false}
          showStatus={false}
        />
      </section>

      {tasks.length ? (
        <>
          <section className="space-y-4 md:hidden">
            {tasks.map((task) => (
              <TaskManagementCard key={task.id} task={task} />
            ))}
          </section>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>任务</TableHead>
                  <TableHead>提交人名称</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>期望时间</TableHead>
                  <TableHead>最近更新</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="text-heading font-medium">{task.title}</TableCell>
                    <TableCell>{task.submitterName || "未署名"}</TableCell>
                    <TableCell>{formatDateTime(task.createdAt)}</TableCell>
                    <TableCell>
                      <TaskStatusBadge status={task.status} />
                    </TableCell>
                    <TableCell>
                      <TaskPriorityBadge priority={task.priority} />
                    </TableCell>
                    <TableCell>{formatDate(task.dueDate)}</TableCell>
                    <TableCell>{formatDateTime(task.updatedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <EmptyState
          title="没有匹配的任务"
          description="当前搜索条件下没有匹配项。你可以换个标题关键词再试一次。"
        />
      )}
    </PublicShell>
  );
}
