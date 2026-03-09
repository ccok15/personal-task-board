import type {
  TaskPriorityValue,
  TaskStatusValue,
  UserRoleValue,
} from "@/lib/constants";

export type NavItem = {
  href: string;
  label: string;
};

export type TaskRecord = {
  id: string;
  title: string;
  description: string | null;
  submitterName: string | null;
  priority: TaskPriorityValue;
  status: TaskStatusValue;
  dueDate: Date | null;
  completedAt: Date | null;
  adminNote: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserRecord = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRoleValue;
  createdAt: Date;
  updatedAt: Date;
};
