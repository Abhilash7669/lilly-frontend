
export type TodoControlsStore = {
    modal: {
        add: boolean
    },
    setAddSheetState: (state: boolean) => void;
    activeAddTarget: "todo" | "inProgress",
    setActiveAddTarget: (target: "todo" | "inProgress") => void;
}