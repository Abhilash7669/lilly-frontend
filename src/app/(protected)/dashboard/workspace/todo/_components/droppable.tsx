"use client";

import { Ellipsis, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Priority, TodoStatus } from "@/lib/types/work-space";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "@/app/(protected)/dashboard/workspace/todo/_components/sortable-item";

type Props = {
  id: TodoStatus;
  title: string;
  items: {
    id: string;
    title: string;
    description?: string;
    tags: Array<string>;
    subTasks: Array<{
      status: boolean;
      subTask: string;
    }>;
    priority: Priority;
  }[];
};

export default function Droppable({
  id,
  title,
  items,
}: Props) {

  const { setNodeRef } = useDroppable({ id });
  const totalItems = items && items.length > 0 ? items.length : 0;

  return (
    <div className="py-4 h-fit">
      <div
        className={`py-4 rounded-xl backdrop-blur-lg backdrop-filter 
          ${id === "inProgress" && "bg-purple-600/20"}
          ${id === "todo" && "bg-cyan-600/20"}
          ${id === "done" && "bg-emerald-600/20"}
        `}
        ref={setNodeRef}
      >
        <div
          className={`mx-auto px-4 mb-2 py-2 flex items-center justify-between w-full`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full 
            ${id === "todo" && "bg-amber-300"}
            ${id === "inProgress" && "bg-primary"}
            ${id === "done" && "bg-green-500"}
          `}
            ></span>
            {title}
            <Badge className="rounded-full border-none bg-gradient-to-r from-sky-500 to-indigo-600 text-white">
              {totalItems}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="cursor-pointer" size={16} />
            <Ellipsis className="cursor-pointer" size={16} />
          </div>
        </div>
        <div className="px-4">
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <ScrollArea className="h-[calc(100dvh-22rem)] flex rounded-xl">
              <div className="space-y-6 h-full">
                {items.map((task) => (
                  <SortableItem
                    status={id}
                    key={task.id}
                    id={task.id}
                    subTasks={task.subTasks}
                    title={task.title}
                    description={task?.description}
                    priority={task.priority}
                    tags={task.tags}
                  />
                ))}
              </div>
            </ScrollArea>
          </SortableContext>
        </div>
      </div>
    </div>
  );
}
