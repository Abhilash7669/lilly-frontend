import { TodoControlsStore } from "@/store/workspace/to-do-ui/type";
import { create } from "zustand";

export const useTodoControls = create<TodoControlsStore>((set) => ({
  modal: {
    add: false,
    delete: false,
  },
  loading: {
    add: false,
    delete: false
  },
  setAddSheetState: (openState: boolean) =>
    set((state) => ({ modal: { add: openState, delete: state.modal.delete } })),
  setDeleteModal: (openState: boolean) =>
    set((state) => ({ modal: { add: state.modal.add, delete: openState } })),
  setAddTodoLoading: (isLoading: boolean) => set((state) => ({ loading: { delete: state.loading.delete , add: isLoading }})),
  setDeleteTodoLoading: (isDeleting: boolean) => set((state) => ({ loading: { add: state.loading.add, delete: isDeleting }}))
}));
