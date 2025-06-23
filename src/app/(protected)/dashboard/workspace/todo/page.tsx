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
        {
          id: "task-asda",
          title: "New TAak",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Medium",
          order: 2
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


  function findContainerId(itemId: UniqueIdentifier): UniqueIdentifier | undefined {
    
    // return the container id;
    if(containers.some(container => container.id === itemId)) return itemId;

    return containers.find(
      container => container.items.some(item => item.id === itemId)
    )?.id

  }

  function handleDragStart(e: DragStartEvent): void {
    setActiveId(e.active.id);
  }


  function handleDragOver(e: DragOverEvent): void {

    const { active, over } = e;

    if(!active || !over) return;

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

    if((!activeContainerId || !overContainerId) || (activeContainerId === overContainerId)) return;
    if(activeId === overId) return;

    setContainers((prevState) => {

      const originalContainer = prevState.find(c => c.id === activeContainerId);

      if(!originalContainer) return prevState;

      const originalItem = originalContainer.items.find(item => item.id === activeId);

      if(!originalItem) return prevState;


      const newContainers = prevState.map((container) => {

        if(container.id === activeContainerId) {
          return {
            ...container,
            items: container.items.filter(item => item.id !== activeId)
          }
        };

        if(container.id === overContainerId) {
          return {
            ...container,
            items: [...container.items, originalItem]
          }
        };

        const overIndex = container.items.findIndex(item => item.id === overId);

        if(overIndex !== -1) {
          return {
            ...container,
            items: [
              ...container.items.slice(0, overIndex + 1),
              originalItem,
              ...container.items.slice(overIndex + 1)
            ]
          }
        };

        return container;

      });

      return newContainers;

    });



  } 

  function handleDragCancel(e: DragCancelEvent): void {
    void e;

    setActiveId(() => null);
  };

  function handleDragEnd(e: DragEndEvent): void {

    const { active, over } = e;

    if(!active || !over) {
      setActiveId(() => null);
      return;
    }
    
    const activeId = active.id;
    const overId = over.id;

    const activeContainerId = findContainerId(activeId);
    const overContainerId = findContainerId(overId);


    if((activeContainerId === overContainerId) && (activeId !== overId)) {

      const containerIndex = containers.findIndex(container => container.id === overContainerId);

      if(containerIndex === -1) {
        setActiveId(() => null);
        return;
      };

      const targetContainer = containers[containerIndex];

      const activeIndex = targetContainer.items.findIndex(item => item.id === activeId);
      const overIndex = targetContainer.items.findIndex(item => item.id === overId);

      if((activeIndex !== -1) && (overIndex !== -1)) {

        const newArray = arrayMove(targetContainer.items, activeIndex, overIndex);

        setContainers((prevState) => {

          return prevState.map((c, index) => {

            if(index === containerIndex) {

              const m_newArray = newArray.map((item, i) => {

                if(i === overIndex) {
                  return {
                    ...item,
                    order: i
                  }
                }

                if(i >= (overIndex + 1)) {
                  return {
                    ...item,
                    order: item.order + 1
                  }
                };

                if((i <= (overIndex - 1)) && (i !== 0)) {
                  return {
                    ...item,
                    order: item.order -1 
                  }
                };

                return item;

              });


              return {
                ...c,
                items: m_newArray
              };

            };


            // reset the order for the activeContainerId

            const m_resetArray = c.items.map((item, i) => {


              if(i === 0) {
                return {
                  ...item
                }
              };

              return {
                ...item,
                order: i
              };

            });

            return {
              ...c,
              items: m_resetArray
            }
            
          });

        });

      };

    }


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
