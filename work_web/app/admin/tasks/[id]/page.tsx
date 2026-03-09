import { notFound } from "next/navigation";

import { Notice } from "@/components/common/notice";
import { SectionHeading } from "@/components/common/section-heading";
import { TaskForm } from "@/components/task/task-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteTaskAction, updateTaskAction } from "@/lib/actions/task-actions";
import { requireAdmin } from "@/lib/auth";
import { getTaskById } from "@/lib/data";

export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;
type Params = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, SearchParamValue>>;

function firstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditTaskPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) {
  await requireAdmin();

  const { id } = await params;
  const task = await getTaskById(id);
  const queryParams: Record<string, SearchParamValue> = (await searchParams) ?? {};

  if (!task) {
    notFound();
  }

  const saved = firstValue(queryParams.saved);
  const created = firstValue(queryParams.created);
  const error = firstValue(queryParams.error);

  return (
    <>
      <SectionHeading
        eyebrow="Edit task"
        title={task.title}
        description="更新任务状态、公开性、管理员备注与截止时间。"
      />

      {saved ? <Notice title="任务已更新" variant="success" /> : null}
      {created ? <Notice title="任务已创建" description="现在可以继续补充备注或调整展示状态。" variant="success" /> : null}
      {error ? <Notice title="保存失败" description="请检查必填项与日期格式。" variant="error" /> : null}

      <Card>
        <CardContent className="p-6">
          <TaskForm action={updateTaskAction.bind(null, task.id)} submitLabel="保存修改" task={task} />
        </CardContent>
      </Card>

      <form action={deleteTaskAction.bind(null, task.id)} className="flex justify-end">
        <Button type="submit" variant="danger">
          删除任务
        </Button>
      </form>
    </>
  );
}
