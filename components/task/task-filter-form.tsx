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
  showStatus?: boolean;
  showPriority?: boolean;
  showQuery?: boolean;
  queryLabel?: string;
  queryPlaceholder?: string;
};

export function TaskFilterForm({
  actionPath,
  status = "ALL",
  priority = "ALL",
  query = "",
  showStatus = true,
  showPriority = true,
  showQuery = false,
  queryLabel = "关键词",
  queryPlaceholder = "标题 / 描述 / 提交人",
}: TaskFilterFormProps) {
  return (
    <form action={actionPath} className="tech-panel rounded-2xl p-4">
      <div className="grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
        {showStatus ? (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
              状态筛选
            </label>
            <select
              className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
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
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
              优先级
            </label>
            <select
              className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
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
        {showQuery ? (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
              {queryLabel}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-slate-400" />
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
