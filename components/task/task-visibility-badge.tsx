import { cn } from "@/lib/utils";

type TaskVisibilityBadgeProps = {
  isPublic: boolean;
};

export function TaskVisibilityBadge({ isPublic }: TaskVisibilityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        isPublic
          ? "border-sky-400/30 bg-sky-400/10 text-sky-100"
          : "border-violet-400/30 bg-violet-400/10 text-violet-100",
      )}
    >
      {isPublic ? "公开" : "私人"}
    </span>
  );
}
