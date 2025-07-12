import { useTodoControls } from "@/store/workspace/to-do-ui/store";

export const useSetAddSheetState = () =>
  useTodoControls((state) => state.setAddSheetState);
export const useIsAddSheetOpen = () =>
  useTodoControls((state) => state.modal.add);
export const useSetDeleteModalState = () =>
  useTodoControls((state) => state.setDeleteModal);
export const useDeleteModalState = () =>
  useTodoControls((state) => state.modal.delete);
export const useIsAddTodoLoading = () => useTodoControls((state) => state.loading.add);
export const useIsDeleteTodoLoading = () => useTodoControls(state => state.loading.delete);
export const useSetAddTodoLoading = () => useTodoControls(state => state.setAddTodoLoading);
export const useSetDeleteTodoLoading = () => useTodoControls(state => state.setDeleteTodoLoading);