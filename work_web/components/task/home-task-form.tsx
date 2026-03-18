"use client";

import { SubmitButton } from "@/components/common/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createHomeTaskAction } from "@/lib/actions/task-actions";

type HomeTaskFormProps = {
  isAdmin: boolean;
};

export function HomeTaskForm({ isAdmin }: HomeTaskFormProps) {
  return (
    <form action={createHomeTaskAction} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">任务标题 *</Label>
          <Input id="title" name="title" maxLength={120} placeholder="例如：补测某批次样品的高温表现" required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">任务描述</Label>
          <Textarea
            id="description"
            name="description"
            maxLength={4000}
            placeholder="补充背景、问题现象、希望验证的点。"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="submitterName">提交人名称 *</Label>
          <Input
            id="submitterName"
            name="submitterName"
            maxLength={60}
            placeholder="例如：产品经理 / 产线负责人"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">优先级</Label>
          <select
            id="priority"
            name="priority"
            className="input-surface h-11 w-full rounded-md px-3 text-sm outline-none"
            defaultValue=""
          >
            <option value="">默认中优先级</option>
            <option value="URGENT">紧急</option>
            <option value="HIGH">高</option>
            <option value="MEDIUM">中</option>
            <option value="LOW">低</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="dueDate">希望完成时间</Label>
          <Input id="dueDate" name="dueDate" type="date" />
        </div>
      </div>

      {isAdmin ? (
        <label className="input-surface flex items-center gap-3 rounded-xl px-4 py-3 text-sm">
          <input className="size-4 accent-cyan-300" defaultChecked name="isPublic" type="checkbox" />
          作为公开任务展示（关闭后仅管理员可见）
        </label>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--muted)]">
          {isAdmin ? "管理员创建的任务默认进入首页待处理列表。" : "提交后任务会立即出现在任务列表中。"}
        </p>
        <SubmitButton className="w-full sm:w-auto" pendingLabel="提交中...">
          {isAdmin ? "保存任务" : "发送任务"}
        </SubmitButton>
      </div>
    </form>
  );
}
