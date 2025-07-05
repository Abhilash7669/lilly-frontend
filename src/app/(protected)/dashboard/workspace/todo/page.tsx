"use client";

import { TAB_LIST } from "@/app/(protected)/dashboard/workspace/todo/_data/data";
import TodoBoard from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TodoData,
  TodoTabList,
} from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import TodoProvider from "@/app/(protected)/dashboard/workspace/todo/_context/todo-context";

export default function Page() {
  // const [containers, setContainers] = useState<TodoData[]>([
  //   {
  //     id: "todo",
  //     title: "To Do",
  //     items: [
  //       {
  //         id: "task-c",
  //         title: "Weather API",
  //         description: "Lorem ipsum description over here, to test it out",
  //         priority: "Low",
  //         subTasks: [
  //           {
  //             subTask: "Tetastas",
  //             status: true
  //           },
  //           {
  //             subTask: "ANoasdad",
  //             status: true
  //           },
  //           {
  //             subTask: "asdkjakdk",
  //             status: false
  //           },
  //         ],
  //         tags: ["Dev", "Research"],
  //         order: 0,
  //       },
  //       {
  //         id: "task-d",
  //         title: "Clock",
  //         description: "Lorem ipsum description over here, to test it out",
  //         priority: "Medium",
  //         subTasks: [
  //           {
  //             subTask: "Tetastas",
  //             status: false
  //           },
  //           {
  //             subTask: "ANoasdad",
  //             status: true
  //           },
  //           {
  //             subTask: "asdkjakdk",
  //             status: false
  //           },
  //         ],
  //         tags: [],
  //         order: 1,
  //       },
  //       {
  //         id: "task-asda",
  //         title: "New TAak",
  //         description: "Lorem ipsum description over here, to test it out",
  //         priority: "Medium",
  //         subTasks: [
  //           {
  //             subTask: "Tetastas",
  //             status: false
  //           },
  //           {
  //             subTask: "ANoasdad",
  //             status: true
  //           },
  //           {
  //             subTask: "asdkjakdk",
  //             status: false
  //           },
  //         ],
  //         tags: [],
  //         order: 2,
  //       },
  //     ],
  //   },
  //   {
  //     id: "inProgress",
  //     title: "In Progress",
  //     items: [
  //       {
  //         id: "task-b",
  //         title: "Component Composition for work-space",
  //         description: "Lorem ipsum description over here, to test it out",
  //         priority: "High",
  //         subTasks: [
  //           {
  //             subTask: "Tetastas",
  //             status: false
  //           },
  //           {
  //             subTask: "ANoasdad",
  //             status: true
  //           },
  //           {
  //             subTask: "asdkjakdk",
  //             status: false
  //           },
  //         ],
  //         tags: [],
  //         order: 0,
  //       },
  //       {
  //         id: "task-e",
  //         title: "TODO UI, Re-structure and cleanup",
  //         description: "Lorem ipsum description over here, to test it out",
  //         priority: "Low",
  //         subTasks: [
  //           {
  //             subTask: "Tetastas",
  //             status: false
  //           },
  //           {
  //             subTask: "ANoasdad",
  //             status: true
  //           },
  //           {
  //             subTask: "asdkjakdk",
  //             status: false
  //           },
  //         ],
  //         tags: [],
  //         order: 1,
  //       },
  //       {
  //         id: "task-e-0asd",
  //         title: "Scroll Area for cards",
  //         description: "Lorem ipsum description over here, to test it out",
  //         priority: "Low",
  //         subTasks: [
  //           {
  //             subTask: "Tetastas",
  //             status: false
  //           },
  //           {
  //             subTask: "ANoasdad",
  //             status: true
  //           },
  //           {
  //             subTask: "asdkjakdk",
  //             status: false
  //           },
  //         ],
  //         tags: [],
  //         order: 2,
  //       },
  //       {
  //         id: "task-e-asjhuia",
  //         title: "Re-structure Card UI(title, desc, status, options)",
  //         description: "Lorem ipsum description over here, to test it out",
  //         priority: "Medium",
  //         subTasks: [
  //           {
  //             subTask: "Tetastas",
  //             status: false
  //           },
  //           {
  //             subTask: "ANoasdad",
  //             status: true
  //           },
  //           {
  //             subTask: "asdkjakdk",
  //             status: false
  //           },
  //         ],
  //         tags: [],
  //         order: 3,
  //       },
  //       {
  //         id: "task-e-aasdsjhuia",
  //         title: "Popup Card to view card details",
  //         description: "Lorem ipsum description over here, to test it out",
  //         priority: "High",
  //         subTasks: [
  //           {
  //             subTask: "Tetastas",
  //             status: false
  //           },
  //           {
  //             subTask: "ANoasdad",
  //             status: true
  //           },
  //           {
  //             subTask: "asdkjakdk",
  //             status: false
  //           },
  //         ],
  //         tags: [],
  //         order: 4,
  //       },
  //     ],
  //   },
  //   {
  //     id: "done",
  //     title: "Done",
  //     items: [
  //       {
  //         id: "task-a",
  //         title: "Re-structure work-space routes",
  //         description: "Lorem ipsum description over here, to test it out",
  //         priority: "High",
  //         subTasks: [
  //           {
  //             subTask: "Tetastas",
  //             status: false
  //           },
  //           {
  //             subTask: "ANoasdad",
  //             status: true
  //           },
  //           {
  //             subTask: "asdkjakdk",
  //             status: false
  //           },
  //         ],
  //         tags: [],
  //         order: 0,
  //       },
  //       {
  //         id: "task-blah",
  //         title: "Cooking Breakfast",
  //         description: "Lorem ipsum description over here, to test it out",
  //         priority: "Medium",
  //         subTasks: [
  //           {
  //             subTask: "Tetastas",
  //             status: false
  //           },
  //           {
  //             subTask: "ANoasdad",
  //             status: true
  //           },
  //           {
  //             subTask: "asdkjakdk",
  //             status: false
  //           },
  //         ],
  //         tags: [],
  //         order: 1,
  //       },
  //       {
  //         id: "task-banana",
  //         title: "Chopping Onions",
  //         description: "Lorem ipsum description over here, to test it out",
  //         priority: "Low",
  //         subTasks: [
  //           {
  //             subTask: "Tetastas",
  //             status: false
  //           },
  //           {
  //             subTask: "ANoasdad",
  //             status: true
  //           },
  //           {
  //             subTask: "asdkjakdk",
  //             status: false
  //           },
  //         ],
  //         tags: [],
  //         order: 2,
  //       },
  //     ],
  //   },
  // ]);

  const { data, setData } = useAxiosFetch<TodoData[]>("/tasks/", [], "tasks");

  return (
    <div className="space-y-12 h-full lg:h-[calc(100dvh-7rem)]">
      <Tabs className="h-full" defaultValue={TAB_LIST[0].value || "over-view"}>
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
            case "board":
              content = (
                <TabsContent className="h-full" key={tabValue} value={tabValue}>
                  {data && (
                    <TodoProvider>
                      <TodoBoard containers={data} setContainers={setData} />
                    </TodoProvider>
                  )}
                </TabsContent>
              );
              break;
            case "table":
              content = (
                <TabsContent key={tabValue} value={tabValue}>
                  <p>Table</p>
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
