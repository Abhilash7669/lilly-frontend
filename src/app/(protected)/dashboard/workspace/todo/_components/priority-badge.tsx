import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

type Props = {
  className?: string;
};

const BASE_DOT_CLASS = {
  base: "h-1.5 w-1.5 rounded-full mr-1",
  variant: {
    low: "bg-emerald-500",
    medium: "bg-amber-500",
    high: "bg-red-500",
  },
};

const badgeVariants = cva("shadow-none rounded-full", {
  variants: {
    variant: {
      low: "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60",
      medium:
        "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60",
      high: "bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 border-red-600/60 text-red-500",
    },
  },
  defaultVariants: {
    variant: "medium",
  },
});

export default function PriorityBadge({
  className,
  variant,
}: Props & VariantProps<typeof badgeVariants>) {
  let content = "";

  switch (variant) {
    case "low":
      content = "Low";
      break;
    case "medium":
      content = "Medium";
      break;
    case "high":
      content = "High";
      break;
    default:
      content = "Medium";
      break;
  }

  return (
    <Badge className={cn(badgeVariants({ className, variant }))}>
      <div
        className={`${BASE_DOT_CLASS.base} ${
          BASE_DOT_CLASS.variant[variant as "low" | "high" | "medium"]
        }`}
      />
      <p className="text-[0.6rem]">{content}</p>
    </Badge>
  );
}
