import { TodoControlsStore } from "@/store/workspace/to-do-controls/type";
import { create } from "zustand";

export const useTodoControls = create<TodoControlsStore>((set) => ({
  modal: {
    add: false,
    delete: false
  },
  setAddSheetState: (openState: boolean) => set(state => ({ modal: { add: openState, delete:  state.modal.delete } })),
  setDeleteModal: (openState: boolean) => set(state => ({ modal: ({ add: state.modal.add, delete: openState })})),
  activeAddTarget: "todo",
  setActiveAddTarget: (target: "todo" | "inProgress") =>
    set(() => ({ activeAddTarget: target })),
}));
