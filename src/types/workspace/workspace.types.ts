export type TaskSummaryResponse = {
  summary: {
    todo: number;
    inProgress: number;
    done: number;
  };
  total: number;
};
