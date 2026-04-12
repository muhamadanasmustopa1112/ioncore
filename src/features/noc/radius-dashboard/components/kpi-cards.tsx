"use client";

import { useMemo } from "react";
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
  const { kpi } = useRadiusDashboardStore();

  const items = useMemo(() => [
    {
      label: "Total Sessions",
      value: kpi.totalSessions.toLocaleString(),
      icon: RiUserVoiceLine,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      trend: kpi.trend.sessions,
      dataSource: "Data diambil dari akumulasi Log RADIUS Accounting (Riwayat koneksi PPP Users)"
    },
    {
      label: "Active Users",
      value: kpi.activeUsers.toLocaleString(),
      icon: RiBaseStationLine,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      trend: kpi.trend.users,
      dataSource: "Data diambil dari sesi aktif yang sedang terhubung di seluruh Router [NAS]"
    },
    {
      label: "Auth Success Rate",
      value: `${kpi.authSuccessRate}%`,
      icon: RiShieldFlashLine,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      trend: 2.4,
      dataSource: "Tingkat keberhasilan PPP Users saat berupaya melakukan koneksi/login"
    },
    {
      label: "Total Traffic",
      value: kpi.totalTraffic,
      icon: RiExchangeBoxLine,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      trend: -1.2,
      dataSource: "Akumulasi pemakaian kuota data (Upload/Download) dari seluruh pelanggan"
    }
  ], [kpi]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md bg-white hover:shadow-lg transition-shadow duration-300 rounded-3xl">
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
