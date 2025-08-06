"use client";

import {
  TaskTable,
  taskTableColumns,
} from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-columns";
import { TodoData } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { DataTable as WorkspaceTable } from "@/components/common/table/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import {
  useSetFilterLoading,
  useSetFilterSheetOpen,
} from "@/store/workspace/to-do-ui";
import { useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

export default function TodoTable() {
  const [tableData, setTableData] = useState<TaskTable[] | null>(null);

  const setFilterSheetOpen = useSetFilterSheetOpen();
  const setIsFilterLoading = useSetFilterLoading();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const priority = searchParams.get("priority");

  const { data, loading } = useAxiosFetch<TodoData[]>(
    "/tasks/",
    [],
    "tasks",
    false,
    {
      status: status || "",
      priority: priority || "",
    },
    [status, priority]
  );

  useEffect(() => {
    if (!loading && data.length === 0) setTableData([]);

    function handleInvokeTableData(data: TodoData[]): void {
      const m_data = data.flatMap((item) => item.items);
      setTableData(() => {
        const _data = m_data.map((item) => ({
          id: item._id,
          name: item.name,
          priority: item.priority,
          status: item.status,
          startDate: new Date(item.startDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          dueDate: new Date(item.dueDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        }));

        return _data;
      });
      setFilterSheetOpen(false);
      setIsFilterLoading(false);
    }
    handleInvokeTableData(data);
  }, [data]);


  if (loading) return <Skeleton className="h-[calc(100dvh-10rem)] w-full" />;

  if (!loading && data.length === 0 && !tableData)
    return <p>No table data found</p>;

  return (
    <WorkspaceTable<TaskTable>
      columns={taskTableColumns}
      data={tableData || []}
    />
  );
}
