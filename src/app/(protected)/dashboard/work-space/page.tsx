"use client";

// import Draggable from "@/components/drag-n-drop/draggable";
// import Droppable from "@/components/drag-n-drop/droppable";
import { SortableItem } from "@/components/drag-n-drop/sortable/sortable-item";
import { Card } from "@/components/ui/card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
  DragCancelEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

type Props = object;


export default function Page({}: Props) {

  const [items, setItems] = useState([
    { id: "1", content: "Context to Header for breadcrumb items"},
    { id: "2", content: "An Inner Layout"},
    { id: "3", content: "TO-DO functionality"},
    { id: "4", content: "D"},
    { id: "5", content: "E"},
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragStart(e: DragStartEvent): void {
    setActiveId(() => e.active.id);
  };

  function handleDragCancel(e: DragCancelEvent): void {
    void e
    setActiveId(() => null);
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(() => null);

    const {active, over} = e;

    if(!over) return;
    
    if (active.id !== over?.id) {
      setItems((items) => {

        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <main className="space-y-12">
      <div>Hi, Welcome to the protected page</div>
      <div className="h-fit flex flex-col gap-4 w-full">
        <p>
          Sortable List
        </p>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
        >
          <div className="flex flex-col items-center w-[20rem] p-4 rounded-xl space-y-12 bg-black">
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
                {items.map(sortItem => (
                    <SortableItem key={sortItem.id} id={sortItem.id}>
                      <p className="text-center">
                        {sortItem.content}
                      </p>
                    </SortableItem>
                ))}
            </SortableContext>
            <DragOverlay 
              // adjustScale
              dropAnimation={{
                duration: 150,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)"
              }}
            >
              {activeId && (
                <Card className="w-[90%] flex items-center cursor-grabbing p-4 opacity-80 bg-primary">
                  <p className="text-center">
                    {items.find(item => item.id === activeId)?.content}
                  </p>
                </Card>
              )}
            </DragOverlay>
          </div>
        </DndContext>
      </div>
    </main>
  );
}
