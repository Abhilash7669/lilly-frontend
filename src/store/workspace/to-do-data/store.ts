import { StatusValue } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { TodoDataStore } from "@/store/workspace/to-do-data/type";
import { create } from "zustand";

export const useTodoDataStore = create<TodoDataStore>((set) => ({
  setTodoData: (data) =>
    set((state) => ({
      todoData: typeof data === "function" ? data(state.todoData) : data,
    })),
  todoData: [],
  itemId: null,
  setActiveItemId: (id) => set(() => ({ itemId: id })),
  activeDroppable: "todo",
  setActiveDroppable: (target: StatusValue) =>
    set(() => ({ activeDroppable: target })),
}));
