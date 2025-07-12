import { TaskAddResponse, TaskPayload } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import { LILLY_TODO } from "@/lib/lilly-utils/lilly-utils";
import { errorToast } from "@/lib/toast/toast-function";
import { useTodoDataStore } from "@/store/workspace/to-do-data/store";
import { TodoControlsStore } from "@/store/workspace/to-do-ui/type";
import { create } from "zustand";

export const useTodoControls = create<TodoControlsStore>((set) => ({
  modal: {
    add: false,
    delete: false,
  },
  loading: {
    add: false,
    delete: false,
  },
  setAddSheetState: (openState: boolean) =>
    set((state) => ({ modal: { add: openState, delete: state.modal.delete } })),
  setDeleteModal: (openState: boolean) =>
    set((state) => ({ modal: { add: state.modal.add, delete: openState } })),
  setAddTodoLoading: (isLoading: boolean) =>
    set((state) => ({
      loading: { delete: state.loading.delete, add: isLoading },
    })),
  setDeleteTodoLoading: (isDeleting: boolean) =>
    set((state) => ({
      loading: { add: state.loading.add, delete: isDeleting },
    })),
  addTask: async function ({ taskDTO, activeDroppable }) {

    function toggleAddLoading(isLoading: boolean) {
      set((state) => ({
        loading: { delete: state.loading.delete, add: isLoading },
      }));
    }

    toggleAddLoading(true);

    const containers = useTodoDataStore.getState().todoData;
    const setContainers = useTodoDataStore.getState().setTodoData;

    const containerIndex = LILLY_TODO.findUpdatedContainerIndex(
      containers,
      activeDroppable
    );

    if (containerIndex === -1) {
      errorToast("Error", "Could not find item");
      toggleAddLoading(false);
      return;
    }

    // check if it is empty;
    const isContainerEmpty = containers[containerIndex].items.length === 0;

    let order: number;

    const containerDeepCopy = [...containers[containerIndex].items];

    if (isContainerEmpty) {
      order = 0;
    } else {
      order = containerDeepCopy.sort((a, b) => b.order - a.order)[0].order + 1;
    }

    const payload = {
      ...taskDTO,
      order: order,
    };

    const response = await AXIOS_CLIENT.post<TaskPayload, TaskAddResponse>(
      "/tasks/add",
      { task: payload }
    );

    if(!response) {
      toggleAddLoading(false);
      return;
    };

    const data = response.data.task.taskItem;
    setContainers((prevState) => {

      return prevState.map((container) => {
        if (container.status === activeDroppable) {
          return {
            status: container.status,
            items: [...container.items, data],
          };
        }

        return container;
      });
    });

    toggleAddLoading(false);
    set(state => ({ modal: { delete: state.modal.delete, add: false }}));

  },
}));
