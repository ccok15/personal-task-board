"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth, isAdminSession, requireAdmin } from "@/lib/auth";
import type { TaskStatusValue } from "@/lib/constants";
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

function getCompletionData(
  currentStatus: TaskStatusValue,
  nextStatus: TaskStatusValue,
  currentCompletedAt: Date | null,
) {
  if (nextStatus === "DONE") {
    return {
      completedAt: currentStatus === "DONE" ? currentCompletedAt ?? new Date() : new Date(),
    };
  }

  return {
    completedAt: null,
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
      ...getCompletionData("PENDING", parsed.data.status, null),
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
      ...getCompletionData(existingTask.status, parsed.data.status, existingTask.completedAt),
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
      ...getCompletionData(task.status, status, task.completedAt),
    },
  });

  revalidateTaskPaths(taskId);
}

export async function deleteTaskAction(taskId: string) {
  await requireAdmin();

  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidateTaskPaths(taskId);
  redirect("/admin/tasks?deleted=1");
}
