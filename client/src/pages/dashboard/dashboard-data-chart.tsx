import * as React from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
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
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EmptyState } from "@/components/empty-state";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { DateRangeType } from "@/components/date-range-select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format-currency";
import { useChartAnalyticsQuery } from "@/features/analytics/analyticsAPI";
import { useTheme } from "@/context/theme-provider";

interface PropsType {
  dateRange?: DateRangeType;
}

const DashboardDataChart: React.FC<PropsType> = (props) => {
  const { dateRange } = props;
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  const { data, isFetching } = useChartAnalyticsQuery({
    preset: dateRange?.value,
  });
  const chartData = data?.data?.chartData || [];
  const totalExpenseCount = data?.data?.totalExpenseCount || 0;
  const totalIncomeCount = data?.data?.totalIncomeCount || 0;

  // Theme-based colors
  const isDark = theme === "dark";
  const incomeColor = isDark ? "#8b5cf6" : "#6366f1"; // Purple for income
  const expenseColor = isDark ? "#ef4444" : "#dc2626"; // Red for expenses
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  if (isFetching) {
    return <ChartSkeleton />;
  }

  return (
    <Card className="!shadow-none border border-border !pt-0">
      <CardHeader
        className="flex flex-col items-stretch !space-y-0 border-b border-border !p-0 pr-1 sm:flex-row"
      >
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-0 sm:py-0">
          <CardTitle className="text-lg text-foreground">Transaction Overview</CardTitle>
          <CardDescription className="text-muted-foreground">
            <span>Showing total transactions {dateRange?.label}</span>
          </CardDescription>
        </div>
        <div className="flex">
          {["income", "expenses"].map((key) => {
            const isIncome = key === "income";
            return (
              <div
                key={key}
                className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l 
                sm:border-l border-border sm:px-4 sm:py-6 min-w-36"
              >
                <span className="w-full block text-xs text-muted-foreground">
                  No of {isIncome ? "Income" : "Expenses"}
                </span>
                <span className="flex items-center justify-center gap-2 text-lg font-semibold leading-none sm:text-3xl">
                  {isIncome ? (
                    <TrendingUpIcon className="size-3 ml-2" style={{ color: incomeColor }} />
                  ) : (
                    <TrendingDownIcon className="size-3 ml-2" style={{ color: expenseColor }} />
                  )}
                  <span className="text-foreground">
                    {isIncome ? totalIncomeCount : totalExpenseCount}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-2 h-[300px]">
        {chartData?.length === 0 ? (
          <EmptyState
            title="No transaction data"
            description="There are no transactions recorded for this period."
          />
        ) : (
          <ChartContainer
            config={{
              income: { label: "Income", color: incomeColor },
              expenses: { label: "Expenses", color: expenseColor },
            }}
            className="aspect-auto h-[300px] w-full"
          >
            <AreaChart data={chartData || []}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={incomeColor} stopOpacity={1.0} />
                  <stop offset="95%" stopColor={incomeColor} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={expenseColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={expenseColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={isMobile ? 20 : 25}
                tickFormatter={(value) =>
                  format(new Date(value), isMobile ? "MMM d" : "MMMM d, yyyy")
                }
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
              />
              <ChartTooltip
                cursor={{
                  stroke: gridColor,
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      format(new Date(value), "MMM d, yyyy")
                    }
                    indicator="line"
                    formatter={(value, name) => {
                      const isExpense = name === "expenses";
                      const color = isExpense ? expenseColor : incomeColor;
                      return [
                        <span key={name} style={{ color }}>
                          {formatCurrency(Number(value), {
                            currency: 'INR',
                            showSign: true,
                            compact: true,
                            isExpense,
                          })}
                        </span>,
                        isExpense ? "Expenses" : "Income",
                      ];
                    }}
                  />
                }
              />
              <Area
                dataKey="expenses"
                stackId="1"
                type="monotone"
                fill="url(#expensesGradient)"
                stroke={expenseColor}
                strokeWidth={2}
                className="drop-shadow-sm"
              />
              <Area
                dataKey="income"
                stackId="1"
                type="monotone"
                fill="url(#incomeGradient)"
                stroke={incomeColor}
                strokeWidth={2}
              />
              <ChartLegend
                verticalAlign="bottom"
                content={<ChartLegendContent />}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

const ChartSkeleton = () => (
  <Card className="!shadow-none border border-border !pt-0">
    <CardHeader className="flex flex-col items-stretch !space-y-0 border-b border-border !p-0 pr-1 sm:flex-row">
      <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-0 sm:py-0">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32 mt-1" />
      </div>
      <div className="flex">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l 
            sm:border-l border-border sm:px-4 sm:py-6 min-w-36"
          >
            <Skeleton className="h-4 w-20 mx-auto" />
            <Skeleton className="h-8 w-24 mx-auto mt-1 sm:h-12" />
          </div>
        ))}
      </div>
    </CardHeader>
    <CardContent className="px-2 pt-2 sm:px-6 sm:pt-2 h-[280px]">
      <Skeleton className="h-full w-full" />
    </CardContent>
  </Card>
);

export default DashboardDataChart;