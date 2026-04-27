"use client";

import { useMemo } from "react";
import { 
  RiMapPinLine, 
  RiCheckboxCircleLine, 
  RiTimeLine,
  RiDatabase2Line
} from "@remixicon/react";
import { Card, CardContent } from "@/components/ui/card";
import { PopResponse } from "../types/pop";

export function OdpPopKpiCards({ data: popData }: { data?: PopResponse }) {
  const stats = useMemo(() => {
    const total = popData?.recordsTotal || 0;
    const pops = popData?.data || [];
    
    const active = pops.filter(p => p.status === "ACTIVE").length;
    const warning = pops.filter(p => p.status === "WARNING").length;
    const inactive = pops.filter(p => p.status === "INACTIVE").length;
    
    // For now, if we have limited data (e.g. limit 100), the counts might be partial
    // But it's better than dummy data.
    const totalOdp = pops.reduce((acc, p) => acc + (p.odpCount || 0), 0);

    return { total, active, warning, totalOdp };
  }, [popData]);

  const items = [
    {
      label: "Total POP Infrastructure",
      value: stats.total,
      icon: RiMapPinLine,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Active infrastructure points"
    },
    {
      label: "Active POPs",
      value: stats.active,
      icon: RiCheckboxCircleLine,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      description: "Verified and operational"
    },
    {
      label: "Warning/Issues",
      value: stats.warning,
      icon: RiTimeLine,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      description: "Awaiting inspection or issues"
    },
    {
      label: "Total ODP Nodes",
      value: stats.totalOdp,
      icon: RiDatabase2Line,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      description: "Summary of downstream nodes"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <Card key={index} className="overflow-hidden border-none shadow-md bg-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.bgColor} ${item.color}`}>
                <item.icon className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3 className="text-2xl font-black text-foreground">
                    {item.value}
                  </h3>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
