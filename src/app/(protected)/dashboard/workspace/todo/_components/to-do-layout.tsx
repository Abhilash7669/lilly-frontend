"use client";

import { TAB_LIST } from "@/app/(protected)/dashboard/workspace/todo/_data/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoTabList } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import TodoContainer from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-container";
import { useSearchParams, useRouter } from "next/navigation";

export default function TodoLayout() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q");

  function updateUrlState(query: "over-view" | "tasks") {

    if(typeof window !== "undefined") {

      const _params = new URLSearchParams(window.location.search);
      _params.set("q", query);

      router.replace(`?${_params.toString()}`);

    }

  }

  return (
    <div className="space-y-12 h-full lg:h-[calc(100dvh-7rem)]">
      {!q && <p>Ooops!</p>}
      {q && (
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
          {TAB_LIST.map((tab) => {
            const tabValue = tab.value as TodoTabList;
            let content;
            switch (tabValue) {
              case "over-view":
                content = (
                  <TabsContent key={tabValue} value={tabValue}>
                    <p>Overview dashboard</p>
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
                    <TodoContainer />
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
      )}
    </div>
  );
}
