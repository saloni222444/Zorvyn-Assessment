import * as React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";

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
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateRangeType } from "@/components/date-range-select";
import { formatCurrency } from "@/lib/format-currency";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercentage } from "@/lib/format-percentage";
import { EmptyState } from "@/components/empty-state";
import { useExpensePieChartBreakdownQuery } from "@/features/analytics/analyticsAPI";

// Vibrant colors for pie chart - works in both themes
const PIE_COLORS = [
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#10b981", // Emerald
  "#ec4899", // Pink
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#f97316", // Orange
  "#84cc16", // Lime
];

const ExpensePieChart = (props: { dateRange?: DateRangeType }) => {
  const { dateRange } = props;

  const { data, isFetching } = useExpensePieChartBreakdownQuery({
    preset: dateRange?.value,
  });
  const categories = data?.data?.breakdown || [];
  const totalSpent = data?.data?.totalSpent || 0;

  if (isFetching) {
    return <PieChartSkeleton />;
  }

  // Custom legend component with theme-aware text
  const CustomLegend = () => {
    return (
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 mt-4">
        {categories.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
            ></div>
            <div className="flex justify-between w-full">
              <span className="text-xs font-medium truncate capitalize text-foreground">
                {entry.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  ₹{entry.value.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-muted-foreground/70">
                  ({formatPercentage(entry.percentage, { decimalPlaces: 0 })})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="!shadow-none border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-foreground">Expenses Breakdown</CardTitle>
        <CardDescription className="text-muted-foreground">
          Total expenses {dateRange?.label}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[313px]">
        <div className="w-full">
          {categories?.length === 0 ? (
            <EmptyState
              title="No expenses found"
              description="There are no expenses recorded for this period."
            />
          ) : (
            <ChartContainer
              config={{
                amount: { label: "Amount" },
              }}
              className="mx-auto aspect-square h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />

                <Pie
                  data={categories}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {categories.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}

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
                              className="fill-foreground text-2xl font-bold"
                            >
                              ₹{totalSpent.toLocaleString('en-IN')}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-xs"
                            >
                              Total Spent
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <ChartLegend content={<CustomLegend />} />
              </PieChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PieChartSkeleton = () => (
  <Card className="!shadow-none border border-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-32 mt-1" />
    </CardHeader>
    <CardContent className="h-[313px]">
      <div className="w-full flex items-center justify-center">
        <div className="relative w-[200px] h-[200px]">
          <Skeleton className="rounded-full w-full h-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <div className="mt-0 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default ExpensePieChart;