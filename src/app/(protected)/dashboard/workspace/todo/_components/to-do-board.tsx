"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Droppable from "@/app/(protected)/dashboard/workspace/todo/_components/droppable";
import { Button } from "@/components/ui/button";
import {
  ADD_TASK_HEADER,
  EMPTY_SUB_TASK_TEXT,
  PRIORITY_SELECT_OPTIONS,
  STATUS_SELECT_OPTIONS,
} from "@/app/(protected)/dashboard/workspace/todo/_data/data";
import InputGroup from "@/components/common/input-elements/input-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import {
  CalendarIcon,
  Check,
  Ellipsis,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import SidePanel from "@/components/common/sheet/side-panel";
import { Separator } from "@/components/ui/separator";
import {
  SubTaskMode,
  SubTasks,
  SubTaskState,
  TaskAddResponse,
  TaskDTO,
  TaskDTOKey,
  TaskPayload,
} from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { ICON_SIZE } from "@/lib/utils";
import { errorToast } from "@/lib/toast/toast-function";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRange } from "react-day-picker";
import { LILLY_DATE } from "@/lib/lilly-utils/lilly-utils";
import { format } from "date-fns";
import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import AppSelect from "@/components/common/input-elements/app-select";
import {
  useActiveDroppable,
  useDeleteModalState,
  useIsAddSheetOpen,
  useSetAddSheetState,
  useSetDeleteModalState,
} from "@/store/workspace/to-do-controls";
import useInitTodoData from "@/hooks/useInitTodoData";
import { useActiveItemId, useTodoData } from "@/store/workspace/to-do-data";
import { Modal as DeleteModal } from "@/components/common/modal/modal";

