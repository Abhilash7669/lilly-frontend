"use client";

import { TAB_LIST } from "@/app/(protected)/dashboard/workspace/todo/data";
import TodoBoard from "@/components/to-do/to-do-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import { BasicResponse } from "@/lib/types/api";
import { TodoData, TodoTabList } from "@/lib/types/work-space";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {

  const [containers, setContainers] = useState<TodoData[]>([
    {
      id: "todo",
      title: "To Do",
      items: [
        {
          id: "task-c",
          title: "Weather API",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Low",
          subTasks: [
            {
              subTask: "Tetastas",
              status: true
            },
            {
              subTask: "ANoasdad",
              status: true
            },
            {
              subTask: "asdkjakdk",
              status: false
            },
          ],
          order: 0,
        },
        {
          id: "task-d",
          title: "Clock",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Medium",
          subTasks: [
            {
              subTask: "Tetastas",
              status: false
            },
            {
              subTask: "ANoasdad",
              status: true
            },
            {
              subTask: "asdkjakdk",
              status: false
            },
          ],
          order: 1,
        },
        {
          id: "task-asda",
          title: "New TAak",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Medium",
          subTasks: [
            {
              subTask: "Tetastas",
              status: false
            },
            {
              subTask: "ANoasdad",
              status: true
            },
            {
              subTask: "asdkjakdk",
              status: false
            },
          ],
          order: 2,
        },
      ],
    },
    {
      id: "inProgress",
      title: "In Progress",
      items: [
        {
          id: "task-b",
          title: "Component Composition for work-space",
          description: "Lorem ipsum description over here, to test it out",
          priority: "High",
          subTasks: [
            {
              subTask: "Tetastas",
              status: false
            },
            {
              subTask: "ANoasdad",
              status: true
            },
            {
              subTask: "asdkjakdk",
              status: false
            },
          ],
          order: 0,
        },
        {
          id: "task-e",
          title: "TODO UI, Re-structure and cleanup",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Low",
          subTasks: [
            {
              subTask: "Tetastas",
              status: false
            },
            {
              subTask: "ANoasdad",
              status: true
            },
            {
              subTask: "asdkjakdk",
              status: false
            },
          ],
          order: 1,
        },
        {
          id: "task-e-0asd",
          title: "Scroll Area for cards",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Low",
          subTasks: [
            {
              subTask: "Tetastas",
              status: false
            },
            {
              subTask: "ANoasdad",
              status: true
            },
            {
              subTask: "asdkjakdk",
              status: false
            },
          ],
          order: 2,
        },
        {
          id: "task-e-asjhuia",
          title: "Re-structure Card UI(title, desc, status, options)",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Medium",
          subTasks: [
            {
              subTask: "Tetastas",
              status: false
            },
            {
              subTask: "ANoasdad",
              status: true
            },
            {
              subTask: "asdkjakdk",
              status: false
            },
          ],
          order: 3,
        },
        {
          id: "task-e-aasdsjhuia",
          title: "Popup Card to view card details",
          description: "Lorem ipsum description over here, to test it out",
          priority: "High",
          subTasks: [
            {
              subTask: "Tetastas",
              status: false
            },
            {
              subTask: "ANoasdad",
              status: true
            },
            {
              subTask: "asdkjakdk",
              status: false
            },
          ],
          order: 4,
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      items: [
        {
          id: "task-a",
          title: "Re-structure work-space routes",
          description: "Lorem ipsum description over here, to test it out",
          priority: "High",
          subTasks: [
            {
              subTask: "Tetastas",
              status: false
            },
            {
              subTask: "ANoasdad",
              status: true
            },
            {
              subTask: "asdkjakdk",
              status: false
            },
          ],
          order: 0,
        },
        {
          id: "task-blah",
          title: "Cooking Breakfast",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Medium",
          subTasks: [
            {
              subTask: "Tetastas",
              status: false
            },
            {
              subTask: "ANoasdad",
              status: true
            },
            {
              subTask: "asdkjakdk",
              status: false
            },
          ],
          order: 1,
        },
        {
          id: "task-banana",
          title: "Chopping Onions",
          description: "Lorem ipsum description over here, to test it out",
          priority: "Low",
          subTasks: [
            {
              subTask: "Tetastas",
              status: false
            },
            {
              subTask: "ANoasdad",
              status: true
            },
            {
              subTask: "asdkjakdk",
              status: false
            },
          ],
          order: 2,
        },
      ],
    },
  ]);

  const [onMount, setOnMount] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (!onMount) return setOnMount(() => true);

    (async function getTasks() {
      const response = await AXIOS_CLIENT.get<BasicResponse>("/tasks/");

      if (!response) return;

      if (!response.success && response.status_code === 401)
        router.push("/login");
    })();
  }, [onMount]);

  return (
    <div className="space-y-12">
      <Tabs defaultValue={TAB_LIST[0].value || "over-view"}>
        <div className="space-y-4 border-b">
          <div>
            <h1 className="text-2xl">My Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Keep track of your tasks
            </p>
          </div>
          <TabsList className="max-w-xs p-0 justify-start bg-transparent rounded-none gap-2">
            {TAB_LIST.map((tab) => (
              <TabsTrigger
                className="rounded-none cursor-pointer bg-transparent h-full data-[state=active]:shadow-none border-b-2 border-t-0 border-r-0 border-l-0 border-transparent data-[state=active]:border-primary dark:data-[state=active]:border-primary"
                key={tab.value}
                value={tab.value}
              >
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
            case "board":
              content = (
                <TabsContent key={tabValue} value={tabValue}>
                  <TodoBoard
                    containers={containers}
                    setContainers={setContainers}
                  />
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
  );
}
