"use client"

import TodoLayout from "@/app/(protected)/dashboard/workspace/todo/_components/to-do-layout";
import KanbanSkeleton from "@/components/skeleton/kanban.skeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<KanbanSkeleton />}>
      <TodoLayout />
    </Suspense>
  );
}
