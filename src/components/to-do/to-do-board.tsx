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
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TodoStatus, TodoData } from "@/lib/types/work-space";
import Droppable from "@/app/(protected)/dashboard/workspace/todo/_components/droppable";

type Props = {
  containers: TodoData[];
  setContainers: React.Dispatch<React.SetStateAction<TodoData[]>>;
};

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
