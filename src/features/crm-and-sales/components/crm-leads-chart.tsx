"use client";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const leadsChartOptions: ApexOptions = {
  chart: {
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: "inherit",
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 3 },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.15, opacityTo: 0, stops: [0, 100] },
  },
  colors: ["hsl(var(--primary))"],
  xaxis: {
    categories: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    labels: { style: { fontSize: "11px", fontWeight: "700" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { show: false },
  grid: {
    borderColor: "hsl(var(--border))",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
  },
  tooltip: { theme: "light" },
};
const leadsChartSeries = [
  { name: "Potential Leads", data: [42, 38, 45, 55, 50, 68, 60, 78, 72, 95, 85, 110] },
];
export function CrmLeadsChart() {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1">
          <CardTitle>{t("common.monthlyPotentialLeads")}</CardTitle>
          <CardDescription>{t("common.leadGenerationTrend")}</CardDescription>
        </div>
        <CardToolbar>
          <Button variant="ghost" mode="link">
            <TrendingUp />
            {t("common.viewReport")}
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardContent className="pt-0">
        <ApexChart
          type="area"
          height={300}
          options={leadsChartOptions}
          series={leadsChartSeries}
        />
      </CardContent>
    </Card>
  );
}
