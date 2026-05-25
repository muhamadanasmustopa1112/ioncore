"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { 
  Card, 
  CardHeader, 
  CardHeading, 
  CardContent 
} from "@/components/ui/card";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { RiInformationLine } from "@remixicon/react";
import { RADIUS_SESSION_TRENDS } from "../data/mock-radius-data";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function RadiusSessionChart() {
  const { t } = useTranslation();
  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      id: "radius-session-trend",
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false },
      fontFamily: 'inherit',
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#3b82f6']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      }
    },
    xaxis: {
      categories: RADIUS_SESSION_TRENDS.map(t => t.timestamp),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: 'var(--muted-foreground)', fontSize: '10px', fontWeight: 600 }
      }
    },
    yaxis: {
      labels: {
        style: { colors: 'var(--muted-foreground)', fontSize: '10px', fontWeight: 600 },
        formatter: (val) => (val / 1000).toFixed(0) + 'k'
      }
    },
    grid: {
      borderColor: 'var(--border)',
      strokeDashArray: 4,
      padding: { left: 0, right: 0, top: 0, bottom: 0 }
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val.toLocaleString()} ${t("radius.activeSessions", "Active Sessions")}`
      }
    },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false }
  }), [t]);

  const series = useMemo(() => [{
    name: t("radius.sessions", "Sessions"),
    data: RADIUS_SESSION_TRENDS.map(t => t.count)
  }], [t]);

  return (
    <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden">
      <CardHeader className="pb-2 flex-row justify-between items-center">
        <CardHeading className="text-sm font-black uppercase tracking-widest text-foreground">
          {t("radius.sessionActivity", "Session Activity (24h)")}
        </CardHeading>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors mr-4">
                <RiInformationLine className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent variant="dark">
              {t("radius.sessionActivityTooltip", "This chart shows the fluctuation of customers online simultaneously across all regions")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <Chart
            options={chartOptions}
            series={series}
            type="area"
            height="100%"
            width="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}
