import { redirect } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { SectionHeading } from "@/components/common/section-heading";
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

  const session = await auth();
  const isAdmin = isAdminSession(session);

  if (isAdmin) {
    redirect("/admin/tasks");
  }

  const tasks = await getVisibleTasks({
    query,
  });

  return (
    <PublicShell>
      <section className="space-y-6">
        <SectionHeading
          eyebrow="Task control"
          title="任务管理"
          description="这里展示全部公开任务。游客只能搜索查看，不能编辑。"
        />
        <TaskFilterForm
          actionPath="/tasks"
          query={query}
          queryLabel="标题搜索"
          queryPlaceholder="输入任务标题"
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
