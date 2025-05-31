import { cn } from "@/lib/utils";

type Props = {
    className?: string;
    children: React.ReactNode;
};

export default function InputRow({ className= "",children }: Props) {
  return (
    <div className={cn("grid md:grid-cols-2 gap-4", className)}>
        {children}
    </div>
  )
}