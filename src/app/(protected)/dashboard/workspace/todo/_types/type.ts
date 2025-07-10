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

export type TodoTabList = "over-view" | "board" | "table";

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
};

export type TodoData = {
  status: StatusValue;
  items: TodoItems[];
};

// userId
// 683af7054766364daaa40263
// name
// "Testing"
// summary
// "ANother summary"
// order
// 0
// status
// "todo"
// priority
// "medium"

// tags
// Array (empty)

// subTasks
// Array (empty)
// startDate
// 2025-07-02T00:00:00.000+00:00
// dueDate
// 2025-07-02T23:59:59.999+00:00

export type TaskDTO = {
  name: string;
  summary: string;
  tags: Array<string>;
  priority: "high" | "medium" | "low";
  order: number;
  subTasks: Array<SubTasks> | [];
  status: StatusValue;
  date: {
    startDate: string;
    dueDate: string;
  };
};

export type TaskPayload = {
  task: TaskDTO;
};

export type TaskAddResponse = {
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
      };
    };
  };
};
