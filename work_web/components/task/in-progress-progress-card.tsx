"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateTaskProgressAction } from "@/lib/actions/task-actions";
import { TASK_PROGRESS_REOPEN_VALUE, TASK_PROGRESS_STEP } from "@/lib/constants";

type InProgressProgressCardProps = {
  taskId: string;
  title: string;
  progress: number;
  isAdmin: boolean;
};

const HOLD_TO_COMPLETE_MS = 800;

export function InProgressProgressCard({
  taskId,
  title,
  progress,
  isAdmin,
}: InProgressProgressCardProps) {
  const router = useRouter();
  const [displayProgress, setDisplayProgress] = useState(progress);
  const [activeSide, setActiveSide] = useState<"left" | "right" | null>(null);
  const [isPending, startTransition] = useTransition();
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);

  useEffect(() => {
    setDisplayProgress(progress);
  }, [progress]);

  function clearHoldTimer() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }

  function resetPressState() {
    clearHoldTimer();
    setActiveSide(null);
    longPressTriggeredRef.current = false;
  }

  function runProgressUpdate(operation: "increment" | "decrement" | "complete") {
    const previousProgress = displayProgress;
    const optimisticProgress =
      operation === "decrement"
        ? Math.max(0, previousProgress - TASK_PROGRESS_STEP)
        : operation === "increment"
          ? Math.min(TASK_PROGRESS_REOPEN_VALUE, previousProgress + TASK_PROGRESS_STEP)
          : 100;

    setDisplayProgress(optimisticProgress);

    startTransition(async () => {
      const result = await updateTaskProgressAction(taskId, operation);

      if (!result?.ok || typeof result.progress !== "number") {
        setDisplayProgress(previousProgress);
        return;
      }

      setDisplayProgress(result.progress);
      router.refresh();
    });
  }

  function handlePressStart(side: "left" | "right") {
    if (!isAdmin || isPending) {
      return;
    }

    setActiveSide(side);
    longPressTriggeredRef.current = false;

    if (side === "right") {
      holdTimerRef.current = setTimeout(() => {
        longPressTriggeredRef.current = true;
        runProgressUpdate("complete");
      }, HOLD_TO_COMPLETE_MS);
    }
  }

  function handlePressEnd(side: "left" | "right") {
    if (!isAdmin || isPending) {
      return;
    }

    const didLongPress = longPressTriggeredRef.current;
    resetPressState();

    if (didLongPress) {
      return;
    }

    runProgressUpdate(side === "left" ? "decrement" : "increment");
  }

  function handlePressCancel() {
    if (!isAdmin || isPending) {
      return;
    }

    resetPressState();
  }

  return (
    <article
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={displayProgress}
      aria-label={`${title} 当前进度 ${displayProgress}%`}
      className="in-progress-task-card group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur"
      role="progressbar"
      style={{ ["--task-progress" as string]: String(displayProgress) }}
    >
      <div className="in-progress-progress-fill absolute inset-y-0 left-0 rounded-lg" />

      {isAdmin ? (
        <>
          <div
            className={`absolute inset-y-0 left-0 z-10 w-1/2 rounded-l-lg bg-cyan-400/10 transition-opacity ${
              activeSide === "left" ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute inset-y-0 right-0 z-10 w-1/2 rounded-r-lg bg-emerald-400/12 transition-opacity ${
              activeSide === "right" ? "opacity-100" : "opacity-0"
            }`}
          />
          <button
            aria-label="减少任务进度 10%"
            className="absolute inset-y-0 left-0 z-20 w-1/2 cursor-pointer rounded-l-lg"
            disabled={isPending}
            onPointerCancel={handlePressCancel}
            onPointerDown={() => handlePressStart("left")}
            onPointerLeave={handlePressCancel}
            onPointerUp={() => handlePressEnd("left")}
            type="button"
          />
          <button
            aria-label="增加任务进度 10%，长按 0.8 秒直接完成"
            className="absolute inset-y-0 right-0 z-20 w-1/2 cursor-pointer rounded-r-lg"
            disabled={isPending}
            onPointerCancel={handlePressCancel}
            onPointerDown={() => handlePressStart("right")}
            onPointerLeave={handlePressCancel}
            onPointerUp={() => handlePressEnd("right")}
            type="button"
          />
        </>
      ) : null}

      <div className="relative z-[1] h-[1.95rem] text-left sm:h-[2rem]">
        <p className="absolute left-3 top-1/2 line-clamp-1 -translate-y-1/2 text-[0.86rem] font-semibold leading-none text-[var(--heading)] sm:text-[0.9rem]">
          {title}
        </p>
      </div>
    </article>
  );
}
