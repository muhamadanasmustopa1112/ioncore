"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { 
  RiUserVoiceLine, 
  RiBaseStationLine, 
  RiShieldFlashLine,
  RiArrowRightUpLine,
  RiArrowRightDownLine,
  RiExchangeBoxLine,
  RiInformationLine
} from "@remixicon/react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useRadiusDashboardStore } from "../store/use-radius-dashboard-store";

export function RadiusKpiCards() {
  const { t } = useTranslation();
  const { kpi } = useRadiusDashboardStore();

  const items = useMemo(() => [
    {
      label: t("radius.totalSessions", "Total Sessions"),
      value: kpi.totalSessions.toLocaleString(),
      icon: RiUserVoiceLine,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: kpi.trend.sessions,
      dataSource: t("radius.totalSessionsTooltip", "Data from RADIUS Accounting log accumulation (PPP Users connection history)")
    },
    {
      label: t("radius.activeUsers", "Active Users"),
      value: kpi.activeUsers.toLocaleString(),
      icon: RiBaseStationLine,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      trend: kpi.trend.users,
      dataSource: t("radius.activeUsersTooltip", "Data from active sessions currently connected across all Routers [NAS]")
    },
    {
      label: t("radius.authSuccessRate", "Auth Success Rate"),
      value: `${kpi.authSuccessRate}%`,
      icon: RiShieldFlashLine,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      trend: 2.4,
      dataSource: t("radius.authSuccessRateTooltip", "PPP Users success rate when attempting to connect/login")
    },
    {
      label: t("radius.totalTraffic", "Total Traffic"),
      value: kpi.totalTraffic,
      icon: RiExchangeBoxLine,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      trend: -1.2,
      dataSource: t("radius.totalTrafficTooltip", "Accumulated data quota usage (Upload/Download) from all customers")
    }
  ], [kpi, t]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <Card key={index} className="border-none shadow-md bg-card rounded-3xl overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${item.bgColor} ${item.color}`}>
                  <item.icon className="size-6" />
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${item.trend > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                    {item.trend > 0 ? <RiArrowRightUpLine className="size-3" /> : <RiArrowRightDownLine className="size-3" />}
                    {Math.abs(item.trend)}%
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <RiInformationLine className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent variant="dark" className="max-w-[200px] text-center">
                      {item.dataSource}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                  {item.label}
                </p>
                <h3 className="text-2xl font-black text-foreground mt-1">
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
