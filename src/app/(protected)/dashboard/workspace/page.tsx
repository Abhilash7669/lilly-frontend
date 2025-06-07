"use client";

import { JSX, useState } from "react";
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
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type DummyData = {
  id: string;
  title: string;
  items: {
    id: string;
    content: string;
  }[];
};

function TempSortableItem({ id, content }: { id: string; content: string }) {
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
      className={`w-full border flex items-center justify-center cursor-grab text-center p-2 ${
        isDragging && "opacity-55 scale-110 cursor-grabbing"
      }`}
    >
      {content}
    </Card>
  );
}

function TempDroppable({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: {
    id: string;
    content: string;
  }[];
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="p-6" ref={setNodeRef}>
      <Card className="">
        <CardTitle className="mx-auto">{title}</CardTitle>
        <CardContent className="space-y-4">
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((task) => (
              <TempSortableItem
                key={task.id}
                id={task.id}
                content={task.content}
              />
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
};

function ItemOverlay({ children }: { children: React.ReactNode }): JSX.Element {
  return(
     <Card
      className="w-full border flex items-center justify-center cursor-grabbing text-center p-2"
    >
      {children}
    </Card>
  )
}

export default function Page() {
  const [containers, setContainers] = useState<DummyData[]>([
    {
      id: "todo",
      title: "To Do",
      items: [
        {
          id: "task-a",
          content: "List Items in work-space(to-do, notes, etc)",
        },
        {
          id: "task-b",
          content: "Component Composition for work-space",
        },
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
      items: [],
    },
    {
      id: "done",
      title: "Done",
      items: [
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

    if (!activeContainerId || !overContainerId) return;

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
  };

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
  };

  const getActiveItem = () => {
    for(const container of containers) {
      const item = container.items.find(
        item => item.id === activeid
      );
      if(item) return item;
    }
    return null;
  }

  return (
    <div className="space-y-12">
      <p>Multiple Containers</p>
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
            <TempDroppable
              key={item.id}
              id={item.id}
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
          {activeid && (
            <ItemOverlay>
              {getActiveItem()?.content}
            </ItemOverlay>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
