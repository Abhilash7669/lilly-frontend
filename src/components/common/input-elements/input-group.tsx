import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export default function InputGroup({
  label = "label",
  className = "",
  children,
}: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
