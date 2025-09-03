import { TodoData } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useSetTodoData, useTodoData } from "@/store/workspace/to-do-data";
import { useEffect } from "react";

type Props = {
  hasData: boolean;
};

export default function useInitTodoData({ hasData }: Props) {
  const axiosParams = {
    endpoint: "/tasks/",
    initialState: [],
    dataKey: "tasks",
    hasData: hasData,
  };
  const { data, loading } = useAxiosFetch<TodoData[]>(axiosParams);
  const setTodoData = useSetTodoData();
  const todoData = useTodoData();

  useEffect(() => {
    if (data.length > 0) setTodoData(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    setTodoData,
    todoData,
    loading,
  };
}
