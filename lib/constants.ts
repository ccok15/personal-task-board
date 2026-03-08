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
    className: "border-cyan-400/40 bg-cyan-400/10 text-cyan-100",
  },
  IN_PROGRESS: {
    label: "进行中",
    description: "当前正在处理",
    className: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
  },
  BLOCKED: {
    label: "阻塞",
    description: "存在依赖或问题待解决",
    className: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  },
  DONE: {
    label: "已完成",
    description: "已交付或已处理完成",
    className: "border-blue-400/40 bg-blue-400/10 text-blue-100",
  },
  PAUSED: {
    label: "搁置",
    description: "暂缓处理，后续再跟进",
    className: "border-zinc-400/40 bg-zinc-500/10 text-zinc-200",
  },
};

export const taskPriorityMeta: Record<
  TaskPriorityValue,
  { label: string; className: string }
> = {
  URGENT: {
    label: "紧急",
    className: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  },
  HIGH: {
    label: "高",
    className: "border-orange-400/40 bg-orange-400/10 text-orange-100",
  },
  MEDIUM: {
    label: "中",
    className: "border-cyan-400/40 bg-cyan-400/10 text-cyan-100",
  },
  LOW: {
    label: "低",
    className: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
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
