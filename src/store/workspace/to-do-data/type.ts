import {
  StatusValue,
  TodoData,
} from "@/app/(protected)/dashboard/workspace/todo/_types/type";

export type TodoDataStore = {
  setTodoData: (data: TodoData[] | ((prev: TodoData[]) => TodoData[])) => void;
  todoData: TodoData[];
  setActiveItemId: (id: string) => void;
  itemId: string | null;
  activeDroppable: StatusValue | "";
  setActiveDroppable: (target: StatusValue | "") => void;
};
