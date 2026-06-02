import type { Project } from "../../projects/types/project";

export interface DashboardKpi {
  totalVendors: number;
  activeVendors: number;
  totalProjects: number;
  activeProjects: number;
  openIcPos: number;
  totalResellers: number;
  activeResellers: number;
  totalContractValue: number;
  totalBudgetSpent: number;
}

export interface ProjectHealthData {
  name: string;
  value: number;
  fill: string;
}

export interface ActivityItem {
  id: string;
  type: "project" | "vendor" | "icpo" | "reseller" | "milestone";
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

export const DUMMY_DASHBOARD_KPI: DashboardKpi = {
  totalVendors: 8,
  activeVendors: 7,
  totalProjects: 3,
  activeProjects: 1,
  openIcPos: 2,
  totalResellers: 6,
  activeResellers: 5,
  totalContractValue: 870000000,
  totalBudgetSpent: 28000000,
};

export const DUMMY_PROJECT_HEALTH: ProjectHealthData[] = [
  { name: "Green", value: 1, fill: "var(--color-success, #10b981)" },
  { name: "Yellow", value: 1, fill: "var(--color-warning, #f59e0b)" },
  { name: "Red", value: 0, fill: "var(--color-destructive, #ef4444)" },
];

export const DUMMY_S_CURVE_OVERVIEW: { date: string; planned: number; actual: number }[] = [
  { date: "Jan 15", planned: 10, actual: 10 },
  { date: "Jan 20", planned: 20, actual: 18 },
  { date: "Jan 25", planned: 35, actual: 28 },
  { date: "Feb 1", planned: 60, actual: 45 },
  { date: "Feb 5", planned: 80, actual: 55 },
  { date: "Feb 10", planned: 100, actual: 70 },
];

export const DUMMY_ACTIVITIES: ActivityItem[] = [
  { id: "act-1", type: "milestone", title: "Device Installation in progress", description: "PT Bank Mandiri - ONT + switch being installed", timestamp: "2 hours ago", status: "in_progress" },
  { id: "act-2", type: "icpo", title: "IC-PO ICPO-003 issued", description: "ION Broadband → PT Cahaya Fiber for fiber supply", timestamp: "5 hours ago", status: "issued" },
  { id: "act-3", type: "vendor", title: "New vendor added", description: "PT Infra Meridian registered as infrastructure vendor", timestamp: "1 day ago", status: "active" },
  { id: "act-4", type: "project", title: "Project prj-002 planning", description: "PT Telkomsel - CCTV Monitoring entered planning phase", timestamp: "2 days ago", status: "planning" },
  { id: "act-5", type: "reseller", title: "Reseller submission confirmed", description: "PT Jaya Netindo monthly revenue Rp 45,000,000 confirmed", timestamp: "3 days ago", status: "confirmed" },
  { id: "act-6", type: "milestone", title: "Cable Installation completed", description: "PT Bank Mandiri - Fiber cable pulled successfully", timestamp: "4 days ago", status: "completed" },
];

export const DUMMY_TOP_PROJECTS: Pick<Project, "id" | "project_name" | "s_curve_health" | "percent_planned" | "percent_actual" | "status">[] = [
  { id: "prj-001", project_name: "PT Bank Mandiri - Dedicated Internet", s_curve_health: "yellow", percent_planned: 60, percent_actual: 45, status: "in_progress" },
  { id: "prj-002", project_name: "PT Telkomsel - CCTV Monitoring", s_curve_health: "green", percent_planned: 0, percent_actual: 0, status: "planning" },
  { id: "prj-003", project_name: "PT Astra - Managed Wi-Fi", s_curve_health: "green", percent_planned: 0, percent_actual: 0, status: "planning" },
];
