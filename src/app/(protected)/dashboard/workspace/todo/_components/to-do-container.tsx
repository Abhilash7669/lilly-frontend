"use client";

import TodoBoard from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-board";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useInitTodoData from "@/hooks/useInitTodoData";
import { useTodoData } from "@/store/workspace/to-do-data";
import { useState } from "react";

export default function TodoContainer() {
  const [tabValue, setTabValue] = useState<"board" | "table">("board");
  const data = useTodoData();
  const {
    setTodoData: setContainers,
    todoData: containers,
    loading,
  } = useInitTodoData({ hasData: data.length > 0 });

  function handleTabSwitch(tab: "board" | "table"): void {
    setTabValue(() => tab);
  }

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
          <DropdownMenuContent>
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
        <TabsContent value="table">Table here</TabsContent>
      </Tabs>
    </div>
  );
}
