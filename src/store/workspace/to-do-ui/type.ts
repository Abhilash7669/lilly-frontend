import { StatusValue, TaskDTO } from "@/app/(protected)/dashboard/workspace/todo/_types/type";

export type TodoControlsStore = {
    modal: {
        add: boolean;
        delete: boolean;
    }
    loading: {
        add: boolean;
        delete: boolean;
    };
    setAddSheetState: (state: boolean) => void;
    setDeleteModal: (state: boolean) => void;
    setAddTodoLoading: (state: boolean) => void;
    setDeleteTodoLoading: (state: boolean) => void;
    addTask: ({ taskDTO, activeDroppable }: { taskDTO: TaskDTO, activeDroppable: StatusValue }) => Promise<void>;
    deleteTask: ({ activeDroppable, activeItemId }: { activeDroppable: StatusValue, activeItemId: string | null }) => Promise<void>;
}