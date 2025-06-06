"use client";

import { useState } from "react";
import {
  DndContext,
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={`w-full border flex items-center justify-center ${
          isDragging && "opacity-55 scale-110"
        }`}
      >
        {content}
      </Card>
    </div>
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
      <Card>
        <CardTitle>{title}</CardTitle>
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
}

export default function Page() {
  const [containers, setContainers] = useState<DummyData[]>([
    {
      id: "todo",
      title: "To Do",
      items: [
        {
          id: "task-1",
          content: "Hello there",
        },
        {
          id: "task-2",
          content: "Buy milk",
        },
        {
          id: "task-3",
          content: "Get groceries",
        },
        {
          id: "task-4",
          content: "Water the plants",
        },
      ],
    },
    {
      id: "inProgress",
      title: "In Progress",
      items: [
        {
          id: "task-a",
          content: "Cleaning the roof",
        },
        {
          id: "task-b",
          content: "Feeding the cats",
        },
      ],
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

  return (
    <div className="space-y-12">
      <p>Multiple Containers</p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
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
        {/* <DragOverlay
          dropAnimation={{
            duration: 150,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          Helo
        </DragOverlay> */}
      </DndContext>
    </div>
  );
}
