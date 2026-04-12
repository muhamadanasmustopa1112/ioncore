"use client";

import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle
} from "@/components/common/toolbar";
import { Button } from "@/components/ui/button";
import { RiRefreshLine, RiDownloadLine } from "@remixicon/react";
import { RadiusKpiCards } from "./components/kpi-cards";
import { RadiusSessionChart } from "./components/session-chart";
import { RadiusAuthStatsChart } from "./components/auth-stats-chart";
import { RadiusTopNasChart } from "./components/top-nas-chart";
import { RadiusLiveLogTable } from "./components/live-log-table";
import { RadiusServiceInfo } from "./components/service-info";
import { useRadiusDashboardStore } from "./store/use-radius-dashboard-store";

export function RadiusDashboard() {
  const { refreshData, isLoading } = useRadiusDashboardStore();

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
            className="h-12 px-6 font-bold shadow-sm rounded-2xl border-2"
          >
            <RiDownloadLine className="size-5" />
            Report Export
          </Button>
          <Button
            variant="primary"
            className="h-12 px-8 font-bold shadow-lg shadow-primary/20 rounded-2xl"
            onClick={refreshData}
          >
            <RiRefreshLine className={`size-5 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Data
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-6">
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
