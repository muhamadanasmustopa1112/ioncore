"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRadiusDashboardStore } from "../store/use-radius-dashboard-store";
import { RiNodeTree, RiCheckDoubleLine, RiErrorWarningLine, RiCloseCircleLine, RiQuestionLine } from "@remixicon/react";
import { useNocTopologyStatus } from "../api/get-topology-status";

export function NocTopologyStatus() {
  const { nocTopologyStatus: mockStatus } = useRadiusDashboardStore();
  const { data: statusData, isLoading } = useNocTopologyStatus();

  const nocTopologyStatus = statusData || mockStatus;

  const sections = [
    { key: "pops", label: "POPs", icon: RiNodeTree },
    { key: "olts", label: "OLTs", icon: RiNodeTree },
    { key: "odps", label: "ODPs", icon: RiNodeTree },
    { key: "links", label: "Links", icon: RiNodeTree },
  ] as const;

  const statusConfig = [
    { key: "UP", label: "Up", icon: RiCheckDoubleLine, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { key: "DEGRADED", label: "Degraded", icon: RiErrorWarningLine, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { key: "DOWN", label: "Down", icon: RiCloseCircleLine, color: "text-rose-500", bgColor: "bg-rose-500/10" },
    { key: "UNKNOWN", label: "Unknown", icon: RiQuestionLine, color: "text-slate-400", bgColor: "bg-slate-400/10" },
  ] as const;

  return (
    <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-black tracking-widest uppercase flex items-center gap-2">
          <RiNodeTree className="size-5 text-primary" />
          Topology Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => (
            <div key={section.key} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {statusConfig.map((status) => {
                  const value = nocTopologyStatus[section.key][status.key];
                  return (
                    <div
                      key={status.key}
                      className={`p-3 rounded-2xl border border-transparent transition-all duration-300 hover:border-border ${value > 0 ? status.bgColor : 'bg-secondary/20 opacity-60'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <status.icon className={`size-4 ${value > 0 ? status.color : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-bold ${value > 0 ? status.color : 'text-muted-foreground'}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="text-xl font-black">
                        {value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
