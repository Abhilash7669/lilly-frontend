"use client";

import { JSX, useEffect, useState } from "react";
import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ellipsis, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AXIOS } from "@/lib/api/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type DummyData = {
  id: string;
  title: string;
  items: {
    id: string;
    content: string;
  }[];
};

type Status = "todo" | "inProgress" | "done";

type BasicResponse = {
    success: boolean;
    title: string;
    message: string;
    status_code?: number;
    data?: Record<string, unknown>
} & Record<string, unknown>

function SortableItem({
  id,
  status,
  content,
}: {
  id: string;
  status: Status;
  content: string;
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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`w-full border flex items-center justify-center cursor-grab text-center px-2 ${
        isDragging && "opacity-55 scale-110 cursor-grabbing"
      }`}
    >
      {content}
      <CardFooter>
        <div className="flex items-center gap-3 flex-wrap">
          {status === "inProgress" && (
            <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" /> In
              Progress
            </Badge>
          )}
          {status === "done" && (
            <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />{" "}
              Done
            </Badge>
          )}
          {status === "todo" && (
            <Badge className="bg-primary/10 dark:bg-primary/20 hover:bg-primary/10 text-primary border-primary/60 shadow-none rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" /> To Do
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function Droppable({
  id,
  title,
  items,
}: {
  id: Status;
  title: string;
  items: {
    id: string;
    content: string;
  }[];
}) {
  const { setNodeRef } = useDroppable({ id });
  const totalItems = items && items.length > 0 ? items.length : 0;

  return (
    <Card
      className={`px-4 backdrop-blur-lg backdrop-filter
        ${id === "inProgress" && "bg-purple-600/20"}
        ${id === "todo" && "bg-cyan-600/20"}
        ${id === "done" && "bg-emerald-600/20"}
        `}
      ref={setNodeRef}
    >
      <CardTitle className="mx-auto flex items-center justify-between w-full">
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
      </CardTitle>
      <CardContent className="space-y-4 px-0">
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((task) => (
            <SortableItem
              status={id}
              key={task.id}
              id={task.id}
              content={task.content}
            />
          ))}
        </SortableContext>
      </CardContent>
    </Card>
  );
}

function ItemOverlay({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Card className="w-full border flex items-center justify-center cursor-grabbing text-center px-2">
      {children}
    </Card>
  );
}

export default function Page() {



  const [containers, setContainers] = useState<DummyData[]>([
    {
      id: "todo",
      title: "To Do",
      items: [
        {
          id: "task-c",
          content: "Weather API",
        },
        {
          id: "task-d",
          content: "Clock",
        },
      ],
    },
    {
      id: "inProgress",
      title: "In Progress",
      items: [
        {
          id: "task-b",
          content: "Component Composition for work-space",
        },
        {
          id: "task-e",
          content: "TODO UI, Re-structure and cleanup",
        },
        {
          id: "task-e-0asd",
          content: "Scroll Area for cards",
        },
        {
          id: "task-e-asjhuia",
          content: "Re-structure Card UI(title, desc, status, options)",
        },
        {
          id: "task-e-aasdsjhuia",
          content: "Popup Card to view card details",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      items: [
        {
          id: "task-a",
          content: "Re-structure work-space routes",
        },
        {
          id: "task-blah",
          content: "Cooking Breakfast",
        },
        {
          id: "task-banana",
          content: "Chopping Onions",
        },
      ],
    },
  ]);

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

  const router = useRouter();


  useEffect(() => {

    (async function getTasks() {

      const response: BasicResponse = await AXIOS.get('/tasks/');

      if(!response.success) {

        toast.error(response.title, {
          duration: 3400,
          description: response.message
        });

        if(response.status_code === 401) router.push("/login");

        return;

      }

      toast.success(response.title, {
        duration: 3400,
        description: response.message
      });

    })();

  }, []);


  function findContainerId(
    itemId: UniqueIdentifier
  ): UniqueIdentifier | undefined {
    if (containers.some((container) => container.id === itemId)) {
      return itemId;
    }

    return containers.find((container) =>
      container.items.some((item) => item.id === itemId)
    )?.id;
  }

  function handleDragStart(e: DragStartEvent): void {
    setActiveId(e.active.id);
  }

  function handleDragOver(e: DragOverEvent): void {
    const { active, over } = e;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainerId = findContainerId(activeId);
    const overContainerId = findContainerId(overId);

    if (!activeContainerId || !overContainerId || activeContainerId === overContainerId) return;

    if (activeContainerId === overContainerId && activeId !== overId) return;

    if (activeContainerId === overContainerId) return;

    setContainers((prevState) => {
      const activeContainer = prevState.find((c) => c.id === activeContainerId);

      if (!activeContainer) return prevState;

      const activeItem = activeContainer.items.find(
        (item) => item.id === activeId
      );

      if (!activeItem) return prevState;

      const newContainers = prevState.map((item) => {
        if (item.id === activeContainerId) {
          return {
            ...item,
            items: item.items.filter((item) => item.id !== activeId),
          };
        }

        if (item.id === overContainerId) {
          return {
            ...item,
            items: [...item.items, activeItem],
          };
        }

        const overItemIndex = item.items.findIndex(
          (item) => item.id === overId
        );

        if (overItemIndex !== -1) {
          return {
            ...item,
            items: [
              ...item.items.slice(0, overItemIndex + 1),
              activeItem,
              ...item.items.slice(overItemIndex + 1),
            ],
          };
        }

        return item;
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

    if (!over) {
      setActiveId(() => null);
      return;
    }

    const activeContainerId = findContainerId(active.id);
    const overContainerId = findContainerId(over.id);

    if (!activeContainerId || !overContainerId) {
      setActiveId(() => null);
      return;
    }

    if (activeContainerId === overContainerId && active.id !== over.id) {
      const containerIndex = containers.findIndex(
        (c) => c.id === activeContainerId
      );

      if (containerIndex === -1) {
        setActiveId(() => null);
        return;
      }

      const container = containers[containerIndex];
      const activeIndex = container.items.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = container.items.findIndex(
        (item) => item.id === over.id
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        const newItems = arrayMove(container.items, activeIndex, overIndex);

        setContainers((containers) => {
          return containers.map((c, i) => {
            if (i === containerIndex) {
              return { ...c, items: newItems };
            }
            return c;
          });
        });
      }

      setActiveId(() => null);
    }
  }

  const getActiveItem = () => {
    for (const container of containers) {
      const item = container.items.find((item) => item.id === activeid);
      if (item) return item;
    }
    return null;
  };

  return (
    <div className="space-y-12">
      <div>
        <div>
          <h1 className="text-2xl">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Keep track of your tasks
          </p>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-3 gap-12">
          {containers.map((item) => (
            <Droppable
              key={item.id}
              id={item.id as Status}
              title={item.title}
              items={item.items}
            />
          ))}
        </div>
        <DragOverlay
          dropAnimation={{
            duration: 150,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {activeid && <ItemOverlay>{getActiveItem()?.content}</ItemOverlay>}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
