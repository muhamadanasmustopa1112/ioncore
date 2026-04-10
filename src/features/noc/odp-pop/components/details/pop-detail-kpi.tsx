"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RiRouterLine, RiSignalTowerLine, RiFlashlightLine, RiToolsLine } from "@remixicon/react";

export function PopDetailKpi({ pop }: { pop: any }) {
  const stats = [
    {
      title: "TOTAL DEVICES",
      value: "142",
      change: "+2%",
      trend: "up",
      icon: RiRouterLine,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "ONLINE DEVICES",
      value: "138",
      change: "-1%",
      trend: "down",
      icon: RiSignalTowerLine,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "OFFLINE DEVICES",
      value: "4",
      change: "+50%",
      trend: "up",
      icon: RiFlashlightLine,
      color: "text-rose-600",
      bg: "bg-rose-50"
    },
    {
      title: "RACK UTILIZATION",
      value: "78%",
      progress: 78,
      icon: RiToolsLine,
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.title}</span>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="size-5" />
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-foreground">{stat.value}</span>
                {stat.change && (
                  <span className={`text-xs font-bold mt-1 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stat.change}
                  </span>
                )}
              </div>
              {stat.progress !== undefined && (
                <div className="w-24 bg-muted h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stat.progress}%` }} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

