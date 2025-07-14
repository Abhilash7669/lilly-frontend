"use client";

import { Ellipsis, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/app/(protected)/dashboard/workspace/todo/_components/sortable-item";
import { StatusValue, TodoData } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import {
  useSetAddSheetState,
} from "@/store/workspace/to-do-ui";
import { useSetActiveDroppable } from "@/store/workspace/to-do-data";

type Props = {
  data: TodoData;
};

export default function Droppable({ data: { status, items } }: Props) {
  const setAddSheetState = useSetAddSheetState();
  const setActiveDroppable = useSetActiveDroppable();

  const { setNodeRef } = useDroppable({ id: status });
  const totalItems = items && items.length > 0 ? items.length : 0;

  //   ${id === "inProgress" && "bg-purple-600/20"}
  // ${id === "todo" && "bg-cyan-600/20"}
  // ${id === "done" && "bg-emerald-600/20"}

  // backdrop-blur-lg backdrop-filter
  function handleOpenSheet() {
    setAddSheetState(true);
    setActiveDroppable(status as StatusValue);
  }

  return (
    <div className="pb-4 pt-2 h-fit">
      <div
        className={`py-4 rounded-xl border dark:hover:bg-black hover:bg-muted transition-all
        `}
        ref={setNodeRef}
      >
        <div
          className={`mx-auto px-4 mb-2 py-2 flex items-center justify-between w-full`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full 
            ${status === "todo" && "bg-amber-300"}
            ${status === "inProgress" && "bg-primary"}
            ${status === "done" && "bg-green-500"}
          `}
            ></span>
            {status === "todo" && <p className="text-xs">To-do</p>}
            {status === "inProgress" && <p className="text-xs">In Progress</p>}
            {status === "done" && <p className="text-xs">Done</p>}
            {/* <Badge className="rounded-full border-none bg-gradient-to-r from-sky-500 to-indigo-600"> */}
            <p className="text-xs">{totalItems}</p>
            {/* </Badge> */}
          </div>
          <div className="flex items-center gap-2">
            {status !== "done" && (
              <Plus
                onClick={handleOpenSheet}
                className="cursor-pointer active:scale-75 hover:opacity-60 transition-all"
                size={16}
              />
            )}
            <Ellipsis className="cursor-pointer" size={16} />
          </div>
        </div>
        <div className="px-4">
          <SortableContext
            items={items.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            <ScrollArea className="h-[22rem] lg:h-[calc(100dvh-17.2rem)] flex rounded-xl">
              <div className="space-y-4 h-full">
                {items.map((task) => (
                  <SortableItem key={task._id} data={task} />
                ))}
              </div>
            </ScrollArea>
          </SortableContext>
        </div>
      </div>
    </div>
  );
}
