"use client";

import {
  RiBarChartLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiGroupLine,
  RiTimeLine,
  RiToolsLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import {
  Toolbar,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";

interface BranchMetric {
  id: string;
  name: string;
  level: "regional" | "area" | "sub_area";
  activeCustomers: number;
  openWOs: number;
  openTickets: number;
  slaCompliancePct: number;
  avgResponseHrs: number;
  healthStatus: "healthy" | "warning" | "critical";
}

const DUMMY_METRICS: BranchMetric[] = [
  {
    id: "br-reg-001",
    name: "DKI Jakarta",
    level: "regional",
    activeCustomers: 4820,
    openWOs: 38,
    openTickets: 22,
    slaCompliancePct: 94.2,
    avgResponseHrs: 1.4,
    healthStatus: "healthy",
  },
  {
    id: "br-area-001",
    name: "Jakarta Barat",
    level: "area",
    activeCustomers: 1340,
    openWOs: 12,
    openTickets: 7,
    slaCompliancePct: 96.1,
    avgResponseHrs: 1.2,
    healthStatus: "healthy",
  },
  {
    id: "br-area-002",
    name: "Jakarta Timur",
    level: "area",
    activeCustomers: 1560,
    openWOs: 15,
    openTickets: 9,
    slaCompliancePct: 88.5,
    avgResponseHrs: 2.8,
    healthStatus: "warning",
  },
  {
    id: "br-area-003",
    name: "Jakarta Selatan",
    level: "area",
    activeCustomers: 980,
    openWOs: 8,
    openTickets: 4,
    slaCompliancePct: 97.3,
    avgResponseHrs: 1.1,
    healthStatus: "healthy",
  },
  {
    id: "br-area-004",
    name: "Jakarta Pusat",
    level: "area",
    activeCustomers: 940,
    openWOs: 3,
    openTickets: 2,
    slaCompliancePct: 99.0,
    avgResponseHrs: 0.9,
    healthStatus: "healthy",
  },
  {
    id: "br-sub-001",
    name: "Ciracas",
    level: "sub_area",
    activeCustomers: 420,
    openWOs: 6,
    openTickets: 5,
    slaCompliancePct: 78.4,
    avgResponseHrs: 4.2,
    healthStatus: "critical",
  },
  {
    id: "br-sub-002",
    name: "Bambu Apus",
    level: "sub_area",
    activeCustomers: 310,
    openWOs: 4,
    openTickets: 3,
    slaCompliancePct: 91.0,
    avgResponseHrs: 1.9,
    healthStatus: "healthy",
  },
];

const levelLabel: Record<BranchMetric["level"], string> = {
  regional: "Regional",
  area: "Area",
  sub_area: "Sub Area",
};

const healthBadge: Record<
  BranchMetric["healthStatus"],
  { label: string; className: string }
> = {
  healthy: {
    label: "Healthy",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  warning: {
    label: "Warning",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  critical: {
    label: "Critical",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

const totalCustomers = DUMMY_METRICS.filter((m) => m.level === "regional").reduce(
  (sum, m) => sum + m.activeCustomers,
  0
);
const totalOpenWOs = DUMMY_METRICS.filter((m) => m.level === "area" || m.level === "sub_area").reduce(
  (sum, m) => sum + m.openWOs,
  0
);
const totalOpenTickets = DUMMY_METRICS.filter((m) => m.level === "area" || m.level === "sub_area").reduce(
  (sum, m) => sum + m.openTickets,
  0
);
const avgSlaCompliance =
  DUMMY_METRICS.reduce((sum, m) => sum + m.slaCompliancePct, 0) / DUMMY_METRICS.length;

export function BranchPerformancePage() {
  const criticalCount = DUMMY_METRICS.filter((m) => m.healthStatus === "critical").length;
  const warningCount = DUMMY_METRICS.filter((m) => m.healthStatus === "warning").length;

  return (
    <div className="relative h-full w-full overflow-auto">
      <PageBreadcrumb
        items={[
          {
            title: "Administration",
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          {
            title: "Branch Management",
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: "Performance & Health" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Branch Performance & Health Dashboard
          </ToolbarTitle>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:mt-2.5">
            <Badge
              variant="success"
              appearance="light"
              className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs"
            >
              <RiBarChartLine className="size-3.5" />
              Live Metrics
            </Badge>
            <span className="hidden sm:inline text-muted-foreground/60 text-sm">•</span>
            <span className="text-muted-foreground font-normal text-xs sm:text-sm">
              Monitor operational KPIs across all Regional, Area, and Sub Area branches
            </span>
          </div>
        </ToolbarHeading>
      </Toolbar>

      {/* KPI Summary Cards */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <RiGroupLine className="size-4" />
            <span className="text-xs font-medium">Active Customers</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalCustomers.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Across all branches</p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <RiToolsLine className="size-4" />
            <span className="text-xs font-medium">Open Work Orders</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalOpenWOs}</p>
          <p className="text-xs text-muted-foreground mt-1">Pending assignment or in progress</p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <RiTimeLine className="size-4" />
            <span className="text-xs font-medium">Open Tickets</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalOpenTickets}</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting resolution</p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <RiCheckboxCircleLine className="size-4" />
            <span className="text-xs font-medium">Avg SLA Compliance</span>
          </div>
          <p className={`text-2xl font-bold ${avgSlaCompliance >= 90 ? "text-emerald-600" : avgSlaCompliance >= 75 ? "text-amber-600" : "text-red-600"}`}>
            {avgSlaCompliance.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">Across all branches</p>
        </div>
      </div>

      {/* Alert bar */}
      {(criticalCount > 0 || warningCount > 0) && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-900/10 px-4 py-3">
          <RiErrorWarningLine className="size-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            {criticalCount > 0 && (
              <span className="font-semibold">{criticalCount} branch{criticalCount > 1 ? "es" : ""} in critical state. </span>
            )}
            {warningCount > 0 && (
              <span>{warningCount} branch{warningCount > 1 ? "es" : ""} require attention.</span>
            )}
          </p>
        </div>
      )}

      {/* Branch Metrics Table */}
      <div className="mt-5 rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60">
          <h3 className="text-sm font-semibold text-foreground">Branch-level Metrics</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time operational snapshot per branch node</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground w-44">Branch</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-24">Level</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Customers</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Open WOs</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Open Tickets</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">SLA %</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Avg Resp (hrs)</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Health</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_METRICS.map((m, idx) => {
                const health = healthBadge[m.healthStatus];
                return (
                  <tr
                    key={m.id}
                    className={`border-b border-border/40 hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? "" : "bg-muted/10"}`}
                  >
                    <td className="px-5 py-3 font-medium text-foreground">{m.name}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{levelLabel[m.level]}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{m.activeCustomers.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{m.openWOs}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{m.openTickets}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-mono font-semibold ${m.slaCompliancePct >= 90 ? "text-emerald-600 dark:text-emerald-400" : m.slaCompliancePct >= 75 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                        {m.slaCompliancePct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-mono ${m.avgResponseHrs <= 2 ? "text-foreground" : m.avgResponseHrs <= 3.5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                        {m.avgResponseHrs.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${health.className}`}>
                        {health.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground pb-6">
        Data shown is for demonstration purposes. Real metrics will be fetched from the backend once API endpoints are confirmed.
      </p>
    </div>
  );
}
