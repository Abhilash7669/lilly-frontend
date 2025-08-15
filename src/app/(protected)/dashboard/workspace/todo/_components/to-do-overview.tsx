"use client";

import PieChartSkeleton from "@/components/skeleton/pie-chart.skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  // CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import { getCookie } from "@/lib/cookies/cookie";
import { LILLY_DATE } from "@/lib/lilly-utils/lilly-utils";
import { errorToast } from "@/lib/toast/toast-function";
import { BasicResponse } from "@/lib/types/api";
import { TaskSummaryResponse } from "@/types/workspace/workspace.types";
// import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Label, Pie, PieChart } from "recharts";

const chartConfig = {
  category: {
    label: "Category",
  },
  todo: {
    label: "To do",
    color: "var(--chart-2)",
  },
  inProgress: {
    label: "In Progress",
    color: "var(--chart-3)",
  },
  done: {
    label: "Done",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export default function TodoOverview() {
  const [chartData, setChartData] = useState<Array<{
    category: string;
    count: number;
    fill: string;
  }> | null>(null);

  const router = useRouter();

  const totalTasks = useMemo(() => {
    return chartData?.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  useEffect(() => {
    (async () => {
      const _token = await getCookie("lillyUser");

      if (!_token) {
        errorToast("Error", "Unauthorized user!");
        router.push("/login");
        return;
      }

      const response = await AXIOS_CLIENT.get<
        BasicResponse<TaskSummaryResponse>
      >(`/tasks/summary/${_token}`, {
        startDate: new Date("1970-01-01"), //todo: need to re-work the date selection feature for pie chart task summary
        endDate: LILLY_DATE.endOfTodayUTC(),
      });

      if (!response || !response.success) {
        // do some error handling(already error handling done by the AXIOS_CLIENT);
        return;
      }

      setChartData(() => {
        const _chartData = [
          {
            category: "todo",
            count: response?.data?.summary.todoCount || 0,
            fill: "var(--color-todo)",
          },
          {
            category: "inProgress",
            count: response?.data?.summary.inProgressCount || 0,
            fill: "var(--color-inProgress)",
          },
          {
            category: "done",
            count: response?.data?.summary.doneCount || 0,
            fill: "var(--color-done)",
          },
        ];
        return _chartData;
      });
    })();
  }, []);

  if (!chartData)
    return (
      <Card className="mt-12 max-w-[40rem] mx-auto flex items-center justify-center">
        <PieChartSkeleton />
      </Card>
    );

  return (
    <Card className="flex flex-col max-w-[40rem] mt-8 mx-auto">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          <h1>Task Distribution Overview</h1>
        </CardTitle>
        <CardDescription>
          <p className="text-sm w-[90%]">
            Proportional view of all tasks, segmented into To Do, In Progress,
            and Done for a quick progress snapshot
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData || []}
              dataKey="count"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTasks?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
