import { TodoData } from "@/app/(protected)/dashboard/workspace/todo/_types/type"

export type TodoDataStore = {
    setTodoData: (data: TodoData[] | ((prev: TodoData[]) => TodoData[])) => void;
    todoData: TodoData[];
    itemId: string | null;
}