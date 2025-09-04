"use client";

import { TAB_LIST } from "@/app/(protected)/dashboard/workspace/todo/_data/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoTabList } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense } from "react";
import KanbanSkeleton from "@/components/skeleton/kanban.skeleton";
import PieChartSkeleton from "@/components/skeleton/pie-chart.skeleton";
import { Card } from "@/components/ui/card";

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
          <Tabs
            className="h-full"
            defaultValue={q || TAB_LIST[0].value || "over-view"}
          >
            <div className="border-b">
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
            {TAB_LIST.map((tab) => {
              const tabValue = tab.value as TodoTabList;
              let content;
              switch (tabValue) {
                case "over-view":
                  content = (
                    <TabsContent key={tabValue} value={tabValue}>
                      <Suspense
                        fallback={
                          <Card className="mt-12 max-w-[40rem] mx-auto flex items-center justify-center">
                            <PieChartSkeleton />
                          </Card>
                        }
                      >
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
