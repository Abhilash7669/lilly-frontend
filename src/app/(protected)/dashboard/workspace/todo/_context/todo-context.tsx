"use client";

import React, { createContext, useContext, useState } from "react";

type ContextType = {
  handleTodoModalStates: (key: "add", state: boolean) => void;
  modal: {
    add: {
      isOpen: boolean;
    };
  };
  setDroppableId: React.Dispatch<React.SetStateAction<"todo" | "inProgress">>;
  droppableId: "todo" | "inProgress";
};

const TodoContext = createContext<ContextType | undefined>(undefined);

export function useTodoContext() {
  const ctx = useContext(TodoContext);

  if (!ctx) throw new Error("Can only be used under <TodoProvider>");

  return ctx;
}

export default function TodoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modal, setModal] = useState({
    add: {
      isOpen: false,
    },
  });
  const [droppableId, setDroppableId] = useState<"todo" | "inProgress">("todo");

  function handleTodoModalStates(key: "add", state: boolean): void {
    setModal((prevState) => ({ ...prevState, [key]: { isOpen: state } }));
  }

  const ctxValues = {
    handleTodoModalStates,
    modal,
    setDroppableId,
    droppableId
  };

  return (
    <TodoContext.Provider value={ctxValues}>{children}</TodoContext.Provider>
  );
}
