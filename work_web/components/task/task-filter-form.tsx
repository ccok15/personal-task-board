import { Search, SlidersHorizontal } from "lucide-react";

import {
  taskPriorityMeta,
  taskStatusMeta,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TaskFilterFormProps = {
  actionPath: string;
  status?: string;
  priority?: string;
  query?: string;
  completedOrder?: "desc" | "asc";
  showStatus?: boolean;
  showPriority?: boolean;
  showQuery?: boolean;
  showCompletedOrder?: boolean;
  queryLabel?: string;
  queryPlaceholder?: string;
};

export function TaskFilterForm({
  actionPath,
  status = "ALL",
  priority = "ALL",
  query = "",
  completedOrder = "desc",
  showStatus = true,
  showPriority = true,
  showQuery = false,
  showCompletedOrder = false,
  queryLabel = "关键词",
  queryPlaceholder = "标题 / 描述 / 提交人",
}: TaskFilterFormProps) {
  return (
    <form action={actionPath} className="tech-panel rounded-2xl p-4">
      <div className="grid gap-4 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto]">
        {showStatus ? (
          <div className="space-y-2">
            <label className="kicker">状态筛选</label>
            <select
              className="input-surface h-11 w-full rounded-md px-3 text-sm outline-none"
              defaultValue={status}
              name="status"
            >
              <option value="ALL">全部状态</option>
              {Object.entries(taskStatusMeta).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {showPriority ? (
          <div className="space-y-2">
            <label className="kicker">优先级</label>
            <select
              className="input-surface h-11 w-full rounded-md px-3 text-sm outline-none"
              defaultValue={priority}
              name="priority"
            >
              <option value="ALL">全部优先级</option>
              {Object.entries(taskPriorityMeta).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {showCompletedOrder ? (
          <div className="space-y-2">
            <label className="kicker">完成时间</label>
            <select
              className="input-surface h-11 w-full rounded-md px-3 text-sm outline-none"
              defaultValue={completedOrder}
              name="completedOrder"
            >
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>
        ) : null}
        {showQuery ? (
          <div className="space-y-2">
            <label className="kicker">{queryLabel}</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-[var(--surface-placeholder)]" />
              <Input className="pl-9" defaultValue={query} name="q" placeholder={queryPlaceholder} />
            </div>
          </div>
        ) : null}
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-end">
          <Button className="w-full sm:min-w-28 sm:w-auto" type="submit">
            <SlidersHorizontal className="size-4" />
            应用筛选
          </Button>
          <Button asChild className="w-full sm:w-auto" variant="ghost">
            <a href={actionPath}>重置</a>
          </Button>
        </div>
      </div>
    </form>
  );
}