export default function TodoBoard() {

  // zustand data store
  const data = useTodoData();
  const activeItemId = useActiveItemId();
  const {
    setTodoData: setContainers,
    todoData: containers,
    loading,
  } = useInitTodoData({ hasData: data.length > 0 });


  // zustand todocontrols states
  const isAddSheetOpen = useIsAddSheetOpen();
  const setAddSheetState = useSetAddSheetState();
  const activeDroppable = useActiveDroppable();
  const setDeleteModal = useSetDeleteModalState();
  const isDeleteModalOpen = useDeleteModalState();

  const [subTasks, setSubTasks] = useState<SubTasks[]>([]); // to set sub task at creation

  const [subTaskState, setSubTaskState] = useState<SubTaskState>({
    // detect subtask mode
    isAdding: false,
    isEditing: false,
  });
  const [editingSubTask, setEditingSubTask] = useState<number | null>(null);
  const [subTaskInput, setSubTaskInput] = useState<string>(""); // capture subtask input

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >({
    from: LILLY_DATE.startOfTodayUTC(),
    to: LILLY_DATE.endOfTodayUTC(),
  }); // covers date

  const [taskDTO, setTaskDTO] = useState<TaskDTO>({
    name: "",
    summary: "",
    order: 0,
    priority: "medium",
    subTasks: [],
    tags: [],
    status: "todo",
    date: {
      startDate: LILLY_DATE.toISOString(selectedDateRange?.from) || "",
      dueDate: LILLY_DATE.toISOString(selectedDateRange?.to) || "",
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [activeid, setActiveId] = useState<UniqueIdentifier | null>(null);
  void activeid;

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const addInputRef = useRef<HTMLInputElement | null>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);

  const isInitialLoading = loading && containers.length === 0;
  const hasFetchedData = !loading && containers.length > 0;
  const isEmptyAfterFetch = !loading && containers.length === 0;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (
      subTaskState.isEditing &&
      !subTaskState.isAdding &&
      editInputRef &&
      editInputRef.current
    )
      editInputRef.current.focus();

    if (
      subTaskState.isAdding &&
      !subTaskState.isEditing &&
      addInputRef &&
      addInputRef.current
    )
      addInputRef.current.focus();
  }, [
    subTaskState.isAdding,
    subTaskState.isEditing,
    editInputRef,
    addInputRef,
  ]);

  useEffect(() => {
    if (activeDroppable)
      setTaskDTO((prevState) => ({ ...prevState, status: activeDroppable }));
  }, [activeDroppable]);

  function findContainerId(
    itemId: UniqueIdentifier
  ): UniqueIdentifier | undefined {
    // return the container id;
    if (containers.some((container) => container.status === itemId))
      return itemId;

    return containers.find((container) =>
      container.items.some((item) => item._id === itemId)
    )?.status;
  }

  function handleDragStart(e: DragStartEvent): void {
    setActiveId(e.active.id);
  }

  function handleDragOver(e: DragOverEvent): void {
    const { active, over } = e;

    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainerId = findContainerId(activeId);
    const overContainerId = findContainerId(overId);

    /* 

      When drag over
        - Find original container of activeItem
        - Find activeItem in original container

        - Remove activeItem from original container
        - Append activeItem to the new container and update it's position;
    
    */

    // defensive checks

    if (
      !activeContainerId ||
      !overContainerId ||
      activeContainerId === overContainerId
    )
      return;
    if (activeId === overId) return;

    setContainers((prevState) => {
      const originalContainer = prevState.find(
        (c) => c.status === activeContainerId
      );

      if (!originalContainer) return prevState;

      const originalItem = originalContainer.items.find(
        (item) => item._id === activeId
      );

      if (!originalItem) return prevState;

      const newContainers = prevState.map((container) => {
        if (container.status === activeContainerId) {
          return {
            ...container,
            items: container.items.filter((item) => item._id !== activeId),
          };
        }

        if (container.status === overContainerId) {
          return {
            ...container,
            items: [...container.items, originalItem],
          };
        }

        const overIndex = container.items.findIndex(
          (item) => item._id === overId
        );

        if (overIndex !== -1) {
          return {
            ...container,
            items: [
              ...container.items.slice(0, overIndex + 1),
              originalItem,
              ...container.items.slice(overIndex + 1),
            ],
          };
        }

        return container;
      });

      return newContainers;
    });
  }

  function handleDragCancel(e: DragCancelEvent): void {
    void e;

    setActiveId(() => null);
  }

  function handleDragEnd(e: DragEndEvent): void {
    const { active, over } = e;

    if (!active || !over) {
      setActiveId(() => null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeContainerId = findContainerId(activeId);
    const overContainerId = findContainerId(overId);

    if (activeContainerId === overContainerId && activeId !== overId) {
      const containerIndex = containers.findIndex(
        (container) => container.status === overContainerId
      );

      if (containerIndex === -1) {
        setActiveId(() => null);
        return;
      }

      const targetContainer = containers[containerIndex];

      const activeIndex = targetContainer.items.findIndex(
        (item) => item._id === activeId
      );
      const overIndex = targetContainer.items.findIndex(
        (item) => item._id === overId
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        const newArray = arrayMove(
          targetContainer.items,
          activeIndex,
          overIndex
        );

        setContainers((prevState) => {
          return prevState.map((c, index) => {
            if (index === containerIndex) {
              const m_newArray = newArray.map((item, i) => {
                if (i === overIndex) {
                  return {
                    ...item,
                    order: i,
                  };
                }

                if (i >= overIndex + 1) {
                  return {
                    ...item,
                    order: item.order + 1,
                  };
                }

                if (i <= overIndex - 1 && i !== 0) {
                  return {
                    ...item,
                    order: item.order - 1,
                  };
                }

                return item;
              });

              return {
                ...c,
                items: m_newArray,
              };
            }

            // reset the order for the activeContainerId

            const m_resetArray = c.items.map((item, i) => {
              if (i === 0) {
                return {
                  ...item,
                };
              }

              return {
                ...item,
                order: i,
              };
            });

            return {
              ...c,
              items: m_resetArray,
            };
          });
        });
      }
    }
  }

  function handleToggleSubTaskState(mode: SubTaskMode, e: boolean) {
    setSubTaskState((prevState) => ({ ...prevState, [mode]: e }));
    if (!e) {
      setSubTaskInput(() => "");
      setEditingSubTask(() => null);
    }
  }

  function handleAddSubTask(): void {
    // push subtask into array

    if (subTaskInput.trim() === "") {
      errorToast("Error", "SubTask cannot be an empty string");
      return;
    }

    setSubTasks((prevState) => {
      return [...prevState, { subTask: subTaskInput, status: false }];
    });

    setSubTaskState((prevState) => ({ ...prevState, isAdding: false }));
  }

  function debounceAddSubTask(
    e: ChangeEvent<HTMLInputElement>,
    callBack: (e: string) => void,
    time: number
  ) {
    if (debounceTimer && debounceTimer.current)
      clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      callBack(e.target.value);
    }, time);
  }

  function debounceTaskData(
    callBack: (
      key: TaskDTOKey,
      value:
        | string
        | []
        | "high"
        | "medium"
        | "low"
        | Array<string>
        | number
        | { startDate: string | undefined; dueDate: string | undefined }
    ) => void,
    time: number,
    key: TaskDTOKey,
    value:
      | string
      | []
      | "high"
      | "medium"
      | "low"
      | Array<string>
      | number
      | { startDate: string | undefined; dueDate: string | undefined }
  ) {
    if (debounceTimer && debounceTimer.current)
      clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      callBack(key, value);
    }, time);
  }

  function handleEditSubTask(i: number, data: string): void {
    setSubTasks((prevState) => {
      if (data.trim() === "") return prevState;

      const hasSubTask = prevState.find((_, index) => index === i);

      if (!hasSubTask) {
        errorToast("Error", "Could not find subtask");
        return prevState;
      }

      const updatedData = prevState.map((item, index) => {
        if (index === i)
          return {
            subTask: data,
            status: item.status,
          };

        return item;
      });

      if (!updatedData) return prevState;

      return updatedData;
    });
    setSubTaskState((prevState) => ({ ...prevState, isEditing: false }));
  }

  function handleDeletSubTask(i: number) {
    setSubTasks((prevState) => {
      return prevState.filter((_, index) => index !== i);
    });
  }

  function handleTaskDTO(
    key: TaskDTOKey,
    value:
      | string
      | []
      | "high"
      | "medium"
      | "low"
      | Array<string>
      | number
      | { startDate: string | undefined; dueDate: string | undefined }
  ) {
    setTaskDTO((prevState) => ({ ...prevState, [key]: value }));
  }

  async function handleSendData() {
    /* todo: 
      
        re-work this to update order of the new task - done
        
        re-work: initial-state
        re-work: migrate to zustand 
      
    */

    /* 
      - check the status
        based on the status, check it's order
        update order accordingly
    */

    // find if that droppable has any item;

    const containerIndex = containers.findIndex(
      (item) => item.status === activeDroppable
    );

    if (containerIndex === -1) {
      console.log("No container found");
      return;
    }

    const order = containers[containerIndex].items.sort(function (a, b) {
      return b.order - a.order;
    });

    const currentOrder = order[0].order;

    setIsLoading(() => true);
    const payload = {
      ...taskDTO,
      subTasks: subTasks,
      order: currentOrder + 1,
    };

    const response = await AXIOS_CLIENT.post<TaskPayload, TaskAddResponse>(
      "/tasks/add",
      {
        task: payload,
      }
    );

    if (!response) return;
    const data = response?.data.task.taskItem;

    setIsLoading(() => false);
    setAddSheetState(false);

    setContainers((prevState) => {
      return prevState.map((item) => {
        if (item.status === data?.status) {
          return {
            status: item.status,
            items: [...item.items, data],
          };
        }

        return item;
      });
    });

    // console.log(response, "RESPONSE");
  };

  async function handleTestDelete() {
    const response = await AXIOS_CLIENT.delete(`/tasks/delete/${activeItemId}`);
    console.log(response, "RESPONSE")
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="h-full w-full">
          {isInitialLoading ? (
            <div className="grid sm:grid-cols-3 sm:gap-2 lg:gap-6 h-full">
              {[0, 1, 2].map(
                item => (
                  <div className="py-4 rounded-xl bg-card-foreground/20 space-y-2 h-full" key={item}>
                    {[0, 1, 2, 4, 5, 6].map(
                      card => <div key={card} className="bg-card rounded-xl px-6 py-5 animate-pulse w-[94%] h-[8rem] mx-auto"></div>
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <>
              {isEmptyAfterFetch && (
                <div className="w-full h-full flex items-center justify-center">
                  <Button onClick={() => setAddSheetState(true)}>
                    Add Task
                  </Button>
                </div>
              )}
              {hasFetchedData && (
                <div className="grid sm:grid-cols-3 sm:gap-2 lg:gap-6 h-full">
                  {containers.map((item) => {
                    return <Droppable key={item.status} data={item} />;
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </DndContext>
      {/* modals & side-panel */}
      <SidePanel
        open={isAddSheetOpen}
        setOpen={(e) => {
          setAddSheetState(e as boolean);
          setSubTaskInput(() => "");
          setSubTaskState((prevState) => ({ ...prevState, isAdding: false }));
        }}
        header={{
          title: ADD_TASK_HEADER.title,
          description: ADD_TASK_HEADER.description,
        }}
        onConfirm={handleSendData}
        isLoading={isLoading}
        side="bottom"
      >
        <div className="space-y-4 lg:w-2/4">
          <InputGroup label="Name">
            <Input
              name="name"
              onChange={(e) =>
                debounceTaskData(handleTaskDTO, 300, "name", e.target.value)
              }
              className="!text-xs"
            />
          </InputGroup>
          <InputGroup label="Summary">
            <Textarea
              name="summary"
              onChange={(e) =>
                debounceTaskData(handleTaskDTO, 300, "summary", e.target.value)
              }
              className="!text-xs"
            />
          </InputGroup>
          <InputGroup label="Duration">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={"w-full pl-3 text-left font-normal"}
                >
                  {selectedDateRange ? (
                    <div className="flex items-center gap-1">
                      <p className="text-xs">
                        {format(
                          LILLY_DATE.toISOString(selectedDateRange?.from) || "",
                          "PPP"
                        )}
                      </p>
                      -
                      <p className="text-xs">
                        {format(
                          LILLY_DATE.toISOString(selectedDateRange?.to) || "",
                          "PPP"
                        )}
                      </p>
                    </div>
                  ) : (
                    <span>Pick a date</span>
                  )}
                  {/* // )} */}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                side="bottom"
              >
                <Calendar
                  className="bg-card rounded-xl shadow-sm border"
                  mode="range"
                  numberOfMonths={2}
                  onSelect={(e) => {
                    setSelectedDateRange((prevState) => ({
                      from: e?.from || prevState?.from,
                      to: e?.to || prevState?.to,
                    }));
                    const startDate = e?.from
                      ? LILLY_DATE.toUTC(e.from).toISOString()
                      : selectedDateRange?.from?.toISOString();
                    const dueDate = e?.to
                      ? LILLY_DATE.toUTC(e.to).toISOString()
                      : selectedDateRange?.to?.toISOString();
                    debounceTaskData(handleTaskDTO, 300, "date", {
                      startDate,
                      dueDate,
                    });
                  }}
                  selected={selectedDateRange}
                />
              </PopoverContent>
            </Popover>
          </InputGroup>
          <div className="flex items-center gap-2">
            <InputGroup className="w-2/4" label="Priority">
              <AppSelect<TaskDTO, "priority">
                onValueChange={handleTaskDTO}
                name="priority"
                value={taskDTO.priority}
                selectData={PRIORITY_SELECT_OPTIONS}
                selectLabel="Priority"
              />
            </InputGroup>
            <InputGroup className="w-2/4" label="Status">
              <AppSelect<TaskDTO, "status">
                name="status"
                onValueChange={handleTaskDTO}
                value={taskDTO.status}
                selectLabel="Status"
                selectData={STATUS_SELECT_OPTIONS}
              />
            </InputGroup>
          </div>
          <Separator />
          {/* Sub tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs">Sub tasks</p>
              <Plus
                onClick={() => handleToggleSubTaskState("isAdding", true)}
                className={`${ICON_SIZE.small} cursor-pointer hover:opacity-50`}
              />
            </div>
            <div className="space-y-1">
              {/* render subtasks */}
              {subTasks.length === 0 && !subTaskState.isAdding && (
                <p className="text-muted-foreground text-xs w-full sm:w-[90%]">
                  {EMPTY_SUB_TASK_TEXT}
                </p>
              )}
              {subTasks.length > 0 && (
                // render subtasks here
                <ul>
                  {subTasks.map((item, i) => {
                    if (editingSubTask === i)
                      return (
                        <div key={i} className="relative">
                          <Input
                            ref={editInputRef}
                            defaultValue={subTasks[i].subTask}
                            onChange={(e) =>
                              debounceAddSubTask(e, setSubTaskInput, 300)
                            }
                            className="!text-xs"
                          />
                          <div className="absolute top-2/4 -translate-y-2/4 right-2 w-fit z-10 flex items-center gap-2">
                            <X
                              onClick={() =>
                                handleToggleSubTaskState("isEditing", false)
                              }
                              className={`${ICON_SIZE.small} opacity-50 hover:opacity-100 cursor-pointer`}
                            />
                            <Check
                              onClick={() => {
                                setSubTaskState((prevState) => ({
                                  ...prevState,
                                  isEditing: false,
                                }));
                                setEditingSubTask(() => null);
                                handleEditSubTask(i, subTaskInput);
                              }}
                              className={`${ICON_SIZE.small} opacity-50 hover:opacity-100 cursor-pointer`}
                            />
                          </div>
                        </div>
                      );

                    return (
                      <li
                        key={i}
                        className="text-xs w-full p-2 flex items-center justify-between hover:bg-accent cursor-pointer rounded-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-primary"></span>
                          <span>{item.subTask}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Ellipsis className={`${ICON_SIZE.small}`} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingSubTask(() => i);
                                setSubTaskState((prevState) => ({
                                  ...prevState,
                                  isEditing: true,
                                }));
                              }}
                              className="flex items-center cursor-pointer p-1"
                            >
                              <Pencil className={`${ICON_SIZE.small}`} />
                              <p className="text-xs">Edit...</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeletSubTask(i)}
                              className="flex items-center cursor-pointer p-1 focus:bg-destructive"
                            >
                              <Trash2 className={`${ICON_SIZE.small}`} />
                              <p className="text-xs">Delete</p>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </li>
                    );
                  })}
                </ul>
              )}
              {subTaskState.isAdding && (
                <div className="relative">
                  <Input
                    onChange={(e) =>
                      debounceAddSubTask(e, setSubTaskInput, 300)
                    }
                    className="!text-xs"
                    ref={addInputRef}
                  />
                  <div className="absolute top-2/4 -translate-y-2/4 right-2 w-fit z-10 flex items-center gap-2">
                    <X
                      onClick={() =>
                        handleToggleSubTaskState("isAdding", false)
                      }
                      className={`${ICON_SIZE.small} opacity-50 hover:opacity-100 cursor-pointer`}
                    />
                    <Check
                      onClick={handleAddSubTask}
                      className={`${ICON_SIZE.small} opacity-50 hover:opacity-100 cursor-pointer`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidePanel>
      <DeleteModal
        dialogHeader={{
          title: "Delete Task",
          description: "Are you sure you want to delete this task?"
        }}
        confirmText="Delete"
        confirmVariant="destructive"
        open={isDeleteModalOpen}
        setOpen={(e) => setDeleteModal(e as boolean)}
        onConfirm={handleTestDelete}
      >
        {activeItemId && (
          <p className="text-xs">
            Delete task: {activeItemId}
          </p>
        )}
      </DeleteModal>
    </>
  );
}
