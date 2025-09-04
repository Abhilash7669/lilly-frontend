"use client";

import {
  TaskTable,
  taskTableColumns,
} from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-columns";
import {
  PaginatedResult,
  TodoItems,
} from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { DataTable as WorkspaceTable } from "@/components/common/table/data-table";
import TableSkeleton from "@/components/skeleton/table.skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { LILLY_UTILS } from "@/lib/utils";
import {
  useSetFilterLoading,
  useSetFilterSheetOpen,
} from "@/store/workspace/to-do-ui";
import { useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

const INITIAL_STATE = {
  pagingInfo: {
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
  },
  items: [],
};

export default function TodoTable() {
  const [tableData, setTableData] = useState<TaskTable[] | null>(null);

  const setFilterSheetOpen = useSetFilterSheetOpen();
  const setIsFilterLoading = useSetFilterLoading();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  const { data, loading } = useAxiosFetch<PaginatedResult<TodoItems[]>>({
    endpoint: "/tasks",
    initialState: INITIAL_STATE,
    urlParams: {
      status: status || "",
      priority: priority || "",
      limit: limit || LILLY_UTILS.pagination.limit,
      page: page || LILLY_UTILS.pagination.resetPage,
      table: true,
    },
    deps: [status, priority, page, limit],
  });

  useEffect(() => {
    if (!loading && data.items.length === 0) setTableData([]);

    function handleInvokeTableData(data: TodoItems[]): void {
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
    handleInvokeTableData(data.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (loading) return <TableSkeleton />;

  if (!loading && data.items.length === 0 && !tableData)
    return <p>No table data found</p>;

  return (
    <ScrollArea className="h-[calc(100dvh-12rem)]">
      <WorkspaceTable<TaskTable>
        columns={taskTableColumns}
        pagingInfo={data.pagingInfo}
        data={tableData || []}
      />
    </ScrollArea>
  );
}
