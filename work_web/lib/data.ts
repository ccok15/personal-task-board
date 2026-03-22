import type { Prisma } from "@/generated/prisma/client";

import {
  OPEN_TASK_STATUS_ORDER,
  getPriorityRank,
  getStatusRank,
  type TaskPriorityValue,
  type TaskStatusValue,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";

type TaskFilters = {
  status?: TaskStatusValue | "ALL";
  priority?: TaskPriorityValue | "ALL";
  query?: string;
  includePrivate?: boolean;
  openOnly?: boolean;
  completedOnly?: boolean;
  queryMode?: "all" | "title";
  completedOrder?: "desc" | "asc";
};

function buildTaskWhere({
  status,
  priority,
  query,
  includePrivate,
  openOnly,
  completedOnly,
  queryMode = "all",
}: TaskFilters): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = {};

  if (!includePrivate) {
    where.isPublic = true;
  }

  if (completedOnly) {
    where.status = "DONE";
  } else if (openOnly) {
    where.status = { not: "DONE" };
  } else if (status && status !== "ALL") {
    where.status = status;
  }

  if (priority && priority !== "ALL") {
    where.priority = priority;
  }

  if (query) {
    where.OR =
      queryMode === "title"
        ? [{ title: { contains: query, mode: "insensitive" } }]
        : [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { submitterName: { contains: query, mode: "insensitive" } },
          ];
  }

  return where;
}

function sortOpenTasks<T extends { priority: TaskPriorityValue; createdAt: Date }>(
  tasks: T[],
) {
  return [...tasks].sort((left, right) => {
    const priorityDiff = getPriorityRank(left.priority) - getPriorityRank(right.priority);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return left.createdAt.getTime() - right.createdAt.getTime();
  });
}

function sortCompletedTasksByOrder<T extends { completedAt: Date | null; updatedAt: Date }>(
  tasks: T[],
  order: "desc" | "asc",
) {
  return [...tasks].sort((left, right) => {
    const leftTime = left.completedAt?.getTime() ?? left.updatedAt.getTime();
    const rightTime = right.completedAt?.getTime() ?? right.updatedAt.getTime();
    return order === "asc" ? leftTime - rightTime : rightTime - leftTime;
  });
}

function sortAdminTasks<
  T extends { status: TaskStatusValue; priority: TaskPriorityValue; updatedAt: Date; completedAt: Date | null },
>(
  tasks: T[],
  completedOrder: "desc" | "asc",
) {
  return [...tasks].sort((left, right) => {
    const leftOpen = left.status !== "DONE";
    const rightOpen = right.status !== "DONE";

    if (leftOpen !== rightOpen) {
      return leftOpen ? -1 : 1;
    }

    const statusDiff = getStatusRank(left.status) - getStatusRank(right.status);
    if (statusDiff !== 0) {
      return statusDiff;
    }

    if (!leftOpen && !rightOpen) {
      const leftTime = left.completedAt?.getTime() ?? left.updatedAt.getTime();
      const rightTime = right.completedAt?.getTime() ?? right.updatedAt.getTime();
      return completedOrder === "asc" ? leftTime - rightTime : rightTime - leftTime;
    }

    const priorityDiff = getPriorityRank(left.priority) - getPriorityRank(right.priority);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return right.updatedAt.getTime() - left.updatedAt.getTime();
  });
}

export async function getVisibleOpenTasks({
  includePrivate,
  status,
}: {
  includePrivate: boolean;
  status?: TaskStatusValue | "ALL";
}) {
  const tasks = await prisma.task.findMany({
    where: buildTaskWhere({
      includePrivate,
      openOnly: status === "ALL" || !status,
      status,
    }),
  });

  return sortOpenTasks(tasks).filter((task) => OPEN_TASK_STATUS_ORDER.includes(task.status));
}

export async function getVisibleTasks({
  query,
  completedOrder = "desc",
}: {
  query?: string;
  completedOrder?: "desc" | "asc";
}) {
  const tasks = await prisma.task.findMany({
    where: buildTaskWhere({
      includePrivate: false,
      query,
    }),
  });

  const openTasks = tasks.filter((task) => task.status !== "DONE");
  const completedTasks = tasks.filter((task) => task.status === "DONE");

  return [...sortOpenTasks(openTasks), ...sortCompletedTasksByOrder(completedTasks, completedOrder)];
}

export async function getVisibleCompletedTasks({
  includePrivate,
  priority,
  query,
  completedOrder = "desc",
}: {
  includePrivate: boolean;
  priority?: TaskPriorityValue | "ALL";
  query?: string;
  completedOrder?: "desc" | "asc";
}) {
  const tasks = await prisma.task.findMany({
    where: buildTaskWhere({
      includePrivate,
      completedOnly: true,
      priority,
      query,
      queryMode: "title",
    }),
  });

  return sortCompletedTasksByOrder(tasks, completedOrder);
}

export async function getAdminTasks(filters: Omit<TaskFilters, "includePrivate" | "openOnly" | "completedOnly">) {
  const tasks = await prisma.task.findMany({
    where: buildTaskWhere({
      ...filters,
      includePrivate: true,
    }),
  });

  return sortAdminTasks(tasks, filters.completedOrder ?? "desc");
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
  });
}
