"use client";

import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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
} from "@/app/(protected)/dashboard/workspace/todo/_data/data";
import InputGroup from "@/components/common/input/input-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
// import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  SubTaskMode,
  SubTasks,
  SubTaskState,
  TodoData,
  TodoModalStates,
  TodoStatus,
} from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { iconSize } from "@/lib/utils";
import { errorToast } from "@/lib/toast/toast-function";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  containers: TodoData[];
  setContainers: React.Dispatch<React.SetStateAction<TodoData[]>>;
};

type modalKeys = "add";

export default function TodoBoard({ containers, setContainers }: Props) {
  const [subTasks, setSubTasks] = useState<SubTasks[]>([]);
  void setSubTasks;

  const [subTaskState, setSubTaskState] = useState<SubTaskState>({
    isAdding: false,
    isEditing: false,
  });

  const [editingSubTask, setEditingSubTask] = useState<number | null>(null);

  const [subTaskInput, setSubTaskInput] = useState<string>("");

  const [modal, setModal] = useState<TodoModalStates>({
    add: {
      isOpen: false,
    },
  });
  const [activeid, setActiveId] = useState<UniqueIdentifier | null>(null);
  void activeid;

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const addInputRef = useRef<HTMLInputElement | null>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);

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

    if(subTaskState.isEditing && !subTaskState.isAdding && editInputRef && editInputRef.current) editInputRef.current.focus();

    if(subTaskState.isAdding && !subTaskState.isEditing && addInputRef && addInputRef.current) addInputRef.current.focus();


  }, [subTaskState.isAdding, subTaskState.isEditing, editInputRef, addInputRef]);


  function findContainerId(
    itemId: UniqueIdentifier
  ): UniqueIdentifier | undefined {
    // return the container id;
    if (containers.some((container) => container.id === itemId)) return itemId;

    return containers.find((container) =>
      container.items.some((item) => item.id === itemId)
    )?.id;
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
        (c) => c.id === activeContainerId
      );

      if (!originalContainer) return prevState;

      const originalItem = originalContainer.items.find(
        (item) => item.id === activeId
      );

      if (!originalItem) return prevState;

      const newContainers = prevState.map((container) => {
        if (container.id === activeContainerId) {
          return {
            ...container,
            items: container.items.filter((item) => item.id !== activeId),
          };
        }

        if (container.id === overContainerId) {
          return {
            ...container,
            items: [...container.items, originalItem],
          };
        }

        const overIndex = container.items.findIndex(
          (item) => item.id === overId
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
        (container) => container.id === overContainerId
      );

      if (containerIndex === -1) {
        setActiveId(() => null);
        return;
      }

      const targetContainer = containers[containerIndex];

      const activeIndex = targetContainer.items.findIndex(
        (item) => item.id === activeId
      );
      const overIndex = targetContainer.items.findIndex(
        (item) => item.id === overId
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

  function handleModalStates(key: modalKeys, e: boolean): void {
    setModal((prevState) => ({ ...prevState, [key]: { isOpen: e } }));
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

  function handleEditSubTask(i: number, data: string): void {
    setSubTasks((prevState) => {

      if(data.trim() === "") return prevState;

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
    setSubTaskState(prevState => ({ ...prevState, isEditing: false }));
  }

  function handleDeletSubTask(i: number) {
    setSubTasks((prevState) => {
      return prevState.filter((_, index) => index !== i);
    });
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
          {containers.length === 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <Button onClick={() => handleModalStates("add", true)}>
                Add Task
              </Button>
            </div>
          )}
          {containers.length > 0 && (
            <div className="grid grid-cols-3 gap-12 h-full">
              {containers.map((item) => {
                if (item.items.length === 0) return null;
                return (
                  <Droppable
                    key={item.id}
                    id={item.id as TodoStatus}
                    title={item.title}
                    items={item.items}
                  />
                );
              })}
            </div>
          )}
        </div>
      </DndContext>
      <SidePanel
        open={modal.add.isOpen}
        setOpen={(e) => {
          handleModalStates("add", e as boolean);
          setSubTaskInput(() => "");
          setSubTaskState((prevState) => ({ ...prevState, isAdding: false }));
        }}
        header={{
          title: ADD_TASK_HEADER.title,
          description: ADD_TASK_HEADER.description,
        }}
      >
        <div className="space-y-4">
          <InputGroup label="Name">
            <Input />
          </InputGroup>
          <InputGroup label="Description">
            <Textarea />
          </InputGroup>
          <InputGroup label="Duration">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={"w-full pl-3 text-left font-normal"}
                >
                  {/* {field.value ? ( */}
                  {/* // format(field.value, "PPP")
                      ) : ( */}
                  <span>Pick a date</span>
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
                />
              </PopoverContent>
            </Popover>
          </InputGroup>
          <InputGroup label="Priority">
            <Select>
              <SelectTrigger className="cursor-pointer w-full">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  {PRIORITY_SELECT_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </InputGroup>
          <Separator />
          {/* Sub tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs">Sub tasks</p>
              <Plus
                onClick={() => handleToggleSubTaskState("isAdding", true)}
                className={`${iconSize.small} cursor-pointer hover:opacity-50`}
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
                          />
                          <div className="absolute top-2/4 -translate-y-2/4 right-2 w-fit z-10 flex items-center gap-2">
                            <X
                              onClick={() =>
                                handleToggleSubTaskState("isEditing", false)
                              }
                              className={`${iconSize.medium} opacity-50 hover:opacity-100 cursor-pointer`}
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
                              className={`${iconSize.medium} opacity-50 hover:opacity-100 cursor-pointer`}
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
                            <Ellipsis className={`${iconSize.small}`} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingSubTask(() => i);
                                setSubTaskState(prevState => ({ ...prevState, isEditing: true }));
                              }}
                              className="flex items-center cursor-pointer p-1"
                            >
                              <Pencil className={`${iconSize.small}`} />
                              <p className="text-xs">Edit...</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeletSubTask(i)}
                              className="flex items-center cursor-pointer p-1 focus:bg-destructive"
                            >
                              <Trash2 className={`${iconSize.small}`} />
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
                    ref={addInputRef}
                  />
                  <div className="absolute top-2/4 -translate-y-2/4 right-2 w-fit z-10 flex items-center gap-2">
                    <X
                      onClick={() =>
                        handleToggleSubTaskState("isAdding", false)
                      }
                      className={`${iconSize.medium} opacity-50 hover:opacity-100 cursor-pointer`}
                    />
                    <Check
                      onClick={handleAddSubTask}
                      className={`${iconSize.medium} opacity-50 hover:opacity-100 cursor-pointer`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidePanel>
    </>
  );
}
