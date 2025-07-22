"use client";

import TodoBoard from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-board";
import { taskTableColumns } from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-columns";
import { DataTable } from "@/components/common/table/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useInitTodoData from "@/hooks/useInitTodoData";
import { useTodoData } from "@/store/workspace/to-do-data";
import { useEffect, useState } from "react";

export default function TodoContainer() {
  const [tabValue, setTabValue] = useState<"board" | "table">("board");
  const [tableData, setTableData] = useState<{id: string, name: string}[] | null>(null);
  const data = useTodoData();
  const {
    setTodoData: setContainers,
    todoData: containers,
    loading,
  } = useInitTodoData({ hasData: data.length > 0 });

  function handleTabSwitch(tab: "board" | "table"): void {
    setTabValue(() => tab);
  }

  useEffect(() => {
    // setTableData(() => {

    // });
    const m_data = containers.flatMap((item) => item.items);
    setTableData(() => {
      const _data = m_data.map((item) => ({ id: item._id, name: item.name }));

      return _data;
    });

  }, [containers]);

  return (
    <div>
      <Tabs value={tabValue} defaultValue={tabValue} className="gap-0">
        <DropdownMenu>
          <DropdownMenuTrigger className="place-self-end">
            <p className="text-xs cursor-pointer border rounded-sm p-2 hover:opacity-60 transition-all">
              View:{" "}
              <span className="text-muted-foreground capitalize">
                {tabValue}
              </span>
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="backdrop-blur-lg bg-popover/20">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleTabSwitch("board")}
            >
              Board
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleTabSwitch("table")}
            >
              Table
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TabsContent value="board">
          <TodoBoard
            setContainers={setContainers}
            containers={containers}
            loading={loading}
          />
        </TabsContent>
        <TabsContent value="table" className="mt-2">
          {tableData && (
            <DataTable columns={taskTableColumns} data={tableData} />
          )}
          {/* health care pvt ltd - user:  */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
