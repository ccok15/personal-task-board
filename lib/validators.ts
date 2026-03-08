import { z } from "zod";

import {
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
} from "@/lib/constants";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""));

const requiredText = (max: number, requiredMessage: string, tooLongMessage: string) =>
  z.string().trim().min(1, requiredMessage).max(max, tooLongMessage);

const optionalDate = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
    message: "日期格式不正确",
  });

const optionalPriority = z
  .enum(TASK_PRIORITY_VALUES)
  .optional()
  .or(z.literal(""))
  .transform((value) => (value === "" ? undefined : value));

export const publicTaskSchema = z.object({
  title: z.string().trim().min(1, "标题必填").max(120, "标题过长"),
  description: optionalText(4000),
  submitterName: requiredText(60, "提交人名称必填", "提交人名称过长"),
  priority: optionalPriority,
  dueDate: optionalDate,
});

export const adminTaskSchema = z.object({
  title: z.string().trim().min(1, "标题必填").max(120, "标题过长"),
  description: optionalText(4000),
  submitterName: requiredText(60, "提交人名称必填", "提交人名称过长"),
  priority: z.enum(TASK_PRIORITY_VALUES),
  status: z.enum(TASK_STATUS_VALUES),
  dueDate: optionalDate,
  adminNote: optionalText(4000),
});

export const planSchema = z.object({
  title: z.string().trim().min(1, "标题必填").max(120, "标题过长"),
  content: optionalText(4000),
  stage: optionalText(80),
  targetDate: optionalDate,
});

export function toNullableString(value: string | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function toDateOrNull(value: string | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return new Date(`${trimmed}T00:00:00`);
}
