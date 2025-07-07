import { useTodoDataStore } from "@/store/workspace/to-do-data/store";


export const useSetTodoData = () => useTodoDataStore(state => state.setTodoData);
export const useTodoData = () => useTodoDataStore(state => state.todoData);
export const useActiveItemId = () => useTodoDataStore(state => state.itemId);
export const useSetActiveItemId = () => useTodoDataStore(state => state.setActiveItemId);