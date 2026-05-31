"use client";

import { useTranslation } from "react-i18next";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiBankCardLine,
  RiMoneyDollarCircleLine,
  RiPercentLine,
  RiWalletLine,
} from "@remixicon/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiData {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: React.ReactNode;
}

export function KpiCards() {
  const { t } = useTranslation();

  const kpis: KpiData[] = [
    {
      title: t("billing.report.kpi.mrr", "Monthly Recurring Revenue"),
      value: "Rp 245.5M",
      trend: 12,
      trendLabel: t("billing.report.kpi.vsLastMonth", "vs last month"),
      icon: <RiMoneyDollarCircleLine className="size-5" />,
    },
    {
      title: t("billing.report.kpi.totalRevenue", "Total Revenue"),
      value: "Rp 312.8M",
      trend: 8,
      trendLabel: t("billing.report.kpi.vsLastMonth", "vs last month"),
      icon: <RiBankCardLine className="size-5" />,
    },
    {
      title: t("billing.report.kpi.outstandingAr", "Outstanding AR"),
      value: "Rp 67.3M",
      trend: -5,
      trendLabel: t("billing.report.kpi.vsLastMonth", "vs last month"),
      icon: <RiWalletLine className="size-5" />,
    },
    {
      title: t("billing.report.kpi.collectionRate", "Collection Rate"),
      value: "78.5%",
      trend: 3,
      trendLabel: t("billing.report.kpi.vsLastMonth", "vs last month"),
      icon: <RiPercentLine className="size-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <div className="bg-muted rounded-lg p-2 ml-2">{kpi.icon}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              {kpi.trend >= 0 ? (
                <RiArrowUpLine className="size-3 text-emerald-500" />
              ) : (
                <RiArrowDownLine className="size-3 text-red-500" />
              )}
              <span
                className={cn(
                  "font-medium",
                  kpi.trend >= 0 ? "text-emerald-500" : "text-red-500",
                )}
              >
                {kpi.trend >= 0 ? "+" : ""}
                {kpi.trend}%
              </span>
              <span className="text-muted-foreground">{kpi.trendLabel}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
