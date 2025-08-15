"use client";

import LoaderDefault from "@/components/common/spinner/loader-default";
import React, { Suspense } from "react";

const TodoLayout = React.lazy(
  () =>
    import(
      "@/app/(protected)/dashboard/workspace/todo/_components/to-do-layout"
    )
);

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100dvh-20rem)] w-full flex items-center justify-center">
          <LoaderDefault />
        </div>
      }
    >
      <TodoLayout />
    </Suspense>
  );
}
