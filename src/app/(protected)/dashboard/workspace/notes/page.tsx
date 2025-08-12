import NotesEditorSkeleton from "@/components/skeleton/notes-editor.skeleton";
import React, { Suspense } from "react";

const NotesLayout = React.lazy(() => import('@/app/(protected)/dashboard/workspace/notes/_components/notes-layout'));

export default function page() {
  return (
    <Suspense fallback={<NotesEditorSkeleton />}>
      <NotesLayout />
    </Suspense>
  );
}
