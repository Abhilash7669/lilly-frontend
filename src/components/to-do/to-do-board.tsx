"use client";

import { useState } from "react";
import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, Ellipsis, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Priority, TodoStatus, TodoData } from "@/lib/types/work-space";
import { BsThreeDots } from "react-icons/bs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Props = {
  containers: TodoData[];
  setContainers: React.Dispatch<React.SetStateAction<TodoData[]>>;
};

function SortableItem({
  id,
  status,
  title,
  description,
  subTasks,
  priority
}: {
  id: string;
  status: TodoStatus;
  title: string;
  description?: string;
  priority: Priority;
  subTasks: Array<{
    status: boolean;
    subTask: string;
  }>;
}) {
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
      <div className="w-full flex items-center justify-end">
        <p className="hidden">
          {status}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BsThreeDots className="text-xl cursor-pointer transition-all hover:opacity-65" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 space-y-1">
            <DropdownMenuItem className="cursor-pointer">
              View
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer bg-destructive transition-all focus:bg-destructive/70">
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
      <div className="mt-4 flex items-center gap-2">
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
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1" /> {priority} Priority
            </Badge>
          )}
      </div>
    </div>
  );
}

function Droppable({
  id,
  title,
  items,
}: {
  id: TodoStatus;
  title: string;
  items: {
    id: string;
    title: string;
    description?: string;
    tags?: Array<string>;
    subTasks: Array<{
      status: boolean;
      subTask: string;
    }>;
    priority: Priority;
  }[];
}) {
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

export default function TodoBoard({ containers, setContainers }: Props) {
  const [activeid, setActiveId] = useState<UniqueIdentifier | null>(null);
  void activeid;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  function findContainerId(
    itemId: UniqueIdentifier
  ): UniqueIdentifier | undefined {
    // return the container id;
    if (containers.some((container) => container.id === itemId)) return itemId;

    return containers.find((container) =>
      container.items.some((item) => item.id === itemId)
    )?.id;
  }

  function handleDragStart(e: DragStartEvent): void {
    setActiveId(e.active.id);
  }

  function handleDragOver(e: DragOverEvent): void {
    const { active, over } = e;

    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainerId = findContainerId(activeId);
    const overContainerId = findContainerId(overId);

    /* 

      When drag over
        - Find original container of activeItem
        - Find activeItem in original container

        - Remove activeItem from original container
        - Append activeItem to the new container and update it's position;
    
    */

    // defensive checks

    if (
      !activeContainerId ||
      !overContainerId ||
      activeContainerId === overContainerId
    )
      return;
    if (activeId === overId) return;

    setContainers((prevState) => {
      const originalContainer = prevState.find(
        (c) => c.id === activeContainerId
      );

      if (!originalContainer) return prevState;

      const originalItem = originalContainer.items.find(
        (item) => item.id === activeId
      );

      if (!originalItem) return prevState;

      const newContainers = prevState.map((container) => {
        if (container.id === activeContainerId) {
          return {
            ...container,
            items: container.items.filter((item) => item.id !== activeId),
          };
        }

        if (container.id === overContainerId) {
          return {
            ...container,
            items: [...container.items, originalItem],
          };
        }

        const overIndex = container.items.findIndex(
          (item) => item.id === overId
        );

        if (overIndex !== -1) {
          return {
            ...container,
            items: [
              ...container.items.slice(0, overIndex + 1),
              originalItem,
              ...container.items.slice(overIndex + 1),
            ],
          };
        }

        return container;
      });

      return newContainers;
    });
  }

  function handleDragCancel(e: DragCancelEvent): void {
    void e;

    setActiveId(() => null);
  }

  function handleDragEnd(e: DragEndEvent): void {
    const { active, over } = e;

    if (!active || !over) {
      setActiveId(() => null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeContainerId = findContainerId(activeId);
    const overContainerId = findContainerId(overId);

    if (activeContainerId === overContainerId && activeId !== overId) {
      const containerIndex = containers.findIndex(
        (container) => container.id === overContainerId
      );

      if (containerIndex === -1) {
        setActiveId(() => null);
        return;
      }

      const targetContainer = containers[containerIndex];

      const activeIndex = targetContainer.items.findIndex(
        (item) => item.id === activeId
      );
      const overIndex = targetContainer.items.findIndex(
        (item) => item.id === overId
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        const newArray = arrayMove(
          targetContainer.items,
          activeIndex,
          overIndex
        );

        setContainers((prevState) => {
          return prevState.map((c, index) => {
            if (index === containerIndex) {
              const m_newArray = newArray.map((item, i) => {
                if (i === overIndex) {
                  return {
                    ...item,
                    order: i,
                  };
                }

                if (i >= overIndex + 1) {
                  return {
                    ...item,
                    order: item.order + 1,
                  };
                }

                if (i <= overIndex - 1 && i !== 0) {
                  return {
                    ...item,
                    order: item.order - 1,
                  };
                }

                return item;
              });

              return {
                ...c,
                items: m_newArray,
              };
            }

            // reset the order for the activeContainerId

            const m_resetArray = c.items.map((item, i) => {
              if (i === 0) {
                return {
                  ...item,
                };
              }

              return {
                ...item,
                order: i,
              };
            });

            return {
              ...c,
              items: m_resetArray,
            };
          });
        });
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-3 gap-12">
        {containers.map((item) => {
          if (item.items.length === 0) return null;
          return (
            <Droppable
              key={item.id}
              id={item.id as TodoStatus}
              title={item.title}
              items={item.items}
            />
          );
        })}
      </div>
      {/* <DragOverlay
              dropAnimation={{
                duration: 150,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
              }}
            >
              {activeid && <ItemOverlay>{getActiveItem()?.content}</ItemOverlay>}
            </DragOverlay> */}
    </DndContext>
  );
}
