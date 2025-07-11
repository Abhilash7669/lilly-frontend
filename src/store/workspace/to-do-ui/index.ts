import { useTodoControls } from "@/store/workspace/to-do-ui/store";

export const useSetAddSheetState = () =>
  useTodoControls((state) => state.setAddSheetState);
export const useIsAddSheetOpen = () =>
  useTodoControls((state) => state.modal.add);
export const useSetDeleteModalState = () =>
  useTodoControls((state) => state.setDeleteModal);
export const useDeleteModalState = () =>
  useTodoControls((state) => state.modal.delete);
