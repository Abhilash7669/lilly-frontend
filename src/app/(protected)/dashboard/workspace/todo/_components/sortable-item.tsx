"use client";

import { Priority, TodoStatus } from "@/lib/types/work-space";
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



type Props = {
    id: string;
    status: TodoStatus;
    title: string;
    description?: string;
    priority: Priority;
    tags: Array<string>;
    subTasks: Array<{
        status: boolean;
        subTask: string;
    }>;
}

export default function SortableItem({
  id,
  status,
  title,
  description,
  subTasks,
  priority,
  tags
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const truncatedDesc = description ? `${description.slice(0, 60)}.....` : null;

  const completedSubTasks = subTasks.filter((item) => item.status).length;
  const totalSubTasks = subTasks.length;

  const progress = ((completedSubTasks / totalSubTasks) * 100).toFixed(1);

  const hasTags = tags.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-card rounded-xl px-6 py-5 rotate-0 shadow border cursor-grab ${
        isDragging && "cursor-grabbing rotate-2 opacity-80"
      }`}
    >
      <div className="w-full flex items-center justify-between mb-2">
        <p className="hidden">{status}</p>
        <div className="flex items-center justify-center">
          {priority === "Medium" && (
            <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />
              {priority} Priority
            </Badge>
          )}
          {priority === "Low" && (
            <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />{" "}
              {priority} Priority
            </Badge>
          )}
          {priority === "High" && (
            <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 border-red-600/60 text-red-500 shadow-none rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1" />{" "}
              {priority} Priority
            </Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BsThreeDots className="text-xl cursor-pointer transition-all hover:opacity-65" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 space-y-1">
            <DropdownMenuItem className="cursor-pointer">View</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer transition-all focus:bg-destructive/70">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl w-full">{title}</h2>
          {truncatedDesc && (
            <p className="text-muted-foreground text-sm">{truncatedDesc}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <CalendarDays size={20} />
            <p className="text-sm">June 25th</p>
          </div>
          <div className="w-full flex items-center justify-between">
            <Progress
              className="bg-muted [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:via-sky-500 [&>div]:to-indigo-500 [&>div]:rounded-l-full w-5/6"
              value={parseInt(progress) || 40}
            />
            <p className="text-sm text-muted-foreground">{progress}%</p>
          </div>
        </div>
      </div>
      <Separator className="w-full mt-2" />
      {hasTags && (
        <ul className="flex items-center gap-2 mt-2">
          {tags.map(tag => (
            <li key={tag}>
              <Badge variant="outline">
                {tag}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}