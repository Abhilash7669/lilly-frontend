import { StatusValue } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  variant: StatusValue;
  className?: string;
};

const VARIANTS = {
  inProgress: {
    text: "In Progress",
    bg: "bg-purple-600/20",
  },
  todo: {
    text: "Todo",
    bg: "bg-cyan-600/20",
  },
  done: {
    text: "Done",
    bg: "bg-emerald-600/20",
  },
};

export default function StatusBadge({
  variant = "todo",
  className = "",
}: Props) {
  return (
    <Badge
      className={cn(
        `rounded-full border-none backdrop-blur-lg ${VARIANTS[variant].bg}`,
        className
      )}
    >
      {VARIANTS[variant].text}
    </Badge>
  );
}
