import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
    title?: string;
    description?: string;
    children: React.ReactNode;
};

export default function AuthFormContainer({ title="Welcome", description="", children }: Props) {
  return (
    <Card className="min-w-[90%] md:min-w-sm bg-card/20 backdrop-blur-lg">
      <CardHeader>
        <CardTitle>
          <h1 className="text-2xl">{title}</h1>
        </CardTitle>
        <CardDescription>
          <p className="max-w-[28ch]">
            {description}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
}
