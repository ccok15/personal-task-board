"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

import { HomeTaskForm } from "@/components/task/home-task-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type HomeTaskFabProps = {
  isAdmin: boolean;
  initialOpen?: boolean;
};

export function HomeTaskFab({ isAdmin, initialOpen = false }: HomeTaskFabProps) {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    setOpen(initialOpen);
  }, [initialOpen]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        aria-controls="home-task-modal"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="新建任务"
        className="fixed right-4 bottom-24 z-40 inline-flex size-15 items-center justify-center rounded-full border border-[var(--button-default-border-hover)] bg-[var(--button-default-bg-hover)] text-[var(--button-default-text)] shadow-[0_18px_40px_rgba(2,132,199,0.22)] backdrop-blur transition-transform hover:scale-[1.03] md:right-8 md:bottom-10"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Plus className="size-6" />
      </button>

      {open ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-4 py-4 backdrop-blur-sm md:items-center md:px-6"
          id="home-task-modal"
          role="dialog"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          />

          <Card className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-[28px]">
            <CardHeader className="border-b border-[var(--border)] px-5 pt-5 pb-4 md:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="kicker">Create task</p>
                  <CardTitle>新建任务</CardTitle>
                  <p className="text-sm text-[var(--muted)]">
                    {isAdmin ? "创建后会进入首页任务列表，可继续在后台维护。" : "提交后任务会立即进入首页任务列表。"}
                  </p>
                </div>
                <Button
                  aria-label="关闭新建任务弹窗"
                  className="shrink-0"
                  onClick={() => setOpen(false)}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="max-h-[calc(85vh-110px)] overflow-y-auto px-5 py-5 md:px-6">
              <HomeTaskForm isAdmin={isAdmin} />
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
