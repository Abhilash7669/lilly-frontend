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
import { TodoItems } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import PriorityBadge from "@/app/(protected)/dashboard/workspace/todo/_components/priority-badge";
import { ICON_SIZE } from "@/lib/utils";
import { format } from "date-fns";
import { useSetDeleteModalState } from "@/store/workspace/to-do-controls";

type Props = {
  data: TodoItems;
};

export default function SortableItem({
  data: { _id, name, summary, subTasks, priority, tags, dueDate, startDate },
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

  const m_startDate = startDate ? format(startDate, "dd MMM yy") : "No start date";
  const m_dueDate = dueDate ? format(dueDate, "dd MMM yy") : "No due date";


  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-card rounded-xl px-6 py-5 rotate-0 shadow-md cursor-grab ${
        isDragging && "cursor-grabbing rotate-2 opacity-80"
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
          <DropdownMenuContent className="p-2 space-y-1">
            <DropdownMenuItem className="cursor-pointer">View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteModal(true)} className="cursor-pointer transition-all focus:bg-destructive/70">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg w-full">{name}</h2>
          {truncatedDesc && (
            <p className="text-muted-foreground text-xs">{truncatedDesc}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <CalendarDays className={ICON_SIZE.medium} />
            <p className="text-xs">{m_startDate} - {m_dueDate}</p>
          </div>
          {hasSubTasks && (
            <div className="w-full flex items-center justify-between">
              <Progress
                className="bg-muted [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:via-sky-500 [&>div]:to-indigo-500 [&>div]:rounded-l-full w-5/6"
                value={parseInt(progress) || 40}
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
