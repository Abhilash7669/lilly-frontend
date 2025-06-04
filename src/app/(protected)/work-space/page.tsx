"use client";

import Draggable from "@/components/drag-n-drop/draggable";
import Droppable from "@/components/drag-n-drop/droppable";
import { DndContext } from "@dnd-kit/core";
import { useState } from "react";

type Props = object;

type ContainerItemType = {
  id: "toDO" | "inProgress" | "done";
  name: string;
};

export default function Page({}: Props) {
  const containers = [
    { id: "toDO", name: "Todo" },
    { id: "inProgress", name: "In Progress" },
    { id: "done", name: "Done" },
  ];
  const [containerItems] = useState<ContainerItemType[]>([
    {
      id: "toDO",
      name: "Workout",
    },
    {
      id: "inProgress",
      name: "Project-Lilly",
    },
    {
      id: "toDO",
      name: "Kick ass at work",
    },
    {
      id: "done",
      name: "Learn DnD kit",
    },
    {
      id: "done",
      name: "MongoDB for today",
    },
    {
      id: "inProgress",
      name: "Build this Todo V1",
    },
  ]);

  function handleDragEnd(): void {
    // if (e.over && e.over.id && e.active) {
    //   console.log(e.over.id, )
    //   setContainerItems((prevState) => {
        
    //     const findIndex = prevState.findIndex(
    //       (item) => item.name === e.active.id
    //     );

    //     if (findIndex !== -1) {
    //       const updatedArray = prevState.map((item, i) => {
    //         if (i === findIndex)
    //           return { ...item, id: e.over?.id ? e.over.id : item.id };

    //         return item;
    //       });

    //       return updatedArray;
    //     }

    //     return prevState;
    //   });
    // }
  }

  return (
    <main className="p-6 space-y-12">
      <div>Hi, Welcome to the protected page</div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex items-center gap-12">
          {containers.map((item) => (
            <Droppable key={item.name} id={item.id}>
              <p>{item.name}</p>
              {containerItems.map((_item) => {
                if (_item.id === item.id)
                  return (
                    <Draggable key={_item.name} id={_item.name}>
                      {_item.name}
                    </Draggable>
                  );
              })}
            </Droppable>
          ))}
        </div>
      </DndContext>
    </main>
  );
}
