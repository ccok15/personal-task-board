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

function sortCompletedTasks<T extends { completedAt: Date | null; updatedAt: Date }>(tasks: T[]) {
  return [...tasks].sort((left, right) => {
    const leftTime = left.completedAt?.getTime() ?? left.updatedAt.getTime();
    const rightTime = right.completedAt?.getTime() ?? right.updatedAt.getTime();
    return rightTime - leftTime;
  });
}

function sortAdminTasks<T extends { status: TaskStatusValue; priority: TaskPriorityValue; updatedAt: Date }>(
  tasks: T[],
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

    const priorityDiff = getPriorityRank(left.priority) - getPriorityRank(right.priority);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return right.updatedAt.getTime() - left.updatedAt.getTime();
  });
}

export async function getVisibleOpenTasks(includePrivate: boolean) {
  const tasks = await prisma.task.findMany({
    where: buildTaskWhere({
      includePrivate,
      openOnly: true,
    }),
  });

  return sortOpenTasks(tasks).filter((task) => OPEN_TASK_STATUS_ORDER.includes(task.status));
}

export async function getVisibleTasks({
  query,
}: {
  query?: string;
}) {
  return prisma.task.findMany({
    where: buildTaskWhere({
      includePrivate: false,
      query,
    }),
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
  });
}

export async function getVisibleCompletedTasks({
  includePrivate,
  priority,
  query,
}: {
  includePrivate: boolean;
  priority?: TaskPriorityValue | "ALL";
  query?: string;
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

  return sortCompletedTasks(tasks);
}

export async function getAdminTasks(filters: Omit<TaskFilters, "includePrivate" | "openOnly" | "completedOnly">) {
  const tasks = await prisma.task.findMany({
    where: buildTaskWhere({
      ...filters,
      includePrivate: true,
    }),
  });

  return sortAdminTasks(tasks);
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
  });
}
