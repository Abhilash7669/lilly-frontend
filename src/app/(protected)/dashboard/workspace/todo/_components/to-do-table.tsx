"use client";

import {
  TaskTable,
  taskTableColumns,
} from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-columns";
import {
  TodoItems,
} from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { DataTable as WorkspaceTable } from "@/components/common/table/data-table";
import TableSkeleton from "@/components/skeleton/table.skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import {
  useSetFilterLoading,
  useSetFilterSheetOpen,
} from "@/store/workspace/to-do-ui";
import { useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

export default function TodoTable() {
  const [tableData, setTableData] = useState<TaskTable[] | null>(null);
  const [paginationData, setPaginationData] = useState({
    limit: 10,
    skip: 50
  });

  const setFilterSheetOpen = useSetFilterSheetOpen();
  const setIsFilterLoading = useSetFilterLoading();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const priority = searchParams.get("priority");

  const { data, loading } = useAxiosFetch<TodoItems[]>({
    endpoint: "/tasks",
    initialState: [],
    dataKey: "tasks",
    urlParams: {
      status: status || "",
      priority: priority || "",
      limit: paginationData.limit,
      skip: paginationData.skip,
      table: true,
    },
    deps: [status, priority, paginationData.skip, paginationData.limit],
  });


  useEffect(() => {
    if (!loading && data.length === 0) setTableData([]);

    function handleInvokeTableData(data: TodoItems[]): void {
      // const m_data = data.flatMap((item) => item.items);
      setTableData(() => {
        const _data = data.map((item) => ({
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

  async function onPaginate(_pageNumber: number): Promise<void> {
    handlePaginationData("skip", _pageNumber);
  }

  function handlePaginationData(key: "limit" | "skip", value: number) {
    setPaginationData(
      prevState => ({
        ...prevState,
        [key]: value
      })
    )
  };

  if (loading) return <TableSkeleton />;

  if (!loading && data.length === 0 && !tableData)
    return <p>No table data found</p>;

  return (
    <ScrollArea className="h-[calc(100dvh-12rem)]">
      <WorkspaceTable<TaskTable>
        columns={taskTableColumns}
        onPaginate={onPaginate}
        data={tableData || []}
      />
    </ScrollArea>
  );
}
