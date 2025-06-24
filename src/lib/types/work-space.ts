export type Priority = "High" | "Low" | "Medium";

export type TodoData = {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    description?: string;
    tags?: Array<string>;
    priority: Priority;
    order: number;
  }[];
};

export type TodoStatus = "todo" | "inProgress" | "done";

export type TodoTabList = "over-view" | "board";