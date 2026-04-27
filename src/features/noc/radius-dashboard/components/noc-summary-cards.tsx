"use client";

import { useMemo } from "react";
import { 
  RiAlertLine, 
  RiErrorWarningLine, 
  RiSignalWifiErrorLine,
  RiCloudOffLine,
  RiPulseLine,
  RiUserUnfollowLine,
  RiInformationLine
} from "@remixicon/react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRadiusDashboardStore } from "../store/use-radius-dashboard-store";
import { useNocSummary } from "../api/get-summary";

export function NocSummaryCards() {
  const { nocSummary: mockSummary } = useRadiusDashboardStore();
  const { data: summaryData, isLoading } = useNocSummary();

  const nocSummary = summaryData || mockSummary;

  const items = useMemo(() => [
    {
      label: "Total Warnings",
      value: nocSummary.total_warnings,
      icon: RiAlertLine,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      description: "Total warning alerts detected in the network"
    },
    {
      label: "Open Warnings",
      value: nocSummary.open_warnings,
      icon: RiErrorWarningLine,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      description: "Active warnings that require attention"
    },
    {
      label: "Total Incidents",
      value: nocSummary.total_incidents,
      icon: RiSignalWifiErrorLine,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      description: "Total critical incidents recorded"
    },
    {
      label: "Open Incidents",
      value: nocSummary.open_incidents,
      icon: RiCloudOffLine,
      color: "text-red-600",
      bgColor: "bg-red-600/10",
      description: "Active critical incidents currently being handled"
    },
    {
      label: "Down Nodes",
      value: nocSummary.down_nodes,
      icon: RiSignalWifiErrorLine,
      color: "text-red-700",
      bgColor: "bg-red-700/10",
      description: "Network nodes that are currently unreachable"
    },
    {
      label: "High Utilization Ports",
      value: nocSummary.high_utilization_ports,
      icon: RiPulseLine,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      description: "Ports with traffic utilization above threshold"
    },
    {
      label: "Flapping Subscribers",
      value: nocSummary.flapping_subscribers,
      icon: RiUserUnfollowLine,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Subscribers with frequent connection drops"
    }
  ], [nocSummary]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {items.map((item, index) => (
          <Card key={index} className="border-none shadow-md bg-card rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${item.bgColor} ${item.color}`}>
                  <item.icon className="size-5" />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <RiInformationLine className="size-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent variant="dark" className="max-w-[200px] text-center">
                    {item.description}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">
                  {item.label}
                </p>
                <h3 className="text-xl font-black text-foreground mt-1">
                  {item.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
