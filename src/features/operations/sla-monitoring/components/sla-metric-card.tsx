"use client";

import { useTranslation } from "react-i18next";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SlaStatusBadge } from "./sla-status-badge";
import type { SlaMetric, SlaTrend } from "../types";

type SlaMetricCardProps = {
  metric: SlaMetric;
  onClick: () => void;
};

const TREND_CONFIG: Record<
  SlaTrend,
  { icon: typeof TrendingUp; color: string; label: string }
> = {
  up: {
    icon: TrendingUp,
    color: "text-green-600 dark:text-green-400",
    label: "Trending up",
  },
  down: {
    icon: TrendingDown,
    color: "text-red-600 dark:text-red-400",
    label: "Trending down",
  },
  neutral: {
    icon: Minus,
    color: "text-muted-foreground",
    label: "No change",
  },
};

export function SlaMetricCard({ metric, onClick }: SlaMetricCardProps) {
  const { t } = useTranslation();
  const trend = TREND_CONFIG[metric.trend];
  const TrendIcon = trend.icon;

  const formatValue = () => {
    if (typeof metric.value === "string") return metric.value;
    return `${metric.value}${metric.unit === "%" ? "%" : ""}`;
  };

  const formatPrevious = () => {
    if (metric.previous_value === null) return null;
    if (metric.unit === "%") return `${metric.previous_value}%`;
    return String(metric.previous_value);
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30 dark:hover:border-primary/20"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t(`sla.metric.${metric.metric_key}`, metric.name)}
          </p>
          <SlaStatusBadge status={metric.status} />
        </div>

        <div className="mt-4">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {formatValue()}
          </span>
          {metric.unit !== "%" && metric.unit !== "invoices" && (
            <span className="ml-1.5 text-sm text-muted-foreground">
              {metric.unit}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <TrendIcon className={trend.color} size={14} />
          <span className={`text-xs font-medium ${trend.color}`}>
            {t(`sla.trend.${metric.trend}`, trend.label)}
          </span>
          {formatPrevious() !== null && (
            <span className="text-xs text-muted-foreground">
              ({t("sla.from", "from")} {formatPrevious()})
            </span>
          )}
        </div>

        {metric.drilldown_records.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            {metric.drilldown_records.length}{" "}
            {t("sla.recordsBreaching", "records breaching")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
