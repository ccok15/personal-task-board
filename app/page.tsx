import Link from "next/link";
import { Plus } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Notice } from "@/components/common/notice";
import { SectionHeading } from "@/components/common/section-heading";
import { PublicShell } from "@/components/layout/public-shell";
import { HomeTaskForm } from "@/components/task/home-task-form";
import { TaskListItem } from "@/components/task/task-list-item";
import { TaskStatusActions } from "@/components/task/task-status-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth, isAdminSession } from "@/lib/auth";
import { getVisibleOpenTasks } from "@/lib/data";

export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;
type SearchParams = Promise<Record<string, SearchParamValue>>;

function firstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) ?? {};
  const create = firstValue(params.create);
  const created = firstValue(params.created);
  const error = firstValue(params.error);

  const session = await auth();
  const isAdmin = isAdminSession(session);
  const tasks = await getVisibleOpenTasks(isAdmin);

  return (
    <PublicShell>
      <section className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Task console"
          title="当前任务"
          description="这里集中展示正在做、被阻塞、待处理和已搁置的任务。首页就是主工作台。"
        />
        <Button asChild className="w-full sm:w-auto" size="lg">
          <Link href="/?create=1">
            <Plus className="size-4" />
            新建任务
          </Link>
        </Button>
      </section>

      {created ? (
        <Notice title="任务已创建" description="新任务已经进入首页列表。" variant="success" />
      ) : null}
      {error ? (
        <Notice
          title="提交失败"
          description="请检查标题是否已填写，或确认日期格式是否正确。"
          variant="error"
        />
      ) : null}

      {create ? (
        <Card>
          <CardContent className="p-6 md:p-7">
            <HomeTaskForm isAdmin={isAdmin} />
          </CardContent>
        </Card>
      ) : null}

      {tasks.length ? (
        <section className="space-y-4">
          {tasks.map((task) => (
            <TaskListItem
              key={task.id}
              actions={
                <TaskStatusActions
                  canManageAllStatuses={isAdmin}
                  currentStatus={task.status}
                  taskId={task.id}
                />
              }
              editHref={isAdmin ? `/admin/tasks/${task.id}` : undefined}
              showVisibility={isAdmin}
              task={task}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="当前没有未完成任务"
          description="可以直接从首页新建一条任务，后续状态也都在这里跟进。"
          action={
            <Button asChild>
              <Link href="/?create=1">去新建任务</Link>
            </Button>
          }
        />
      )}
    </PublicShell>
  );
}
