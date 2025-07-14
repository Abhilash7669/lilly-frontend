import {
  TaskAddResponse,
  TaskPayload,
  TodoData,
} from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import { LILLY_TODO } from "@/lib/lilly-utils/lilly-utils";
import { errorToast } from "@/lib/toast/toast-function";
import { BasicResponse } from "@/lib/types/api";
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

    if (!response) {
      toggleAddLoading(false);
      return;
    }

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
    set((state) => ({ modal: { delete: state.modal.delete, add: false } }));
  },
  deleteTask: async function ({ activeDroppable, activeItemId, deletedAt }) {

    if(!activeItemId || !deletedAt) {
      errorToast("Error", `No ${!activeItemId && "activeItemId"} ${!deletedAt && "deletedAt"} detected`);
      return;
    }

    function toggleDeleteLoading(isLoading: boolean) {
      set((state) => ({
        loading: { add: state.loading.add, delete: isLoading },
      }));
    }

    function toggleDeleteModal(isOpen: boolean) {
      set((state) => ({ modal: { add: state.modal.add, delete: isOpen } }));
    }

    toggleDeleteLoading(true);

    const containers = useTodoDataStore.getState().todoData;
    const setContainers = useTodoDataStore.getState().setTodoData;
    const setActiveItemId = useTodoDataStore.getState().setActiveItemId;

    // find container
    const containerIndex = LILLY_TODO.findUpdatedContainerIndex(
      containers,
      activeDroppable
    );

    if (containerIndex === -1) {
      errorToast("Error", "Could not find container Index");
      toggleDeleteLoading(false);
      return;
    }

    const isContainerEmpty = containers[containerIndex].items.length === 0;

    if (isContainerEmpty) {
      errorToast("Error", "Container is empty");
      toggleDeleteLoading(false);
      toggleDeleteModal(false);
      setActiveItemId(null);
      return;
    }

    const containerDeepCopy = [...containers[containerIndex].items];

    const deletedTask = containerDeepCopy.find(
      (item) => item._id === activeItemId
    );

    // find the order of the item
    if (!deletedTask) {
      errorToast("Error", "Could not find task");
      toggleDeleteLoading(false);
      toggleDeleteModal(false);
      setActiveItemId(null);
      return;
    }

    const highestTaskOrder = containerDeepCopy.sort(
      (a, b) => b.order - a.order
    )[0].order;

    const response = await AXIOS_CLIENT.delete<BasicResponse<unknown>>(
      `/tasks/delete/${activeItemId}`,
      {
        params: {
          status: activeDroppable,
          deletedAt: deletedAt
        },
      }
    );

    if (!response) {
      toggleDeleteLoading(false);
      toggleDeleteModal(false);
      setActiveItemId(null);
      return;
    }

    // success - update the order
    /* 
          3 conditions
            - item order is 0
            - item order is highest
            - item order is in between
        */

    setContainers((prevState) => {
      let updatedContainers: TodoData[] = [];

      const filteredItemsArray = prevState[containerIndex].items.filter(
        (item) => item._id !== activeItemId
      );

      // item order is 0 - CONDITION_A
      if (deletedTask.order === 0) {
        const updatedItemsArray = filteredItemsArray.map((task) => {
          if (task.order > 0) {
            return {
              ...task,
              order: task.order - 1,
            };
          }

          return task;
        });

        updatedContainers = prevState.map((item) => {
          if (item.status === activeDroppable) {
            return {
              status: item.status,
              items: updatedItemsArray,
            };
          }
          return item;
        });

        return updatedContainers;
      }

      if (deletedTask.order === highestTaskOrder) {
        // highest order
        const updatedItemsArray = filteredItemsArray.map((task) => {
          if (task.order > 0) {
            return {
              ...task,
              order: task.order - 1,
            };
          }
          return task;
        });

        updatedContainers = prevState.map((item) => {
          if (item.status === activeDroppable) {
            return {
              status: item.status,
              items: updatedItemsArray,
            };
          }

          return item;
        });

        return updatedContainers;
      }

      if (deletedTask.order > 0 && deletedTask.order < highestTaskOrder) {
        const updatedItemsArray = filteredItemsArray.map((task) => {
          if (task.order > deletedTask.order) {
            return {
              ...task,
              order: task.order - 1,
            };
          }

          return task;
        });

        updatedContainers = prevState.map((item) => {
          if (item.status === activeDroppable) {
            return {
              status: item.status,
              items: updatedItemsArray,
            };
          }

          return item;
        });

        return updatedContainers;
      }

      return prevState;
    });
    toggleDeleteLoading(false);
    toggleDeleteModal(false);
    setActiveItemId(null);
  },
  updateTask: async function (payload) {

    console.log(payload, "INSIDE ZUSTAND");

  }
}));
