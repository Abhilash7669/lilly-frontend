"use client";

import { TAB_LIST } from "@/app/(protected)/dashboard/workspace/todo/_data/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoTabList } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { useSearchParams, useRouter } from "next/navigation";
// import { TodoOverview } from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-overview";
import React, { Suspense } from "react";
import ChartSkeleton from "@/components/skeleton/chart.skeleton";
import KanbanSkeleton from "@/components/skeleton/kanban.skeleton";

const TodoOverview = React.lazy(
  () =>
    import(
      "@/app/(protected)/dashboard/workspace/todo/_components/to-do-overview"
    )
);
const TodoContainer = React.lazy(
  () =>
    import(
      "@/app/(protected)/dashboard/workspace/todo/_components/to-do-container"
    )
);

export default function TodoLayout() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q");

  function updateUrlState(query: "over-view" | "tasks") {
    if (typeof window !== "undefined") {
      const _params = new URLSearchParams(window.location.search);
      _params.set("q", query);

      router.replace(`?${_params.toString()}`);
    }
  }

  return (
    <div className="space-y-12 h-full lg:h-[calc(100dvh-7rem)]">
      {!q && <p>Ooops!</p>}
      {q && (
        <div>
          {/* <div className="grid grid-cols-4 min-h-28 gap-2 my-2">
            <div className="rounded-sm p-4 bg-card h-full">
              Total Tasks
            </div>
            <div className="rounded-sm p-4 bg-card h-full">
              CARD
            </div>
            <div className="rounded-sm p-4 bg-card h-full">
              CARD
            </div>
            <div className="rounded-sm p-4 bg-card h-full">
              CARD
            </div>
          </div> */}
          <Tabs
            className="h-full"
            defaultValue={q || TAB_LIST[0].value || "over-view"}
          >
            <div className="border-b">
              {/* <div>
            <h1 className="text-2xl">My Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Keep track of your tasks
            </p>
          </div> todo: some text */}
              <TabsList className="max-w-xs p-0 justify-start bg-transparent rounded-none gap-2">
                {TAB_LIST.map((tab) => (
                  <TabsTrigger
                    className="rounded-none cursor-pointer bg-transparent h-full data-[state=active]:shadow-none data-[state=active]:!bg-transparent border-b-2 border-t-0 border-r-0 border-l-0 border-transparent data-[state=active]:border-primary dark:data-[state=active]:border-primary"
                    key={tab.value}
                    value={tab.value}
                    onClick={() =>
                      updateUrlState(tab.value as "over-view" | "tasks")
                    }
                  >
                    <tab.icon />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {/* <div className="grid grid-cols-4 min-h-28 gap-2 my-2"> 
              <div className="rounded-sm p-4 bg-card/50 h-full backdrop-blur-lg">Total Tasks</div>
              <div className="rounded-sm p-4 bg-card/50 h-full backdrop-blur-lg">CARD</div>
              <div className="rounded-sm p-4 bg-card/50 h-full backdrop-blur-lg">CARD</div>
              <div className="rounded-sm p-4 bg-card/50 h-full backdrop-blur-lg">CARD</div>
            </div> todo: cards */}
            {TAB_LIST.map((tab) => {
              const tabValue = tab.value as TodoTabList;
              let content;
              switch (tabValue) {
                case "over-view":
                  content = (
                    <TabsContent key={tabValue} value={tabValue}>
                      <Suspense fallback={<ChartSkeleton />}>
                        <TodoOverview />
                      </Suspense>
                    </TabsContent>
                  );
                  break;
                case "tasks":
                  content = (
                    <TabsContent
                      className="h-full"
                      key={tabValue}
                      value={tabValue}
                    >
                      <Suspense fallback={<KanbanSkeleton />}>
                        <TodoContainer />
                      </Suspense>
                    </TabsContent>
                  );
                  break;
                default:
                  content = "temp default";
                  break;
              }

              return content;
            })}
          </Tabs>
        </div>
      )}
    </div>
  );
}
