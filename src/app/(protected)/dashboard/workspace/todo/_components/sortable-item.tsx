"use client";

import { useSortable } from "@dnd-kit/sortable";
import { BsThreeDots } from "react-icons/bs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import {
  StatusValue,
  TodoItems,
} from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import PriorityBadge from "@/components/common/indicator/priority-badge";
import { ICON_SIZE } from "@/lib/utils";
import { format } from "date-fns";
import {
  useSetAddSheetState,
  useSetDeleteModalState,
  useSetIsEditTask,
} from "@/store/workspace/to-do-ui";
import {
  useFindTaskCompletedAt,
  useSetActiveDroppable,
  useSetActiveItemId,
  useSetEditTaskData,
  useTodoData,
} from "@/store/workspace/to-do-data";
import { LILLY_TODO } from "@/lib/lilly-utils/lilly-utils";

type Props = {
  data: TodoItems;
};

export default function SortableItem({
  data: {
    _id,
    name,
    summary,
    subTasks,
    priority,
    tags,
    dueDate,
    startDate,
    status,
  },
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: _id });

  const setDeleteModal = useSetDeleteModalState();
  const setActiveItem = useSetActiveItemId();
  const setActiveDroppable = useSetActiveDroppable();
  const findTaskCompletedAt = useFindTaskCompletedAt();
  const setTaskModal = useSetAddSheetState();
  const setIsEditTask = useSetIsEditTask();
  const setEditTaskData = useSetEditTaskData();
  const data = useTodoData();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const truncatedDesc = summary ? `${summary.slice(0, 60)}.....` : null;

  const hasSubTasks = subTasks && subTasks.length > 0;
  const completedSubTasks = subTasks.filter((item) => item.status).length;
  const totalSubTasks = subTasks.length;

  const progress = ((completedSubTasks / totalSubTasks) * 100).toFixed(1);

  const hasTags = tags.length > 0;

  const m_startDate = startDate
    ? format(startDate, "dd MMM yy")
    : "No start date";
  const m_dueDate = dueDate ? format(dueDate, "dd MMM yy") : "No due date";

  function handleOpenDeleteModal() {
    setActiveItem(_id);
    findTaskCompletedAt(_id, status as StatusValue);
    setDeleteModal(true);
    setActiveDroppable(status as StatusValue);
  }

  function handleOpenEditModal(): void {
    setActiveItem(_id);
    setTaskModal(true);
    const containerIndex = LILLY_TODO.findUpdatedContainerIndex(data, status);
    setIsEditTask(true);

    if (containerIndex !== -1) {
      const editData = data[containerIndex].items.find(
        (item) => item._id === _id
      );
      if (editData) setEditTaskData(editData);
    }
  }

  return (
    <div
      key={_id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`backdrop-blur-lg bg-card/50 rounded-xl px-6 py-5 rotate-0 shadow-md cursor-grab ${
        isDragging && "cursor-grabbing rotate-1"
      }`}
    >
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center justify-center">
          <PriorityBadge variant={priority} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BsThreeDots className="text-sm cursor-pointer transition-all hover:opacity-65" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 space-y-1 backdrop-blur-lg bg-popover/20">
            <DropdownMenuItem
              onClick={handleOpenEditModal}
              className="cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleOpenDeleteModal}
              className="cursor-pointer transition-all focus:bg-destructive/70"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="text-base w-full">{name}</h2>
          {truncatedDesc && (
            <p className="text-muted-foreground text-xs">{truncatedDesc}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className={ICON_SIZE.small} />
            <p className="text-xs">
              {m_startDate} - {m_dueDate}
            </p>
          </div>
          {hasSubTasks && (
            <div className="w-full flex items-center justify-between">
              <Progress
                className="bg-muted [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:via-sky-500 [&>div]:to-indigo-500 [&>div]:rounded-l-full w-5/6"
                value={parseInt(progress) || 4}
              />
              <p className="text-sm text-muted-foreground">{progress}%</p>
            </div>
          )}
        </div>
      </div>
      <Separator className="w-full mt-2" />
      {hasTags && (
        <ul className="flex items-center gap-2 mt-2">
          {tags.map((tag) => (
            <li key={tag}>
              <Badge variant="outline">{tag}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
