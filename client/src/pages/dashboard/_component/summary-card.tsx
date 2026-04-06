import { FC } from "react";
import CountUp from "react-countup";
import { TrendingDownIcon, TrendingUpIcon, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { formatPercentage } from "@/lib/format-percentage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DateRangeEnum, DateRangeType } from "@/components/date-range-select";

type CardType = "balance" | "income" | "expenses" | "savings";
type CardStatus = {
  label: string;
  color: string;
  Icon: LucideIcon;
  description?: string;
};
interface SummaryCardProps {
  title: string;
  value?: number;
  dateRange?: DateRangeType;
  percentageChange?: number;
  isPercentageValue?: boolean;
  isLoading?: boolean;
  expenseRatio?: number;
  cardType: CardType;
}

const getCardStatus = (
  value: number,
  cardType: CardType,
  expenseRatio?: number
): CardStatus => {
 if (cardType === "savings") {
    if (value === 0) {
      return {
        label: "No Savings Record",
        color: "text-muted-foreground",
        Icon: TrendingDownIcon,
      };
    }

    if (value < 10) {
      return {
        label: "Low Savings",
        color: "text-destructive",
        Icon: TrendingDownIcon,
        description: `Only ${value.toFixed(1)}% saved`,
      };
    }

    if (value < 20) {
      return {
        label: "Moderate",
        color: "text-yellow-500",
        Icon: TrendingDownIcon,
        description: `${expenseRatio?.toFixed(0)}% spent`,
      };
    }

    if (expenseRatio && expenseRatio > 75) {
      return {
        label: "High Spend",
        color: "text-destructive",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }

    if (expenseRatio && expenseRatio > 60) {
      return {
        label: "Warning: High Spend",
        color: "text-orange-500",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }

    return {
      label: "Good Savings",
      color: "text-primary",
      Icon: TrendingUpIcon,
    };
  }

  if (value === 0) {
    const typeLabel =
      cardType === "income"
        ? "Income"
        : cardType === "expenses"
          ? "Expenses"
          : "Balance";

    return {
      label: `No ${typeLabel}`,
      color: "text-muted-foreground",
      Icon: TrendingDownIcon,
      description: ``,
    };
  }

  if (cardType === "balance" && value < 0) {
    return {
      label: "Overdrawn",
      color: "text-destructive",
      Icon: TrendingDownIcon,
      description: "Balance is negative",
    };
  }

  return {
    label: "",
    color: "",
    Icon: TrendingDownIcon,
  };
};

const getTrendDirection = (value: number, cardType: CardType) => {
  if (cardType === "expenses") {
    return value <= 0 ? "positive" : "negative";
  }
  return value >= 0 ? "positive" : "negative";
};

const SummaryCard: FC<SummaryCardProps> = ({
  title,
  value = 0,
  dateRange,
  percentageChange,
  isPercentageValue,
  isLoading,
  expenseRatio,
  cardType = "balance",
}) => {
  const status = getCardStatus(value, cardType, expenseRatio);
  const showTrend =
    percentageChange !== undefined &&
    percentageChange !== null &&
    cardType !== "savings";

  const trendDirection =
    showTrend && percentageChange !== 0
      ? getTrendDirection(percentageChange, cardType)
      : null;

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

const formatCountupValue = (val: number) => {
  return isPercentageValue
    ? formatPercentage(val, { decimalPlaces: 1 })
    : formatCurrency(val, {
        currency: 'INR',
        isExpense: cardType === "expenses",
        showSign: cardType === "balance" && val < 0,
      });
};

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className={cn(
            "text-3xl font-bold tracking-tight",
            cardType === "balance" && value < 0 ? "text-destructive" : "text-foreground"
          )}
        >
          <CountUp
            start={0}
            end={value}
            preserveValue
            decimals={2}
            decimalPlaces={2}
            formattingFn={formatCountupValue}
          />
        </div>

        <div className="text-sm">
          {cardType === "savings" ? (
            <div className="flex items-center gap-1.5">
              <status.Icon className={cn("size-3.5", status.color)} />
              <span className={cn("text-xs", status.color)}>
                {status.label} {value !== 0 && `(${formatPercentage(value)})`}
              </span>
              {status.description && (
                <span className="text-muted-foreground text-xs ml-1">
                  • {status.description}
                </span>
              )}
            </div>
          ) : dateRange?.value === DateRangeEnum.ALL_TIME ? (
            <span className="text-muted-foreground text-xs">Showing {dateRange?.label}</span>
          ) : value === 0 || status.label ? (
            <div className="flex items-center gap-1.5">
              <status.Icon className={cn("size-3.5", status.color)} />
              <span className={cn("text-xs", status.color)}>{status.label}</span>
              {status.description && (
                <span className="text-muted-foreground text-xs">• {status.description}</span>
              )}
              {!status.description && (
                <span className="text-muted-foreground text-xs">• {dateRange?.label}</span>
              )}
            </div>
          ) : showTrend ? (
            <div className="flex items-center gap-1.5">
              {percentageChange !== 0 && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    trendDirection === "positive"
                      ? "text-primary"
                      : "text-destructive"
                  )}
                >
                  {trendDirection === "positive" ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  <span>
                    {formatPercentage(percentageChange || 0, {
                      showSign: percentageChange !== 0,
                      isExpense: cardType === "expenses",
                      decimalPlaces: 1,
                    })}
                  </span>
                </div>
              )}

              {percentageChange === 0 && (
                <div className="flex items-center gap-0.5 text-muted-foreground text-xs">
                  <TrendingDownIcon className="size-3" />
                  <span>
                    {formatPercentage(0, {
                      showSign: false,
                      decimalPlaces: 1,
                    })}
                  </span>
                </div>
              )}
              <span className="text-muted-foreground text-xs">• {dateRange?.label}</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;