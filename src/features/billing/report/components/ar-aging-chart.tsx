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
import { dummyArAging, formatCompactIDR } from "../data/dummy-report-data";

export function ArAgingChart() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("billing.report.chart.arAging", "AR Aging Distribution")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyArAging}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="bucket" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
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
              <Bar dataKey="amount" name="Amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
