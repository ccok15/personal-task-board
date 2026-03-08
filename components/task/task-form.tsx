import { SubmitButton } from "@/components/common/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TaskRecord } from "@/lib/types";
import { formatDateInput } from "@/lib/utils";

type TaskFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  task?: TaskRecord | null;
  submitLabel: string;
};

export function TaskForm({ action, task, submitLabel }: TaskFormProps) {
  return (
    <form action={action} className="grid gap-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">任务标题 *</Label>
          <Input id="title" name="title" defaultValue={task?.title ?? ""} maxLength={120} required />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">任务描述</Label>
          <Textarea id="description" name="description" defaultValue={task?.description ?? ""} maxLength={4000} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="submitterName">提交人名称 *</Label>
          <Input
            id="submitterName"
            name="submitterName"
            defaultValue={task?.submitterName ?? ""}
            maxLength={60}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">优先级</Label>
          <select
            id="priority"
            name="priority"
            className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
            defaultValue={task?.priority ?? "MEDIUM"}
          >
            <option value="URGENT">紧急</option>
            <option value="HIGH">高</option>
            <option value="MEDIUM">中</option>
            <option value="LOW">低</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">状态</Label>
          <select
            id="status"
            name="status"
            className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
            defaultValue={task?.status ?? "PENDING"}
          >
            <option value="PENDING">待处理</option>
            <option value="IN_PROGRESS">进行中</option>
            <option value="BLOCKED">阻塞</option>
            <option value="DONE">已完成</option>
            <option value="PAUSED">搁置</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">希望完成时间</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={formatDateInput(task?.dueDate)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="adminNote">管理员备注</Label>
          <Textarea
            id="adminNote"
            name="adminNote"
            defaultValue={task?.adminNote ?? ""}
            maxLength={4000}
            placeholder="这部分仅后台可见。"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-slate-200">
        <input
          className="size-4 accent-cyan-300"
          defaultChecked={task?.isPublic ?? true}
          name="isPublic"
          type="checkbox"
        />
        作为公开任务展示（关闭后仅管理员可见）
      </label>

      <div className="flex justify-end">
        <SubmitButton pendingLabel="保存中...">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
