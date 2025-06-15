"use client";

import { useEffect, useState } from "react";
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
import { Ellipsis, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import { ScrollArea } from "@/components/ui/scroll-area";

type Priority = "High" | "Low" | "Medium";

type TodoData = {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    description?: string;
    tags?: Array<string>;
    priority: Priority;
    order: number;
  }[];
};

type Status = "todo" | "inProgress" | "done";

type BasicResponse = {
  success: boolean;
  title: string;
  message: string;
  status_code?: number;
  data?: Record<string, unknown>;
} & Record<string, unknown>;

function SortableItem({
  id,
  status,
  title,
  description
}: {
  id: string;
  status: Status;
  title: string;
  description?: string;
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`w-full border flex flex-col gap-2 px-2 py-4 bg-secondary items-center justify-center cursor-grab text-center rounded-xl ${
        isDragging && "opacity-55 scale-110 cursor-grabbing"
      }`}
    >
      <div className="">
        <div>
          <h2>
            {title}
          </h2>
          {description && (
            <p>
              {description}
            </p>
          )}
        </div>
      </div>
      <div>
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
      </div>
    </div>
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
    title: string;
    description?: string;
    tags?: Array<string>;
    priority: Priority
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
        <div className={`mx-auto px-4 mb-2 py-2 flex items-center justify-between w-full`}>
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
                    title={task.title}
                    description={task?.description}
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

// function ItemOverlay({ children }: { children: React.ReactNode }): JSX.Element {
//   return (
//     <Card className="w-full border flex items-center justify-center cursor-grabbing text-center px-2">
//       {children}
//     </Card>
//   );
// }

export default function Page() {
  
  const [containers, setContainers] = useState<TodoData[]>([
    {
      id: "todo",
      title: "To Do",
      items: [
        {
          id: "task-c",
          title: "Weather API",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Low",
          order: 0
        },
        {
          id: "task-d",
          title: "Clock",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Medium",
          order: 1
        },
      ],
    },
    {
      id: "inProgress",
      title: "In Progress",
      items: [
        {
          id: "task-b",
          title: "Component Composition for work-space",
          description: "Lorem ipsum description over here, to test it out",
          priority: "High",
          order: 0
        },
        {
          id: "task-e",
          title: "TODO UI, Re-structure and cleanup",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Low",
          order: 1
        },
        {
          id: "task-e-0asd",
          title: "Scroll Area for cards",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Low",
          order: 2
        },
        {
          id: "task-e-asjhuia",
          title: "Re-structure Card UI(title, desc, status, options)",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Medium",
          order: 3
        },
        {
          id: "task-e-aasdsjhuia",
          title: "Popup Card to view card details",
          description: "Lorem ipsum description over here, to test it out",
          priority: "High",
          order: 4
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      items: [
        {
          id: "task-a",
          title: "Re-structure work-space routes",
          description: "Lorem ipsum description over here, to test it out",
          priority: "High",
          order: 0
        },
        {
          id: "task-blah",
          title: "Cooking Breakfast",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Medium",
          order: 1
        },
        {
          id: "task-banana",
          title: "Chopping Onions",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Low",
          order: 2
        },
      ],
    },
  ]);

  const [activeid, setActiveId] = useState<UniqueIdentifier | null>(null);
  void activeid;

  const [onMount, setOnMount] = useState<boolean>(false);

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
    if (!onMount) return setOnMount(() => true);

    (async function getTasks() {
      const response = await AXIOS_CLIENT.get<BasicResponse>("/tasks/");

      if (!response) return;

      if (!response.success) {
        if (response.status_code === 401) router.push("/login");

        return;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMount]);

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

    if (
      !activeContainerId ||
      !overContainerId ||
      activeContainerId === overContainerId
    )
      return;

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

  // const getActiveItem = () => {
  //   for (const container of containers) {
  //     const item = container.items.find((item) => item.id === activeid);
  //     if (item) return item;
  //   }
  //   return null;
  // };

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
        {/* <DragOverlay
          dropAnimation={{
            duration: 150,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {activeid && <ItemOverlay>{getActiveItem()?.content}</ItemOverlay>}
        </DragOverlay> */}
      </DndContext>
    </div>
  );
}
