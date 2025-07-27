"use client";

import {
  TaskTable,
  taskTableColumns,
} from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-columns";
import { TodoData } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { DataTable as WorkspaceTable } from "@/components/common/table/data-table";

import { useEffect, useState } from "react";

type Props = {
  containers: TodoData[] | [];
};

export default function TodoTable({ containers }: Props) {
  const [tableData, setTableData] = useState<TaskTable[] | null>(null);
  // const setActiveItem = useSetActiveItemId();
  // const setTaskModal = useSetAddSheetState();
  // const setIsEditTask = useSetIsEditTask();
  // const setEditTaskData = useSetEditTaskData();

  useEffect(() => {
    const m_data = containers.flatMap((item) => item.items);
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
  }, [containers]);

  // function onRowClick(id: string) {
  //   if (!id) return;
  //   setActiveItem(id);
  //   const _data: TodoItems = containers.flatMap((c) =>
  //     c.items.filter((item) => item._id === id)
  //   )[0];

  //   console.log(_data);

  //   if (_data) {
  //     setTaskModal(true);
  //     setIsEditTask(true);
  //     setEditTaskData(_data);
  //   }
  // }

  if (!tableData) return <p>No table data found!</p>;

  return (
    <WorkspaceTable<TaskTable> columns={taskTableColumns} data={tableData} />
  );
}
