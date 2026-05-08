"use client";

import { useState } from "react";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle
} from "@/components/common/toolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiRefreshLine, RiDownloadLine, RiAlarmWarningLine } from "@remixicon/react";
import { RadiusKpiCards } from "./components/kpi-cards";
import { RadiusSessionChart } from "./components/session-chart";
import { RadiusAuthStatsChart } from "./components/auth-stats-chart";
import { RadiusTopNasChart } from "./components/top-nas-chart";
import { RadiusLiveLogTable } from "./components/live-log-table";
import { RadiusServiceInfo } from "./components/service-info";
import { NocSummaryCards } from "./components/noc-summary-cards";
import { NocTopologyStatus } from "./components/noc-topology-status";
import { RadiusGateDrawer } from "./components/radius-gate-drawer";
import { useRadiusDashboardStore } from "./store/use-radius-dashboard-store";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import { RADIUS_DASHBOARD_KEYS } from "./api/key";
import { GATE_ALERTS, RETRY_QUEUE } from "./data/mock-radius-data";

export function RadiusDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { refreshData, isLoading: isStoreLoading } = useRadiusDashboardStore();
  const queryClient = useQueryClient();
  const isFetchingQueries = useIsFetching({ queryKey: RADIUS_DASHBOARD_KEYS.all });

  const isLoading = isStoreLoading || isFetchingQueries > 0;
  
  const pendingCount = GATE_ALERTS.length + RETRY_QUEUE.length;

  const handleRefresh = async () => {
    // Refresh store data (mock)
    await refreshData();
    // Invalidate real API queries
    queryClient.invalidateQueries({ queryKey: RADIUS_DASHBOARD_KEYS.all });
  };

  return (
    <div className="relative h-full w-full px-6 py-6 overflow-y-auto custom-scrollbar">
      <PageBreadcrumb
        items={[
          {
            title: "Network & Orchestration",
            path: paths.dashboard.networkAndOrchestration.root.getHref(),
          },
          { title: "ION Radius" },
          { title: "Dashboard" },
        ]}
        className="mb-8"
      />

      <Toolbar className="mb-8 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-3xl font-black tracking-widest">
            DASHBOARD
          </ToolbarTitle>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Real-time AAA monitoring and authentication statistics
          </p>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            variant="outline"
            className="h-12 px-6 font-bold shadow-sm rounded-2xl border-2 relative"
            onClick={() => setIsDrawerOpen(true)}
          >
            <RiAlarmWarningLine className="size-5 text-amber-500" />
            Gate Alerts
            {pendingCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 size-6 p-0 flex items-center justify-center rounded-full text-[10px]">
                {pendingCount}
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            className="h-12 px-6 font-bold shadow-sm rounded-2xl border-2"
          >
            <RiDownloadLine className="size-5" />
            Report Export
          </Button>
          <Button
            variant="primary"
            className="h-12 px-8 font-bold shadow-lg shadow-primary/20 rounded-2xl"
            onClick={handleRefresh}
          >
            <RiRefreshLine className={`size-5 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Data
          </Button>
        </ToolbarActions>
      </Toolbar>
      <RadiusGateDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <div className="space-y-6">
        {/* NOC Summary Section */}
        <NocSummaryCards />

        {/* Topology Status Section */}
        <NocTopologyStatus />

        {/* KPI Section */}
        <RadiusKpiCards />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RadiusSessionChart />
          </div>
          <div className="lg:col-span-1">
            <RadiusAuthStatsChart />
          </div>
        </div>

        {/* Secondary Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <RadiusTopNasChart />
          </div>
          <div className="lg:col-span-1">
            <RadiusServiceInfo />
          </div>
        </div>

        {/* Real-time Logs Section */}
        <RadiusLiveLogTable />
      </div>
    </div>
  );
}
