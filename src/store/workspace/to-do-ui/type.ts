
export type TodoControlsStore = {
    modal: {
        add: boolean;
        delete: boolean;
    },
    setAddSheetState: (state: boolean) => void;
    setDeleteModal: (state: boolean) => void;
}