"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CircleAlert } from "lucide-react";
import { ICON_SIZE } from "@/lib/utils";

export const description = "An interactive bar chart";

const chartData = [
  { date: "2024-04-01", totalTasks: 222, tasksCreated: 150 },
  { date: "2024-04-02", totalTasks: 97, tasksCreated: 180 },
  { date: "2024-04-03", totalTasks: 167, tasksCreated: 120 },
  { date: "2024-04-04", totalTasks: 242, tasksCreated: 260 },
  { date: "2024-04-05", totalTasks: 373, tasksCreated: 290 },
  { date: "2024-04-06", totalTasks: 301, tasksCreated: 340 },
  { date: "2024-04-07", totalTasks: 245, tasksCreated: 180 },
  { date: "2024-04-08", totalTasks: 409, tasksCreated: 320 },
  { date: "2024-04-09", totalTasks: 59, tasksCreated: 110 },
  { date: "2024-04-10", totalTasks: 261, tasksCreated: 190 },
  { date: "2024-04-11", totalTasks: 327, tasksCreated: 350 },
  { date: "2024-04-12", totalTasks: 292, tasksCreated: 210 },
  { date: "2024-04-13", totalTasks: 342, tasksCreated: 380 },
  { date: "2024-04-14", totalTasks: 137, tasksCreated: 220 },
  { date: "2024-04-15", totalTasks: 120, tasksCreated: 170 },
  { date: "2024-04-16", totalTasks: 138, tasksCreated: 190 },
  { date: "2024-04-17", totalTasks: 446, tasksCreated: 360 },
  { date: "2024-04-18", totalTasks: 364, tasksCreated: 410 },
  { date: "2024-04-19", totalTasks: 243, tasksCreated: 180 },
  { date: "2024-04-20", totalTasks: 89, tasksCreated: 150 },
  { date: "2024-04-21", totalTasks: 137, tasksCreated: 200 },
  { date: "2024-04-22", totalTasks: 224, tasksCreated: 170 },
  { date: "2024-04-23", totalTasks: 138, tasksCreated: 230 },
  { date: "2024-04-24", totalTasks: 387, tasksCreated: 290 },
  { date: "2024-04-25", totalTasks: 215, tasksCreated: 250 },
  { date: "2024-04-26", totalTasks: 75, tasksCreated: 130 },
  { date: "2024-04-27", totalTasks: 383, tasksCreated: 420 },
  { date: "2024-04-28", totalTasks: 122, tasksCreated: 180 },
  { date: "2024-04-29", totalTasks: 315, tasksCreated: 240 },
  { date: "2024-04-30", totalTasks: 454, tasksCreated: 380 },
  { date: "2024-05-01", totalTasks: 165, tasksCreated: 220 },
  { date: "2024-05-02", totalTasks: 293, tasksCreated: 310 },
  { date: "2024-05-03", totalTasks: 247, tasksCreated: 190 },
  { date: "2024-05-04", totalTasks: 385, tasksCreated: 420 },
  { date: "2024-05-05", totalTasks: 481, tasksCreated: 390 },
  { date: "2024-05-06", totalTasks: 498, tasksCreated: 520 },
  { date: "2024-05-07", totalTasks: 388, tasksCreated: 300 },
  { date: "2024-05-08", totalTasks: 149, tasksCreated: 210 },
  { date: "2024-05-09", totalTasks: 227, tasksCreated: 180 },
  { date: "2024-05-10", totalTasks: 293, tasksCreated: 330 },
  { date: "2024-05-11", totalTasks: 335, tasksCreated: 270 },
  { date: "2024-05-12", totalTasks: 197, tasksCreated: 240 },
  { date: "2024-05-13", totalTasks: 197, tasksCreated: 160 },
  { date: "2024-05-14", totalTasks: 448, tasksCreated: 490 },
  { date: "2024-05-15", totalTasks: 473, tasksCreated: 380 },
  { date: "2024-05-16", totalTasks: 338, tasksCreated: 400 },
  { date: "2024-05-17", totalTasks: 499, tasksCreated: 420 },
  { date: "2024-05-18", totalTasks: 315, tasksCreated: 350 },
  { date: "2024-05-19", totalTasks: 235, tasksCreated: 180 },
  { date: "2024-05-20", totalTasks: 177, tasksCreated: 230 },
  { date: "2024-05-21", totalTasks: 82, tasksCreated: 140 },
  { date: "2024-05-22", totalTasks: 81, tasksCreated: 120 },
  { date: "2024-05-23", totalTasks: 252, tasksCreated: 290 },
  { date: "2024-05-24", totalTasks: 294, tasksCreated: 220 },
  { date: "2024-05-25", totalTasks: 201, tasksCreated: 250 },
  { date: "2024-05-26", totalTasks: 213, tasksCreated: 170 },
  { date: "2024-05-27", totalTasks: 420, tasksCreated: 460 },
  { date: "2024-05-28", totalTasks: 233, tasksCreated: 190 },
  { date: "2024-05-29", totalTasks: 78, tasksCreated: 130 },
  { date: "2024-05-30", totalTasks: 340, tasksCreated: 280 },
  { date: "2024-05-31", totalTasks: 178, tasksCreated: 230 },
  { date: "2024-06-01", totalTasks: 178, tasksCreated: 200 },
  { date: "2024-06-02", totalTasks: 470, tasksCreated: 410 },
  { date: "2024-06-03", totalTasks: 103, tasksCreated: 160 },
  { date: "2024-06-04", totalTasks: 439, tasksCreated: 380 },
];

const chartConfig = {
  views: {
    label: "Tasks",
  },
  totalTasks: {
    label: "Total Tasks",
    color: "var(--primary)",
  },
  tasksCreated: {
    label: "Tasks Created",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function TodoOverview() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("totalTasks");

  const total = React.useMemo(
    () => ({
      totalTasks: chartData.reduce((acc, curr) => acc + curr.totalTasks, 0),
      tasksCreated: chartData.reduce((acc, curr) => acc + curr.tasksCreated, 0),
    }),
    []
  );

  return (
    <main className="space-y-4">
      <div className="mt-2 bg-yellow-600 rounded-lg p-2 w-fit">
        <p className="text-xs flex items-center gap-1">
          <CircleAlert className={`${ICON_SIZE.medium}`} /> This is just a
          preview for what&apos;s to come. Here is a dummy graph
        </p>
      </div>
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
            <CardTitle>Bar Chart - Interactive</CardTitle>
            <CardDescription>
              <p>Showing Dummy tasks data(Will be binding soon)</p>
            </CardDescription>
          </div>
          <div className="flex">
            {["totalTasks", "tasksCreated"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="data-[active=true]:bg-muted/50 relative z-30 cursor-pointer flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-muted-foreground text-xs">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </main>
  );
}
