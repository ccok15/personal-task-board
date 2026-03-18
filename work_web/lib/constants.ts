import type { NavItem } from "@/lib/types";

export const USER_ROLE_VALUES = ["ADMIN"] as const;
export const TASK_STATUS_VALUES = [
  "PENDING",
  "IN_PROGRESS",
  "BLOCKED",
  "DONE",
  "PAUSED",
] as const;
export const TASK_PRIORITY_VALUES = ["URGENT", "HIGH", "MEDIUM", "LOW"] as const;
export const TASK_PROGRESS_STEP = 10;
export const TASK_PROGRESS_MAX = 100;
export const TASK_PROGRESS_REOPEN_VALUE = 90;

export type UserRoleValue = (typeof USER_ROLE_VALUES)[number];
export type TaskStatusValue = (typeof TASK_STATUS_VALUES)[number];
export type TaskPriorityValue = (typeof TASK_PRIORITY_VALUES)[number];

export const publicNavigation: NavItem[] = [
  { href: "/", label: "首页" },
  { href: "/tasks", label: "任务管理" },
];

export const adminNavigation: NavItem[] = [
  { href: "/admin/tasks", label: "任务管理" },
];

export const taskStatusMeta: Record<
  TaskStatusValue,
  { label: string; description: string; className: string }
> = {
  PENDING: {
    label: "待处理",
    description: "已进入系统，等待排期",
    className: "status-badge--pending",
  },
  IN_PROGRESS: {
    label: "进行中",
    description: "当前正在处理",
    className: "status-badge--in-progress",
  },
  BLOCKED: {
    label: "阻塞",
    description: "存在依赖或问题待解决",
    className: "status-badge--blocked",
  },
  DONE: {
    label: "已完成",
    description: "已交付或已处理完成",
    className: "status-badge--done",
  },
  PAUSED: {
    label: "搁置",
    description: "暂缓处理，后续再跟进",
    className: "status-badge--paused",
  },
};

export const taskPriorityMeta: Record<
  TaskPriorityValue,
  { label: string; className: string }
> = {
  URGENT: {
    label: "紧急",
    className: "priority-badge--urgent",
  },
  HIGH: {
    label: "高",
    className: "priority-badge--high",
  },
  MEDIUM: {
    label: "中",
    className: "priority-badge--medium",
  },
  LOW: {
    label: "低",
    className: "priority-badge--low",
  },
};

export const TASK_STATUS_ORDER: TaskStatusValue[] = [
  "IN_PROGRESS",
  "BLOCKED",
  "PENDING",
  "PAUSED",
  "DONE",
];

export const TASK_PRIORITY_ORDER: TaskPriorityValue[] = [
  "URGENT",
  "HIGH",
  "MEDIUM",
  "LOW",
];

export const OPEN_TASK_STATUS_ORDER: TaskStatusValue[] = [
  "IN_PROGRESS",
  "BLOCKED",
  "PENDING",
  "PAUSED",
];

export function getStatusRank(status: TaskStatusValue) {
  const index = TASK_STATUS_ORDER.indexOf(status);
  return index === -1 ? TASK_STATUS_ORDER.length : index;
}

export function getPriorityRank(priority: TaskPriorityValue) {
  const index = TASK_PRIORITY_ORDER.indexOf(priority);
  return index === -1 ? TASK_PRIORITY_ORDER.length : index;
}
