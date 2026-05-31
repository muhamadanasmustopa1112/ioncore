"use client";

import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyCommissionSummary, formatCompactIDR } from "../data/dummy-report-data";

export function CommissionSummaryChart() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("billing.report.chart.commissionSummary", "Commission Summary by Rep")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyCommissionSummary}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="rep" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickFormatter={formatCompactIDR} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                formatter={(value: number) => formatCompactIDR(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 700, marginBottom: "4px" }}
              />
              <Legend />
              <Bar
                dataKey="paid"
                name={t("billing.report.chart.paid", "Paid")}
                stackId="a"
                fill="var(--color-primary)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="pending"
                name={t("billing.report.chart.pending", "Pending")}
                stackId="a"
                fill="var(--color-secondary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
