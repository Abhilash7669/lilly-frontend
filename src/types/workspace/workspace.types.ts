export type TaskSummaryResponse = {
  summary: {
    totalCount: number;
    todoCount: number;
    inProgressCount: number;
    doneCount: number;
  };
};
