import { StatusValue } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { LILLY_TODO } from "@/lib/lilly-utils/lilly-utils";
import { TodoDataStore } from "@/store/workspace/to-do-data/type";
import { create } from "zustand";

export const useTodoDataStore = create<TodoDataStore>((set, get) => ({
  setTodoData: (data) =>
    set((state) => ({
      todoData: typeof data === "function" ? data(state.todoData) : data,
    })),
  todoData: [],
  editTaskData: null,
  setEditTaskData: (data) => set(() => ({ editTaskData: data ? data : null })),
  itemId: null,
  setActiveItemId: (id) => set(() => ({ itemId: id })),
  activeDroppable: "todo",
  setActiveDroppable: (target: StatusValue | "") =>
    set(() => ({ activeDroppable: target as StatusValue })),
  taskCompletedAt: undefined,
  findTaskCompletedAt: (id, activeDroppable) => {

    const data = get().todoData;

    function handleSetCompletedAt(result: string | undefined) {
      set(() => ({ taskCompletedAt: result })); 
    }

    if(data.length === 0) {
      handleSetCompletedAt(undefined);
      return;
    };

    const containerIndex = LILLY_TODO.findUpdatedContainerIndex(data, activeDroppable);

    if(containerIndex === -1) {
      handleSetCompletedAt(undefined);
      return;
    };
    
    const completedAt = data[containerIndex].items.find(item => item._id === id)?.completedAt;

    if(!completedAt) {
      handleSetCompletedAt(undefined);
      return;
    };
 
    handleSetCompletedAt(completedAt);

  }
}));
