"use client"

import { Card } from '@/components/ui/card';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

type Props = {
    id: string | number;
    children: React.ReactNode;
}


export function SortableItem({ id, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <Card className={`w-[90%] flex items-center p-4 cursor-grab ${isDragging && "border border-white cursor-grabbing opacity-40"}`} ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
    </Card>
  );
}