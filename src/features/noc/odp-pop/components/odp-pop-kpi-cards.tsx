"use client";

import { useMemo } from "react";
import { 
  RiMapPinLine, 
  RiCheckboxCircleLine, 
  RiTimeLine,
  RiDatabase2Line
} from "@remixicon/react";
import { Card, CardContent } from "@/components/ui/card";
import { DUMMY_POP_DATA } from "../data/dummy-odp-pop";

export function OdpPopKpiCards() {
  const stats = useMemo(() => {
    const total = DUMMY_POP_DATA.length;
    const validated = DUMMY_POP_DATA.filter(p => p.isValidated).length;
    const pending = total - validated;
    
    // Calculate total ODPs for additional context
    const totalOdp = DUMMY_POP_DATA.reduce((acc, curr) => acc + curr.odpCount, 0);

    return { total, validated, pending, totalOdp };
  }, []);

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
      label: "Validated POPs",
      value: stats.validated,
      icon: RiCheckboxCircleLine,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      description: "Verified and operational"
    },
    {
      label: "Pending Validation",
      value: stats.pending,
      icon: RiTimeLine,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      description: "Awaiting inspection"
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
