"use client";

import {
  PRIORITY_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "@/app/(protected)/dashboard/workspace/todo/_data/data";
import { TodoFilterType } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import InputGroup from "@/components/common/input-elements/input-group";
import { SidePanel as FilterSheet } from "@/components/common/sheet/side-panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useFilterSheetOpen,
  useIsFilterLoading,
  useSetFilterLoading,
  useSetFilterSheetOpen,
} from "@/store/workspace/to-do-ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";


export default function TodoFilter() {
  const searchParams = useSearchParams();

  const paramsObject = Object.fromEntries(searchParams.entries());

  const [filterObject, setFilterObject] = useState<TodoFilterType>({
    status: paramsObject.status || STATUS_FILTER_OPTIONS[0].value,
    priority: paramsObject.priority || PRIORITY_FILTER_OPTIONS[0].value,
  });

  const isFilterLoading = useIsFilterLoading();
  const setIsFilterLoading = useSetFilterLoading();

  const isFilterSheetOpen = useFilterSheetOpen();
  const setFilterSheetOpen = useSetFilterSheetOpen();

  const router = useRouter();

  function updateUrlState(filters: Record<string, string | null>) {
    if (typeof window !== "undefined") {
      const _params = new URLSearchParams(window.location.search);

      for (const key in filters) {
        const value = filters[key];

        if (value === null || value === "") {
          _params.delete(key);
        } else {
          _params.set(key, value);
        }
      }
      router.replace(`?${_params.toString()}`);
    }
  }

  function handleFilter() {
    setIsFilterLoading(true);
    updateUrlState({
      status: filterObject.status,
      priority: filterObject.priority,
    });
  }

  function handleUpdateFilter(key: "status" | "priority", value: string) {
    setFilterObject((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }

  return (
    <FilterSheet
      open={isFilterSheetOpen}
      setOpen={(e) => setFilterSheetOpen(e as boolean)}
      isLoading={isFilterLoading}
      header={{
        title: "Filter Tasks",
        description:
          "Apply filters to refine your view and focus on specific types of tasks.",
      }}
      confirmText="Filter"
      onConfirm={handleFilter}
    >
      <InputGroup label="Status" className="w-full">
        <Select
          onValueChange={(value) => handleUpdateFilter("status", value)}
          defaultValue={filterObject.status}
        >
          <SelectTrigger className="!bg-transparent w-full !text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTER_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </InputGroup>
      <InputGroup label="Priority" className="w-full">
        <Select
          onValueChange={(value) => handleUpdateFilter("priority", value)}
          defaultValue={filterObject.priority}
        >
          <SelectTrigger className="!bg-transparent w-full !text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_FILTER_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </InputGroup>
    </FilterSheet>
  );
}
