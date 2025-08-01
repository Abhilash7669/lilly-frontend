"use client";

import TodoBoard from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-board";
import TodoFilter from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-filter";
import TodoTable from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useInitTodoData from "@/hooks/useInitTodoData";
import { ICON_SIZE } from "@/lib/utils";
import { useTodoData } from "@/store/workspace/to-do-data";
import { useSetFilterSheetOpen } from "@/store/workspace/to-do-ui";
import { ListFilterPlus } from "lucide-react";
import { useState } from "react";

export default function TodoContainer() {
  const data = useTodoData();
  const {
    setTodoData: setContainers,
    todoData: containers,
    loading,
  } = useInitTodoData({ hasData: data.length > 0 });
  const setFilterSheetOpen = useSetFilterSheetOpen();

  const [tabValue, setTabValue] = useState<"board" | "table">("board");

  function handleTabSwitch(tab: "board" | "table"): void {
    setTabValue(() => tab);
  }

  return (
    <div>
      <Tabs value={tabValue} defaultValue={tabValue} className="gap-0">
        <div className="flex items-center gap-4 w-full justify-between py-2">
          {tabValue === "table" && (
            <p className="text-[0.62rem] text-muted-foreground">
              Current functionalities: Filter and view tasks
            </p>
          )}
          <div className="flex items-center gap-2">
            {tabValue === "table" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button onClick={() => setFilterSheetOpen(true)} size="sm">
                      <ListFilterPlus className={ICON_SIZE.small} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={0}
                  >
                    Filter
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
          </div>
        </div>
        <TabsContent value="board">
          <TodoBoard
            setContainers={setContainers}
            containers={containers}
            loading={loading}
          />
        </TabsContent>
        <TabsContent value="table" className="mt-2">
          <TodoTable />
        </TabsContent>
      </Tabs>
      <TodoFilter />
    </div>
  );
}
