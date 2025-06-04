
import {useDraggable} from '@dnd-kit/core';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';


interface CustomDraggableProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    children: React.ReactNode;
    id: string;
}

export default function Draggable({ children, id="", ...props }: CustomDraggableProps) {

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id || 'draggable',
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <button ref={setNodeRef} {...props} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
}