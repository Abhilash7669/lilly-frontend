import { useTodoControls } from "@/store/workspace/to-do-controls/store";

export const useSetAddSheetState = () =>
  useTodoControls((state) => state.setAddSheetState);
export const useIsAddSheetOpen = () =>
  useTodoControls((state) => state.modal.add);
export const useSetActiveDroppable = () =>
  useTodoControls((state) => state.setActiveAddTarget);
export const useActiveDroppable = () =>
  useTodoControls((state) => state.activeAddTarget);
