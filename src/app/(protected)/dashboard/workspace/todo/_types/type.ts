
export type TaskPrioritySelectOptionsLabel = "High" | "Medium" | "Low"

export type TaskPrioritySelectOptions = {
  label: TaskPrioritySelectOptionsLabel,
  value: TASK_PRIORITY
}

export type Priority = "High" | "Low" | "Medium";

export type SubTasks = {
  subTask: string;
  status: boolean;
};

export enum TASK_PRIORITY {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low"
};

export type TodoModalStates = {
  add: {
    isOpen: boolean;
  };
};

export type TodoData = {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    description?: string;
    tags: Array<string>;
    priority: Priority;
    order: number;
    subTasks: Array<SubTasks>;
  }[];
};

export type TodoStatus = "todo" | "inProgress" | "done";

export type TodoTabList = "over-view" | "board" | "table";

export type SubTaskState = {
    isAdding: boolean;
    isEditing: boolean;
}

export type SubTaskMode = "isAdding" | "isEditing";