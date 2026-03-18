import { InProgressProgressCard } from "@/components/task/in-progress-progress-card";
import type { TaskRecord } from "@/lib/types";

type InProgressSpotlightProps = {
  tasks: TaskRecord[];
  isAdmin: boolean;
};

export function InProgressSpotlight({ tasks, isAdmin }: InProgressSpotlightProps) {
  if (!tasks.length) {
    return null;
  }

  return (
    <section className="tech-panel in-progress-spotlight-shell rounded-xl px-2.5 py-2 shadow-[0_14px_40px_rgba(2,132,199,0.08)]">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="in-progress-status-dot inline-flex size-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          <p className="text-sm font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
            进行中任务
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        {tasks.map((task) => {
          return (
            <InProgressProgressCard
              key={task.id}
              isAdmin={isAdmin}
              progress={task.progress}
              taskId={task.id}
              title={task.title}
            />
          );
        })}
      </div>
    </section>
  );
}
