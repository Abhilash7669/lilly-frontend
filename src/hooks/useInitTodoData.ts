import { TodoData } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useSetTodoData, useTodoData } from "@/store/workspace/to-do-data";
import { useEffect } from "react";


export default function useInitTodoData() {

    const { data } = useAxiosFetch<TodoData[]>("/tasks/", [], "tasks");
    const setTodoData = useSetTodoData();
    const todoData = useTodoData();

    useEffect(() => {

        if(data.length > 0) setTodoData(data);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);



    return {
        setTodoData,
        todoData
    };
    

}