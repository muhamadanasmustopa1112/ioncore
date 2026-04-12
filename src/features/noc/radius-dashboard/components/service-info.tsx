"use client";

import { useMemo } from "react";
import {
  RiServerLine,
  RiRouterLine,
  RiGroupLine,
  RiNodeTree,
  RiInformationLine,
  RiTimeLine,
  RiCheckboxCircleLine
} from "@remixicon/react";
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
import { useRadiusDashboardStore } from "../store/use-radius-dashboard-store";

export function RadiusServiceInfo() {
  const { serviceInfo } = useRadiusDashboardStore();

  const infoItems = useMemo(() => [
    {
      label: "Uptime",
      value: serviceInfo.uptime,
      icon: RiTimeLine,
      description: "Lama waktu server RADIUS berjalan tanpa henti"
    },
    {
      label: "Registered NAS",
      value: serviceInfo.totalNas,
      icon: RiRouterLine,
      description: "Total Router Mikrotik yang terhubung di sistem"
    },
    {
      label: "Total Customers",
      value: serviceInfo.totalCustomers.toLocaleString(),
      icon: RiGroupLine,
      description: "Total seluruh akun PPP Users yang terdaftar"
    },
    {
      label: "Active Plans",
      value: serviceInfo.totalBandwidths + serviceInfo.totalProfileGroups,
      icon: RiNodeTree,
      description: "Gabungan total Bandwidth dan Profile Group"
    }
  ], [serviceInfo]);

  return (
    <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden h-full">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <RiServerLine className="size-4 text-primary" />
          </div>
          <CardHeading className="text-sm font-black uppercase tracking-widest text-foreground">
            Service Information
          </CardHeading>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
            Core Active
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-1">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="group flex items-center justify-between p-3 rounded-2xl hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-colors text-muted-foreground group-hover:text-primary">
                  <item.icon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                    {item.label}
                  </span>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help mt-1">
                          <span className="text-xs font-black text-foreground">
                            {item.value}
                          </span>
                          <RiInformationLine className="size-3 text-muted-foreground/50" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent variant="dark" className="text-[10px]">
                        {item.description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <RiCheckboxCircleLine className="size-4 text-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
              System Health
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">CPU Load</p>
              <div className="h-1.5 w-full bg-primary/10 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-primary w-[24%] rounded-full shadow-[0_0_5px_rgba(var(--primary),0.5)]" />
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">RAM Usage</p>
              <div className="h-1.5 w-full bg-primary/10 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-primary w-[42%] rounded-full shadow-[0_0_5px_rgba(var(--primary),0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
