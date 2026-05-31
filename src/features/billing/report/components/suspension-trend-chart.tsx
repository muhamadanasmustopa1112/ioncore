"use client";

import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyWeeklySuspensions } from "../data/dummy-report-data";

export function SuspensionTrendChart() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("billing.report.chart.suspensionTrend", "Suspension Trend (8 Weeks)")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyWeeklySuspensions}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 700, marginBottom: "4px" }}
              />
              <Line
                type="monotone"
                dataKey="suspensions"
                name={t("billing.report.chart.suspensions", "Suspensions")}
                stroke="var(--color-destructive)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="reactivations"
                name={t("billing.report.chart.reactivations", "Reactivations")}
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
