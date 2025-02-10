import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
const chartData = [
  { year: "2020", renters: 100, rooms: 20 },
  { year: "2021", renters: 200, rooms: 10 },
  { year: "2022", renters: 300, rooms: 14 },
  { year: "2023", renters: 300, rooms: 7 },
  { year: "2024", renters: 400, rooms: 5 },
  { year: "2025", renters: 500, rooms: 5 },
];

const chartConfig = {
  renters: {
    label: "Renters",
    color: "hsl(var(--chart-1))",
  },
  rooms: {
    label: "Empty Rooms",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function BarChartComp() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Bar Chart - Houses And Renters</CardTitle>
        <CardDescription>By Year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="renters" fill="var(--color-renters)" radius={4} />
            <Bar dataKey="rooms" fill="var(--color-rooms)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none ">
          Trending up by 5.2% this year <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground flex">
          Showing total<p className="text-orange-600">&nbsp;Renters&nbsp;</p>
          and
          <p className="text-teal-600">&nbsp;Empty Houses</p> for the last 6
          years
        </div>
      </CardFooter>
    </Card>
  );
}
