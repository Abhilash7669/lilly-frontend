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
    isEditTask: boolean;
    setIsEditTask: (state: boolean) => void;
    setAddSheetState: (state: boolean) => void;
    setDeleteModal: (state: boolean) => void;
    setAddTodoLoading: (state: boolean) => void;
    setDeleteTodoLoading: (state: boolean) => void;
    addTask: ({ taskDTO, activeDroppable }: { taskDTO: TaskDTO, activeDroppable: StatusValue }) => Promise<boolean>;
    deleteTask: ({ activeDroppable, activeItemId, deletedAt, completedAt }: { activeDroppable: StatusValue, activeItemId: string | null, deletedAt: string | undefined, completedAt: string | undefined }) => Promise<void>;
    updateTask: (payload: { id: string, status: StatusValue, order: number, completedAt: string | undefined }[]) => Promise<void>;
    editTask: ({ taskDTO }: { taskDTO: TaskDTO & { id: string } }) => Promise<boolean>
}
