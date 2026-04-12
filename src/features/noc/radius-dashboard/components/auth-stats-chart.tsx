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
import { RADIUS_AUTH_STATS } from "../data/mock-radius-data";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function RadiusAuthStatsChart() {
  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      id: "radius-auth-stats",
      fontFamily: 'inherit',
    },
    labels: ['SUCCESS', 'FAILED', 'REJECT', 'TIMEOUT'],
    colors: ['#10b981', '#f43f5e', '#f59e0b', '#3b82f6'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Login',
              fontSize: '10px',
              fontWeight: 900,
              formatter: () => RADIUS_AUTH_STATS.reduce((a, b) => a + b.count, 0).toLocaleString()
            }
          }
        }
      }
    },
    legend: {
      position: 'bottom',
      fontSize: '11px',
      fontWeight: 700,
      labels: { colors: '#64748b' },
      markers: { size: 6, shape: 'rect' }
    },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val) => val.toLocaleString() + ' attempts'
      }
    }
  }), []);

  const series = useMemo(() => RADIUS_AUTH_STATS.map(s => s.count), []);

  return (
    <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden h-full">
      <CardHeader className="pb-2 flex-row justify-between items-center">
        <CardHeading className="text-sm font-black uppercase tracking-widest text-foreground">
          Auth Distribution
        </CardHeading>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors mr-4">
                <RiInformationLine className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent variant="dark" className="max-w-[200px] text-center">
              Data ini merangkum seluruh aktivitas login PPP Users (Berhasil, Salah Password, atau Gangguan)
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex items-center justify-center pt-0">
        <div className="h-[280px] w-full max-w-[300px]">
          <Chart
            options={chartOptions}
            series={series}
            type="donut"
            height="100%"
            width="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}
