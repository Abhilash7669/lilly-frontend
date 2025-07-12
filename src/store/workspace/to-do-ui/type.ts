
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
}