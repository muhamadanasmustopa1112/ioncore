"use client";

import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import { RiRouterLine, RiSignalTowerLine, RiHashtag, RiGlobalLine } from "@remixicon/react";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DUMMY_OLT_DETAILS } from "@/features/noc/odp-pop/data/dummy-olt-details";
import dynamic from "next/dynamic";

const OltOdpMap = dynamic(() => import("@/features/noc/odp-pop/components/map/olt-odp-map"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-3xl" />
});

export default function OltDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const olt = useMemo(() => 
    Object.values(DUMMY_OLT_DETAILS).flat().find(o => o.id === id)
  , [id]);

  if (!olt) {
    notFound();
  }

  const capacityPercentage = (olt.portsUsed / olt.totalPorts) * 100;

  return (
    <div className="relative h-full w-full flex flex-col gap-y-6 overflow-y-auto px-6 py-4 bg-muted/20">
      <PageBreadcrumb
        items={[
          {
            title: "Network & Orchestration",
            path: paths.dashboard.networkAndOrchestration.root.getHref(),
          },
          { 
            title: "ODP & POP",
            path: paths.dashboard.networkAndOrchestration.odpPop.manage.getHref() 
          },
          { title: `OLT Detail (${olt.name})` },
        ]}
        className="mb-0"
      />

      <div className="flex flex-col gap-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-border/40">
          <div className="flex items-start gap-5">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <RiRouterLine className="size-10 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
                  {olt.name}
                </h1>
                <Badge
                  variant={olt.status === 'active' ? 'success' : 'warning'}
                  appearance="light"
                  className="px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                >
                  {olt.status === 'active' ? 'Online' : 'Warning'}
                </Badge>
              </div>
              <p className="text-muted-foreground font-bold tracking-tight uppercase text-sm">
                {olt.model} • {olt.ipAddress}
              </p>
            </div>
          </div>
        </div>

        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border-none shadow-sm rounded-3xl group hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <RiSignalTowerLine className="size-6" />
              </div>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                Port Capacity
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-foreground">
                  {olt.portsUsed} <span className="text-lg text-muted-foreground ml-1">/ {olt.totalPorts}</span>
                </h3>
                <span className={`text-sm font-black ${
                  capacityPercentage > 90 ? 'text-destructive' : 
                  capacityPercentage > 70 ? 'text-orange-500' : 'text-primary'
                }`}>
                  {Math.round(capacityPercentage)}%
                </span>
              </div>
              <Progress 
                value={capacityPercentage} 
                className="h-2"
                indicatorClassName={
                  capacityPercentage > 90 ? 'bg-destructive' : 
                  capacityPercentage > 70 ? 'bg-orange-500' : 'bg-primary'
                }
              />
            </div>
          </Card>

          <Card className="p-6 bg-white border-none shadow-sm rounded-3xl group hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                <RiHashtag className="size-6" />
              </div>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                ODP Connected
              </span>
            </div>
            <h3 className="text-3xl font-black text-foreground">
              {olt.odpCount} <span className="text-lg text-muted-foreground ml-1 uppercase">Units</span>
            </h3>
          </Card>

          <Card className="p-6 bg-white border-none shadow-sm rounded-3xl group hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                <RiGlobalLine className="size-6" />
              </div>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                IP Address
              </span>
            </div>
            <h3 className="text-3xl font-black text-foreground font-mono">
              {olt.ipAddress}
            </h3>
          </Card>
        </div>

        {/* Map Section */}
        <OltOdpMap oltId={olt.id} />
      </div>
    </div>
  );
}
