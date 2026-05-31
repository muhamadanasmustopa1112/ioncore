"use client";

import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyRevenueByBranch, formatCompactIDR } from "../data/dummy-report-data";

export function RevenueByBranchChart() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("billing.report.chart.revenueByBranch", "Revenue by Branch (Top 8)")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyRevenueByBranch} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tickFormatter={formatCompactIDR} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis type="category" dataKey="branch" width={110} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
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
              <Bar dataKey="revenue" name="Revenue" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
