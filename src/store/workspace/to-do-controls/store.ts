import { TodoControlsStore } from "@/store/workspace/to-do-controls/type";
import { create } from "zustand";

export const useTodoControls = create<TodoControlsStore>((set) => ({
  modal: {
    add: false,
  },
  setAddSheetState: (state: boolean) => set(() => ({ modal: { add: state } })),
  activeAddTarget: "todo",
  setActiveAddTarget: (target: "todo" | "inProgress") =>
    set(() => ({ activeAddTarget: target })),
}));
