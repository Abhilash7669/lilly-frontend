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
export const useAddTask = () => useTodoControls(state => state.addTask);
export const useDeleteTask = () => useTodoControls(state => state.deleteTask);
export const useUpdateTask = () => useTodoControls(state => state.updateTask);
export const useEditTask = () => useTodoControls(state => state.editTask);

export const useIsEditTask = () => useTodoControls(state => state.isEditTask);
export const useSetIsEditTask = () => useTodoControls(state => state.setIsEditTask);
