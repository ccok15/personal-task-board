import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const APP_LOCALE = "zh-CN";
const APP_TIME_ZONE = "Asia/Shanghai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | null | undefined) {
  if (!date) {
    return "未设置";
  }

  return new Intl.DateTimeFormat(APP_LOCALE, {
    dateStyle: "medium",
    timeZone: APP_TIME_ZONE,
  }).format(date);
}

export function formatDateTime(date: Date | null | undefined) {
  if (!date) {
    return "未设置";
  }

  return new Intl.DateTimeFormat(APP_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: APP_TIME_ZONE,
  }).format(date);
}

export function formatDateInput(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function absoluteUrl(path: string) {
  const baseUrl =
    process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return new URL(path, baseUrl).toString();
}
