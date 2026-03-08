import { cn } from "@/lib/utils";

type TaskVisibilityBadgeProps = {
  isPublic: boolean;
};

export function TaskVisibilityBadge({ isPublic }: TaskVisibilityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        isPublic ? "visibility-badge--public" : "visibility-badge--private",
      )}
    >
      {isPublic ? "公开" : "私人"}
    </span>
  );
}
