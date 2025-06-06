import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";


type Props = {
    children: React.ReactNode;
    id: string | number;
    className?: string;
};

export default function Droppable({ children, className, id="" }: Props) {

    const { isOver, setNodeRef } = useDroppable({
        id: id || "droppable"
    });

    const style = {
        color: isOver ? 'green' : undefined
    }

  return (
    <Card className={cn("border rounded-xl flex items-center", className)} ref={setNodeRef} style={style}>
        { children }
    </Card>
  )
}