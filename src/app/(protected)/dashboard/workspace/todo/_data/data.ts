import { TASK_PRIORITY, TaskPrioritySelectOptions, TaskStatusSelectOptions } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { ListChecks, LucideProps, Target } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const TAB_LIST: {
  value: string;
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}[] = [
  { value: "over-view", label: "Overview", icon: Target },
  { value: "tasks", label: "Tasks", icon: ListChecks },
];


export const PRIORITY_SELECT_OPTIONS: TaskPrioritySelectOptions[] = [
  {
    label: "High",
    value: TASK_PRIORITY.HIGH
  },
  {
    label: "Medium",
    value: TASK_PRIORITY.MEDIUM
  },
  {
    label: "Low",
    value: TASK_PRIORITY.LOW
  }
]

export const STATUS_SELECT_OPTIONS: TaskStatusSelectOptions[] = [
  {
    label: "Todo",
    value: "todo"
  },
  {
    label: "In Progress",
    value: "inProgress"
  }
];

export const ADD_TASK_HEADER: { title: string; description: string } = {
  title: "Create Task",
  description:
    "Stay organized and track your progress efficiently.",
};

export const EMPTY_SUB_TASK_TEXT = "Add Subtasks to organize work within your work-space and break it into more granular steps";