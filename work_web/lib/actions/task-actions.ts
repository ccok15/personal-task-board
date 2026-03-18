"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth, isAdminSession, requireAdmin } from "@/lib/auth";
import {
  TASK_PROGRESS_MAX,
  TASK_PROGRESS_REOPEN_VALUE,
  TASK_PROGRESS_STEP,
  type TaskStatusValue,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { adminTaskSchema, publicTaskSchema, toDateOrNull, toNullableString } from "@/lib/validators";

function revalidateTaskPaths(taskId?: string) {
  revalidatePath("/");
  revalidatePath("/tasks");
  revalidatePath("/admin/tasks");

  if (taskId) {
    revalidatePath(`/admin/tasks/${taskId}`);
  }
}

function clampTaskProgress(progress: number) {
  if (Number.isNaN(progress)) {
    return 0;
  }

  return Math.max(0, Math.min(TASK_PROGRESS_MAX, Math.round(progress / TASK_PROGRESS_STEP) * TASK_PROGRESS_STEP));
}

function getCompletionData(
  currentStatus: TaskStatusValue,
  nextStatus: TaskStatusValue,
  currentCompletedAt: Date | null,
  currentProgress: number,
) {
  if (nextStatus === "DONE") {
    return {
      completedAt: currentStatus === "DONE" ? currentCompletedAt ?? new Date() : new Date(),
      progress: TASK_PROGRESS_MAX,
    };
  }

  return {
    completedAt: null,
    progress:
      currentStatus === "DONE" && currentProgress >= TASK_PROGRESS_MAX
        ? TASK_PROGRESS_REOPEN_VALUE
        : clampTaskProgress(currentProgress),
  };
}

export async function createHomeTaskAction(formData: FormData) {
  const parsed = publicTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    submitterName: formData.get("submitterName"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
  });

  if (!parsed.success) {
    redirect("/?create=1&error=validation");
  }

  const session = await auth();
  const isAdmin = isAdminSession(session);

  await prisma.task.create({
    data: {
      title: parsed.data.title.trim(),
      description: toNullableString(parsed.data.description),
      submitterName: toNullableString(parsed.data.submitterName),
      priority: parsed.data.priority ?? "MEDIUM",
      dueDate: toDateOrNull(parsed.data.dueDate),
      status: "PENDING",
      progress: 0,
      isPublic: isAdmin ? formData.get("isPublic") === "on" : true,
    },
  });

  revalidateTaskPaths();
  redirect("/?created=1");
}

export async function createAdminTaskAction(formData: FormData) {
  await requireAdmin();

  const parsed = adminTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    submitterName: formData.get("submitterName"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    dueDate: formData.get("dueDate"),
    adminNote: formData.get("adminNote"),
  });

  if (!parsed.success) {
    redirect("/admin/tasks/new?error=validation");
  }

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title.trim(),
      description: toNullableString(parsed.data.description),
      submitterName: toNullableString(parsed.data.submitterName),
      priority: parsed.data.priority,
      status: parsed.data.status,
      dueDate: toDateOrNull(parsed.data.dueDate),
      adminNote: toNullableString(parsed.data.adminNote),
      isPublic: formData.get("isPublic") === "on",
      ...getCompletionData("PENDING", parsed.data.status, null, 0),
    },
  });

  revalidateTaskPaths(task.id);
  redirect(`/admin/tasks/${task.id}?created=1`);
}

export async function updateTaskAction(taskId: string, formData: FormData) {
  await requireAdmin();

  const parsed = adminTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    submitterName: formData.get("submitterName"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    dueDate: formData.get("dueDate"),
    adminNote: formData.get("adminNote"),
  });

  if (!parsed.success) {
    redirect(`/admin/tasks/${taskId}?error=validation`);
  }

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      status: true,
      completedAt: true,
      progress: true,
    },
  });

  if (!existingTask) {
    redirect("/admin/tasks?error=notfound");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title: parsed.data.title.trim(),
      description: toNullableString(parsed.data.description),
      submitterName: toNullableString(parsed.data.submitterName),
      priority: parsed.data.priority,
      status: parsed.data.status,
      dueDate: toDateOrNull(parsed.data.dueDate),
      adminNote: toNullableString(parsed.data.adminNote),
      isPublic: formData.get("isPublic") === "on",
      ...getCompletionData(
        existingTask.status,
        parsed.data.status,
        existingTask.completedAt,
        existingTask.progress,
      ),
    },
  });

  revalidateTaskPaths(taskId);
  redirect(`/admin/tasks/${taskId}?saved=1`);
}

export async function updateTaskStatusAction(taskId: string, status: TaskStatusValue) {
  const session = await auth();
  const isAdmin = isAdminSession(session);

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      status: true,
      completedAt: true,
      progress: true,
      isPublic: true,
    },
  });

  if (!task) {
    return;
  }

  const canGuestPause =
    !isAdmin &&
    status === "PAUSED" &&
    task.isPublic &&
    task.status !== "DONE";

  if (!isAdmin && !canGuestPause) {
    return;
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status,
      ...getCompletionData(task.status, status, task.completedAt, task.progress),
    },
  });

  revalidateTaskPaths(taskId);
}

export async function updateTaskProgressAction(
  taskId: string,
  operation: "increment" | "decrement" | "complete",
) {
  await requireAdmin();

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      status: true,
      progress: true,
      completedAt: true,
    },
  });

  if (!task || task.status !== "IN_PROGRESS") {
    return {
      ok: false,
      progress: null,
      status: null,
    };
  }

  let nextProgress = task.progress;
  let nextStatus: TaskStatusValue = task.status;

  if (operation === "decrement") {
    nextProgress = Math.max(0, task.progress - TASK_PROGRESS_STEP);
  } else if (operation === "increment") {
    nextProgress = Math.min(TASK_PROGRESS_REOPEN_VALUE, task.progress + TASK_PROGRESS_STEP);
  } else if (operation === "complete") {
    nextProgress = TASK_PROGRESS_MAX;
    nextStatus = "DONE";
  }

  nextProgress = clampTaskProgress(nextProgress);

  if (nextProgress === task.progress && nextStatus === task.status) {
    return {
      ok: true,
      progress: task.progress,
      status: task.status,
    };
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: nextStatus,
      ...getCompletionData(task.status, nextStatus, task.completedAt, nextProgress),
    },
  });

  revalidateTaskPaths(taskId);

  return {
    ok: true,
    progress: nextStatus === "DONE" ? TASK_PROGRESS_MAX : nextProgress,
    status: nextStatus,
  };
}

export async function deleteTaskAction(taskId: string) {
  await requireAdmin();

  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidateTaskPaths(taskId);
  redirect("/admin/tasks?deleted=1");
}
