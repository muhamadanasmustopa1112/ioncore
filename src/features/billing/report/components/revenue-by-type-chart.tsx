"use client";

import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyRevenueByType, formatCompactIDR } from "../data/dummy-report-data";

const COLORS = ["var(--color-primary)", "var(--color-secondary)"];

export function RevenueByTypeChart() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("billing.report.chart.revenueByType", "Revenue by Customer Type")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dummyRevenueByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {dummyRevenueByType.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6">
            {dummyRevenueByType.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
                <span className="font-medium">{formatCompactIDR(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
