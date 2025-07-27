import { useTodoControls } from "@/store/workspace/to-do-ui/store";

// isOpen
export const useSetAddSheetState = () =>
  useTodoControls((state) => state.setAddSheetState);
export const useIsAddSheetOpen = () =>
  useTodoControls((state) => state.modal.add);
export const useSetDeleteModalState = () =>
  useTodoControls((state) => state.setDeleteModal);
export const useDeleteModalState = () =>
  useTodoControls((state) => state.modal.delete);
export const useFilterSheetOpen = () =>
  useTodoControls((state) => state.sheet.filterOpen);
export const useSetFilterSheetOpen = () =>
  useTodoControls((state) => state.setFilterSheetOpen);

// loading
export const useIsAddTodoLoading = () =>
  useTodoControls((state) => state.loading.add);
export const useIsDeleteTodoLoading = () =>
  useTodoControls((state) => state.loading.delete);
export const useSetAddTodoLoading = () =>
  useTodoControls((state) => state.setAddTodoLoading);
export const useSetDeleteTodoLoading = () =>
  useTodoControls((state) => state.setDeleteTodoLoading);

export const useIsFilterLoading = () => useTodoControls(state => state.loading.filter);
export const useSetFilterLoading = () =>
  useTodoControls((state) => state.setFilterLoading);

// async functions
export const useAddTask = () => useTodoControls((state) => state.addTask);
export const useDeleteTask = () => useTodoControls((state) => state.deleteTask);
export const useUpdateTask = () => useTodoControls((state) => state.updateTask);
export const useEditTask = () => useTodoControls((state) => state.editTask);

// detect mode
export const useIsEditTask = () => useTodoControls((state) => state.isEditTask);
export const useSetIsEditTask = () =>
  useTodoControls((state) => state.setIsEditTask);
