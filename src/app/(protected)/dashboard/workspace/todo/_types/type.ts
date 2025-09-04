export type TaskPrioritySelectOptionsLabel = "High" | "Medium" | "Low";
export type TaskDTOKey =
  | "name"
  | "summary"
  | "tags"
  | "priority"
  | "order"
  | "subTasks"
  | "date"
  | "status";

export type StatusValue = "todo" | "inProgress" | "done";
export type StatusLabel = "Todo" | "In Progress" | "Done";

export type TodoTabList = "over-view" | "tasks";

export type SubTaskState = {
  isAdding: boolean;
  isEditing: boolean;
};

export type SubTaskMode = "isAdding" | "isEditing";

export type TaskPrioritySelectOptions = {
  label: TaskPrioritySelectOptionsLabel;
  value: Priority;
};

export type TaskStatusSelectOptions = {
  label: StatusLabel;
  value: StatusValue;
};

export type Priority = "high" | "low" | "medium";

export type SubTasks = {
  subTask: string;
  status: boolean;
};

export enum TASK_PRIORITY {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export type PaginatedResult<T> = {
  items: T;
  pagingInfo: PagingInfo;
};

export type PagingInfo = {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
};

export type TodoItems = {
  _id: string;
  name: string;
  summary?: string;
  tags: Array<string>;
  status: StatusValue;
  priority: Priority;
  order: number;
  subTasks: Array<SubTasks>;
  startDate: string;
  dueDate: string;
  completedAt: string;
  deletedAt: string;
};

export type TodoData = {
  status: StatusValue;
  items: TodoItems[];
};

export type TaskDTO = {
  name: string;
  summary: string;
  tags: Array<string>;
  priority: Priority;
  order: number;
  subTasks: Array<SubTasks> | [];
  status: StatusValue;
  date: {
    startDate: string;
    dueDate: string;
  };
  completedAt: string;
  deletedAt: string;
};

export type TaskPayload = {
  task: TaskDTO;
};

export type TaskAddResponse = {
  success: boolean;
  data: {
    task: {
      taskItem: {
        _id: string;
        // userId: string;
        name: string;
        summary: string;
        order: number;
        status: StatusValue;
        priority: Priority;
        tags: Array<string>;
        subTasks: Array<SubTasks>;
        startDate: string;
        dueDate: string;
        completedAt: string;
        deletedAt: string;
      };
    };
  };
};

// ================== //
// Filter
export type TodoFilterType = {
  status: string;
  priority: string;
};
