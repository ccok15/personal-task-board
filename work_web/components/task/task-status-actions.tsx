import { SubmitButton } from "@/components/common/submit-button";
import { Button } from "@/components/ui/button";
import { taskStatusMeta, type TaskStatusValue } from "@/lib/constants";
import { updateTaskStatusAction } from "@/lib/actions/task-actions";

type TaskStatusActionsProps = {
  taskId: string;
  currentStatus: TaskStatusValue;
  canManageAllStatuses: boolean;
};

const manageableStatuses: TaskStatusValue[] = [
  "IN_PROGRESS",
  "BLOCKED",
  "PENDING",
  "PAUSED",
  "DONE",
];

export function TaskStatusActions({
  taskId,
  currentStatus,
  canManageAllStatuses,
}: TaskStatusActionsProps) {
  if (!canManageAllStatuses) {
    if (currentStatus === "PAUSED") {
      return (
        <Button className="w-full sm:w-auto" disabled size="sm" variant="ghost">
          已搁置
        </Button>
      );
    }

    return (
      <form className="w-full sm:w-auto" action={updateTaskStatusAction.bind(null, taskId, "PAUSED")}>
        <SubmitButton className="w-full sm:w-auto" pendingLabel="处理中..." size="sm">
          搁置
        </SubmitButton>
      </form>
    );
  }

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
      {manageableStatuses.map((status) => (
        <form
          key={status}
          className="w-full sm:w-auto"
          action={updateTaskStatusAction.bind(null, taskId, status)}
        >
          <SubmitButton
            className="w-full sm:w-auto"
            disabled={status === currentStatus}
            pendingLabel="处理中..."
            size="sm"
            variant={status === currentStatus ? "ghost" : "secondary"}
          >
            {taskStatusMeta[status].label}
          </SubmitButton>
        </form>
      ))}
    </div>
  );
}
