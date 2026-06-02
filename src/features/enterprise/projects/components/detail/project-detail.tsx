"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, BarChart3, CheckCircle2, Clock, DollarSign, MapPin, Target } from "lucide-react";
import { RiEditLine } from "@remixicon/react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useProject, useProjectSCurve } from "../../api/get-project";
import { useProjectStore } from "../../store/project";
import type { Project, ProjectMilestone } from "../../types/project";

const idr = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const statusVariant: Record<string, "success" | "warning" | "info" | "destructive" | "secondary"> = {
  planning: "secondary", in_progress: "info", on_hold: "warning", completed: "success", cancelled: "destructive",
};
const healthVariant: Record<string, "success" | "warning" | "destructive"> = {
  green: "success", yellow: "warning", red: "destructive",
};
const milestoneVariant: Record<string, "success" | "info" | "warning" | "secondary"> = {
  completed: "success", in_progress: "info", delayed: "warning", pending: "secondary",
};

function ProjectOverview({ project }: { project: Project }) {
  const { t } = useTranslation();
  const budgetPct = project.budget_total > 0 ? Math.round((project.budget_spent / project.budget_total) * 100) : 0;

  return (
    <div className="space-y-4 mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center"><Target className="size-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">{t("enterprise.projects.detail.health", "Health")}</p><Badge variant={healthVariant[project.s_curve_health]} appearance="light">{project.s_curve_health}</Badge></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><Clock className="size-5 text-blue-500" /></div>
            <div><p className="text-xs text-muted-foreground">{t("enterprise.projects.detail.progress", "Progress")}</p><p className="font-bold">{project.percent_actual}% / {project.percent_planned}%</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><DollarSign className="size-5 text-emerald-500" /></div>
            <div><p className="text-xs text-muted-foreground">{t("enterprise.projects.detail.contractValue", "Contract")}</p><p className="font-bold text-sm">{idr(project.contract_value)}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center"><BarChart3 className="size-5 text-amber-500" /></div>
            <div><p className="text-xs text-muted-foreground">{t("enterprise.projects.detail.budget", "Budget")}</p><p className="font-bold text-sm">{idr(project.budget_spent)} / {idr(project.budget_total)}</p></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">{t("enterprise.projects.detail.projectInfo", "Project Info")}</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.projects.form.customer", "Customer")}</span><span className="font-medium">{project.customer_name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.projects.form.accountManager", "Account Manager")}</span><span className="font-medium">{project.account_manager}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.projects.form.type", "Type")}</span><Badge variant="secondary" appearance="light">{project.project_type.replace(/_/g, " ")}</Badge></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("common.status", "Status")}</span><Badge variant={statusVariant[project.status]} appearance="light">{project.status.replace(/_/g, " ")}</Badge></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("enterprise.projects.detail.period", "Period")}</span><span className="font-medium">{project.contract_start_date} → {project.contract_end_date}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">{t("enterprise.projects.detail.budgetTracking", "Budget Tracking")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("enterprise.projects.detail.spent", "Spent")}</span><span className="font-bold">{idr(project.budget_spent)}</span></div>
            <Progress value={budgetPct} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground"><span>{budgetPct}% used</span><span>{idr(project.budget_total - project.budget_spent)} remaining</span></div>
          </CardContent>
        </Card>
      </div>

      {project.sites.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="size-4" />{t("enterprise.projects.detail.sites", "Sites")}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.sites.map((site) => (
                <div key={site.id} className="rounded-lg border p-3 space-y-1">
                  <p className="font-medium text-sm">{site.site_name}</p>
                  <p className="text-xs text-muted-foreground">{site.address}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MilestoneTable({ milestones }: { milestones: ProjectMilestone[] }) {
  const { t } = useTranslation();
  return (
    <div className="mt-3 space-y-3">
      {milestones.map((ms) => (
        <div key={ms.id} className="flex items-center gap-4 rounded-lg border p-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{ms.milestone_name}</span>
              <Badge variant={milestoneVariant[ms.status]} appearance="light" className="text-[10px]">{ms.status}</Badge>
              <Badge variant="outline" className="text-[10px]">{ms.responsible_role}</Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{t("enterprise.projects.milestone.planned", "Planned")}: {ms.planned_date}</span>
              {ms.actual_date && <span>{t("enterprise.projects.milestone.actual", "Actual")}: {ms.actual_date}</span>}
              <span>{ms.weight_percentage}%</span>
            </div>
            <div className="mt-2"><Progress value={ms.status === "completed" ? 100 : ms.status === "in_progress" ? 50 : 0} className="h-1.5" /></div>
          </div>
          <CheckCircle2 className={`size-5 shrink-0 ${ms.status === "completed" ? "text-emerald-500" : "text-muted-foreground/30"}`} />
        </div>
      ))}
    </div>
  );
}

function SCurveChart({ projectId }: { projectId: string }) {
  const { t } = useTranslation();
  const { data: sCurveData } = useProjectSCurve(projectId);

  if (!sCurveData) return null;

  return (
    <div className="mt-3">
      <Card>
        <CardHeader><CardTitle className="text-base">{t("enterprise.projects.scurve.title", "S-Curve: Planned vs Actual Progress")}</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sCurveData}>
                <defs>
                  <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success, #10b981)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-success, #10b981)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-background)" }} formatter={(value: number, name: string) => [`${value}%`, name === "planned_cumulative" ? "Planned" : "Actual"]} />
                <Area type="monotone" dataKey="planned_cumulative" stroke="var(--color-primary)" fill="url(#plannedGrad)" strokeWidth={2} name="Planned" />
                <Area type="monotone" dataKey="actual_cumulative" stroke="var(--color-success, #10b981)" fill="url(#actualGrad)" strokeWidth={2} name="Actual" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BudgetChart({ project }: { project: Project }) {
  const { t } = useTranslation();
  const data = [
    { name: t("enterprise.projects.detail.budgetTotal", "Budget"), value: project.budget_total },
    { name: t("enterprise.projects.detail.spent", "Spent"), value: project.budget_spent },
    { name: t("enterprise.projects.detail.remaining", "Remaining"), value: Math.max(0, project.budget_total - project.budget_spent) },
  ];

  return (
    <div className="mt-3">
      <Card>
        <CardHeader><CardTitle className="text-base">{t("enterprise.projects.budget.title", "Budget vs Actual")}</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-background)" }} formatter={(value: number) => [idr(value), ""]} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((_, index) => (
                    <Cell key={index} fill={index === 0 ? "var(--color-primary)" : index === 1 ? "var(--color-destructive)" : "var(--color-success, #10b981)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProjectDetailPage({ projectId }: { projectId: string }) {
  const { t } = useTranslation();
  const { data: project, isLoading } = useProject(projectId);
  const { openFormSheet, setSelectedItem } = useProjectStore();

  if (isLoading) return <div className="px-6 py-4 space-y-3"><div className="h-8 w-64 bg-muted animate-pulse rounded" /><div className="h-48 bg-muted animate-pulse rounded" /></div>;
  if (!project) return <div className="px-6 py-4 text-muted-foreground">{t("common.notFound", "Not found")}</div>;

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb items={[
        { title: t("menu.enterprise", "Enterprise System"), path: paths.dashboard.enterprise.root.getHref() },
        { title: t("enterprise.projects.title", "Projects"), path: paths.dashboard.enterprise.projects.root.getHref() },
        { title: project.project_name },
      ]} />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <div className="flex items-center gap-3">
            <Button variant="ghost" mode="icon" onClick={() => window.history.back()}><ArrowLeft className="size-5" /></Button>
            <div>
              <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{project.project_name}</ToolbarTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={statusVariant[project.status]} appearance="light">{project.status.replace(/_/g, " ")}</Badge>
                <Badge variant={healthVariant[project.s_curve_health]} appearance="light">S-Curve: {project.s_curve_health}</Badge>
              </div>
            </div>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" className="h-11 px-6 font-semibold shadow-md" onClick={() => { setSelectedItem(project); openFormSheet("edit"); }}>
            <RiEditLine className="size-4" />{t("common.edit", "Edit")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="mt-4 overflow-auto">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">{t("enterprise.projects.detail.tabOverview", "Overview")}</TabsTrigger>
            <TabsTrigger value="milestones">{t("enterprise.projects.detail.tabMilestones", "Milestones")} ({project.milestones.length})</TabsTrigger>
            <TabsTrigger value="scurve">{t("enterprise.projects.detail.tabSCurve", "S-Curve")}</TabsTrigger>
            <TabsTrigger value="budget">{t("enterprise.projects.detail.tabBudget", "Budget")}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><ProjectOverview project={project} /></TabsContent>
          <TabsContent value="milestones"><MilestoneTable milestones={project.milestones} /></TabsContent>
          <TabsContent value="scurve"><SCurveChart projectId={projectId} /></TabsContent>
          <TabsContent value="budget"><BudgetChart project={project} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
