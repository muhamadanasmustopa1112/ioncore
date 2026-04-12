"use client";

import { useMemo } from "react";
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
import { NAS_PERFORMANCE } from "../data/mock-radius-data";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function RadiusTopNasChart() {
  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      id: "radius-top-nas",
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 8,
        distributed: true,
      }
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: { colors: ['#fff'], fontWeight: 700 },
      formatter: (val, opt) => opt.w.globals.labels[opt.dataPointIndex] + ": " + val.toLocaleString(),
      offsetX: 0,
    },
    xaxis: {
      categories: NAS_PERFORMANCE.map(n => n.nasName),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { show: false }
    },
    grid: { show: false },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => val.toLocaleString() + ' Active Sessions'
      }
    },
    legend: { show: false }
  }), []);

  const series = useMemo(() => [{
    name: "Sessions",
    data: NAS_PERFORMANCE.map(n => n.activeSessions)
  }], []);

  return (
    <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden h-full">
      <CardHeader className="pb-2 flex-row justify-between items-center">
        <CardHeading className="text-sm font-black uppercase tracking-widest text-foreground">
          Top NAS Performance
        </CardHeading>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors mr-4">
                <RiInformationLine className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent variant="dark" className="max-w-[200px] text-center">
              Data ini merangkum jumlah pelanggan aktif per Router yang terdaftar di bagian Router [NAS]
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <Chart
            options={chartOptions}
            series={series}
            type="bar"
            height="100%"
            width="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}
