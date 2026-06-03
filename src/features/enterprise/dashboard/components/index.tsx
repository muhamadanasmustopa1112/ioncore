"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { BarChart3, Building2, CheckCircle2, ClipboardList, DollarSign, FileText, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { DUMMY_DASHBOARD_KPI, DUMMY_PROJECT_HEALTH, DUMMY_S_CURVE_OVERVIEW, DUMMY_ACTIVITIES, DUMMY_TOP_PROJECTS, type ActivityItem } from "../data/dummy-dashboard";

const idr = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const healthVariant: Record<string, "success" | "warning" | "destructive"> = {
  green: "success", yellow: "warning", red: "destructive",
};

const statusVariant: Record<string, "success" | "warning" | "info" | "destructive" | "secondary"> = {
  planning: "secondary", in_progress: "info", on_hold: "warning", completed: "success", cancelled: "destructive",
  active: "success", draft: "secondary", issued: "info", pending_approval: "warning", accepted: "success",
  rejected: "destructive", confirmed: "success", flagged: "destructive", in_fulfillment: "info", closed: "secondary",
};

const activityIcons: Record<string, typeof ClipboardList> = {
  project: ClipboardList, vendor: Building2, icpo: FileText, reseller: Users, milestone: CheckCircle2,
};

function KpiCards() {
  const { t } = useTranslation();
  const kpi = DUMMY_DASHBOARD_KPI;

  const cards = [
    { label: t("enterprise.dashboard.kpi.vendors", "Vendors"), value: `${kpi.activeVendors}/${kpi.totalVendors}`, sub: t("enterprise.dashboard.kpi.vendorsSub", "active / total"), icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: t("enterprise.dashboard.kpi.projects", "Projects"), value: `${kpi.activeProjects}`, sub: `${kpi.totalProjects} ${t("enterprise.dashboard.kpi.total", "total")}`, icon: ClipboardList, color: "text-primary", bg: "bg-primary/10" },
    { label: t("enterprise.dashboard.kpi.icPos", "Open IC-POs"), value: `${kpi.openIcPos}`, sub: t("enterprise.dashboard.kpi.icPosSub", "pending action"), icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: t("enterprise.dashboard.kpi.resellers", "Resellers"), value: `${kpi.activeResellers}/${kpi.totalResellers}`, sub: t("enterprise.dashboard.kpi.resellersSub", "active / total"), icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: t("enterprise.dashboard.kpi.contractValue", "Contract Value"), value: idr(kpi.totalContractValue), sub: t("enterprise.dashboard.kpi.contractValueSub", "total portfolio"), icon: DollarSign, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: t("enterprise.dashboard.kpi.budgetSpent", "Budget Spent"), value: idr(kpi.totalBudgetSpent), sub: `${Math.round((kpi.totalBudgetSpent / kpi.totalContractValue) * 100)}% ${t("enterprise.dashboard.kpi.utilized", "utilized")}`, icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`size-12 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
              <card.icon className={`size-6 ${card.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
              <p className="text-xl font-bold tracking-tight truncate">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProjectHealthChart() {
  const { t } = useTranslation();
  const data = DUMMY_PROJECT_HEALTH;

  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="size-4" />{t("enterprise.dashboard.health.title", "Project Health")}</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="size-4 rounded-full" style={{ background: item.fill }} />
              <span className="text-sm font-medium">{item.name}</span>
              <Badge variant={item.name === "Green" ? "success" : item.name === "Yellow" ? "warning" : "destructive"} appearance="light">{item.value}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SCurveOverviewChart() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="size-4" />{t("enterprise.dashboard.scurve.title", "S-Curve Overview")}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DUMMY_S_CURVE_OVERVIEW}>
              <defs>
                <linearGradient id="dashPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dashActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-success, #10b981)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--color-success, #10b981)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
              <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-background)" }} formatter={(value: number, name: string) => [`${value}%`, name === "planned" ? "Planned" : "Actual"]} />
              <Area type="monotone" dataKey="planned" stroke="var(--color-primary)" fill="url(#dashPlanned)" strokeWidth={2} />
              <Area type="monotone" dataKey="actual" stroke="var(--color-success, #10b981)" fill="url(#dashActual)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function TopProjectsTable() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><ClipboardList className="size-4" />{t("enterprise.dashboard.topProjects.title", "Top Projects")}</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {DUMMY_TOP_PROJECTS.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{p.project_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={statusVariant[p.status]} appearance="light" className="text-[10px]">{p.status.replace(/_/g, " ")}</Badge>
                  <Badge variant={healthVariant[p.s_curve_health]} appearance="light" className="text-[10px]">{p.s_curve_health}</Badge>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-sm font-bold">{p.percent_actual}%</p>
                <p className="text-xs text-muted-foreground">{t("enterprise.dashboard.topProjects.of", "of")} {p.percent_planned}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityFeed() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{t("enterprise.dashboard.activity.title", "Recent Activity")}</CardTitle></CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px]">
          <div className="space-y-0">
            {DUMMY_ACTIVITIES.map((act) => {
              const Icon = activityIcons[act.type] || ClipboardList;
              return (
                <div key={act.id} className="flex items-start gap-3 px-5 py-3 border-b last:border-0">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{act.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{act.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{act.timestamp}</p>
                  </div>
                  <Badge variant={statusVariant[act.status] ?? "secondary"} appearance="light" className="text-[10px] shrink-0">{act.status.replace(/_/g, " ")}</Badge>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function EnterpriseDashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb items={[
        { title: t("menu.dashboard"), path: paths.dashboard.root.getHref() },
        { title: t("menu.enterprise", "Enterprise System") },
      ]} />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("enterprise.dashboard.title", "Enterprise System")}
          </ToolbarTitle>
        </ToolbarHeading>
      </Toolbar>

      <div className="mt-6 space-y-6">
        <KpiCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SCurveOverviewChart />
          <ProjectHealthChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopProjectsTable />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
