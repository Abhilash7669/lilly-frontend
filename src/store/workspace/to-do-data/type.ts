import {
  StatusValue,
  TodoData,
  TodoItems,
} from "@/app/(protected)/dashboard/workspace/todo/_types/type";

export type TodoDataStore = {
  setTodoData: (data: TodoData[] | ((prev: TodoData[]) => TodoData[])) => void;
  todoData: TodoData[];
  setActiveItemId: (id: string | null) => void;
  itemId: string | null;
  activeDroppable: StatusValue;
  setActiveDroppable: (target: StatusValue) => void;
  findTaskCompletedAt: (id: string, activeDroppable: StatusValue) => void;
  taskCompletedAt: string | undefined;
  editTaskData: TodoItems | null;
  setEditTaskData: (data: TodoItems | null) => void;
};
