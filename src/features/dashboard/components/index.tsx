"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Users, FileText, Wrench, ShoppingCart, Network, Building2,
  MapPin, Boxes, ClipboardList, TrendingUp, Radio, BarChart3,
  Wifi, ChevronRight,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { useAuthStore } from "@/store/auth-store";
import { paths } from "@/config/paths";
import { ScreenLoader } from "@/components/common/screen-loader";
import { Card, CardContent, CardHeader, CardHeading } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountingNumber } from "@/components/ui/counting-number";
import { useAdminLeads } from "@/features/leads/api/leads-queries";
import { useCustomerList } from "@/features/customers/api/customers-queries";
import { useWorkOrderList } from "@/features/operations/work-orders/api/work-order-queries";
import { useUsers } from "@/features/user-service/api/users";
import "@/i18n";

const STATS = (t: (key: string) => string, totals: { customers: number; leads: number; workOrders: number; users: number }) => [
  { label: t("dashboard.stats.totalCustomers"), value: totals.customers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", badge: t("dashboard.statBadges.crm") },
  { label: t("dashboard.stats.activeLeads"), value: totals.leads, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-500/10", badge: t("dashboard.statBadges.sales") },
  { label: t("dashboard.stats.workOrders"), value: totals.workOrders, icon: ClipboardList, color: "text-orange-500", bg: "bg-orange-500/10", badge: t("dashboard.statBadges.ops") },
  { label: t("dashboard.stats.systemUsers"), value: totals.users, icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10", badge: t("dashboard.statBadges.admin") },
];

const MENU_GROUPS = (t: (key: string) => string) => [
  {
    group: t("dashboard.crmAndSales"),
    color: "from-blue-500/10 to-violet-500/10",
    accent: "border-blue-500/20",
    items: [
      { icon: Users, label: t("menu.customers"), description: t("dashboard.menuDescriptions.manageCustomerRecords"), href: paths.dashboard.crmAndSales.customer.root.getHref(), iconColor: "bg-blue-500" },
      { icon: TrendingUp, label: t("menu.leads"), description: t("dashboard.menuDescriptions.trackConvertLeads"), href: paths.dashboard.crmAndSales.leads.root.getHref(), iconColor: "bg-violet-500" },
    ],
  },
  {
    group: t("dashboard.operations"),
    color: "from-orange-500/10 to-rose-500/10",
    accent: "border-orange-500/20",
    items: [
      { icon: ClipboardList, label: t("menu.workOrders"), description: t("dashboard.menuDescriptions.fieldDispatchTracking"), href: paths.dashboard.operations.workOrders.root.getHref(), iconColor: "bg-orange-500" },
      { icon: ShoppingCart, label: t("menu.orders"), description: t("dashboard.menuDescriptions.orderManagement"), href: paths.dashboard.operations.orders.root.getHref(), iconColor: "bg-yellow-500" },
      { icon: Wrench, label: t("menu.technicians"), description: t("dashboard.menuDescriptions.fieldTeamManagement"), href: paths.dashboard.technician.root.getHref(), iconColor: "bg-rose-500" },
    ],
  },
  {
    group: t("dashboard.network"),
    color: "from-teal-500/10 to-indigo-500/10",
    accent: "border-teal-500/20",
    items: [
      { icon: MapPin, label: t("menu.odpPopMap"), description: t("dashboard.menuDescriptions.infrastructureMapView"), href: paths.dashboard.networkAndOrchestration.odpPop.map.getHref(), iconColor: "bg-teal-500" },
      { icon: Network, label: t("menu.odpPop"), description: t("dashboard.menuDescriptions.topologyManagement"), href: paths.dashboard.networkAndOrchestration.odpPop.root.getHref(), iconColor: "bg-cyan-500" },
      { icon: Radio, label: t("menu.radius"), description: t("dashboard.menuDescriptions.networkRadiusDashboard"), href: paths.dashboard.networkAndOrchestration.radius.dashboard.getHref(), iconColor: "bg-indigo-500" },
    ],
  },
  {
    group: t("dashboard.administration"),
    color: "from-amber-500/10 to-emerald-500/10",
    accent: "border-amber-500/20",
    items: [
      { icon: Building2, label: t("menu.branch"), description: t("dashboard.menuDescriptions.branchManagement"), href: paths.dashboard.administration.branch.root.getHref(), iconColor: "bg-amber-500" },
      { icon: FileText, label: t("menu.users"), description: t("dashboard.menuDescriptions.userRoleManagement"), href: paths.dashboard.user.root.getHref(), iconColor: "bg-emerald-500" },
      { icon: Boxes, label: t("menu.warehouse"), description: t("dashboard.menuDescriptions.stockInventory"), href: paths.dashboard.warehouse.root.getHref(), iconColor: "bg-pink-500" },
      { icon: BarChart3, label: t("menu.schema"), description: t("dashboard.menuDescriptions.dataSchemaConfig"), href: "/administration/schema", iconColor: "bg-slate-500" },
    ],
  },
];

function getGreeting(t: (key: string) => string) {
  const h = new Date().getHours();
  if (h < 12) return t("dashboard.greeting.morning");
  if (h < 17) return t("dashboard.greeting.afternoon");
  return t("dashboard.greeting.evening");
}

export function Dashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const isTechnician = user?.roleAssignments.some((r) =>
    r.roleName.toUpperCase().includes("TECHNICIAN")
  );

  useEffect(() => {
    if (isTechnician) {
      toast.error(t("common.error"));
      router.replace(paths.dashboard.technician.root.getHref());
    }
  }, [isTechnician, router, t]);

  const { data: leadsData } = useAdminLeads({ per_page: 1 });
  const { data: customersData } = useCustomerList({ size: 1 });
  const { data: workOrdersData } = useWorkOrderList({ per_page: 1 } as any);
  const { data: usersData } = useUsers({ per_page: 1 });

  // WO by status
  const { data: woCreated } = useWorkOrderList({ status: "CREATED", per_page: 5 } as any);
  const { data: woInProgress } = useWorkOrderList({ status: "IN_PROGRESS", per_page: 5 } as any);
  const { data: woDone } = useWorkOrderList({ status: "DONE", per_page: 5 } as any);

  // Leads by status
  const { data: leadsNew } = useAdminLeads({ status: "new", per_page: 1 });
  const { data: leadsActive } = useAdminLeads({ status: "active", per_page: 1 });
  const { data: leadsWarm } = useAdminLeads({ status: "warm", per_page: 1 });
  const { data: leadsPotential } = useAdminLeads({ status: "potential", per_page: 1 });
  const { data: leadsConverted } = useAdminLeads({ status: "converted", per_page: 1 });
  const { data: leadsLost } = useAdminLeads({ status: "lost", per_page: 1 });

  // Recent data for tables
  const { data: recentWO } = useWorkOrderList({ per_page: 5 } as any);
  const { data: recentLeads } = useAdminLeads({ per_page: 5 });

  const totals = {
    customers: customersData?.meta?.total ?? 0,
    leads: (leadsData as any)?.metadata?.total ?? 0,
    workOrders: workOrdersData?.total ?? 0,
    users: (usersData as any)?.metadata?.total ?? 0,
  };

  const woChartData = [
    { name: t("dashboard.chartLabels.created"), value: woCreated?.total ?? 0, color: "#f59e0b" },
    { name: t("dashboard.chartLabels.inProgress"), value: woInProgress?.total ?? 0, color: "#3b82f6" },
    { name: t("dashboard.chartLabels.done"), value: woDone?.total ?? 0, color: "#22c55e" },
  ];

  const leadsChartData = [
    { name: t("dashboard.chartLabels.new"), value: (leadsNew as any)?.metadata?.total ?? 0, color: "#8b5cf6" },
    { name: t("dashboard.chartLabels.active"), value: (leadsActive as any)?.metadata?.total ?? 0, color: "#3b82f6" },
    { name: t("dashboard.chartLabels.warm"), value: (leadsWarm as any)?.metadata?.total ?? 0, color: "#f59e0b" },
    { name: t("dashboard.chartLabels.potential"), value: (leadsPotential as any)?.metadata?.total ?? 0, color: "#94a3b8" },
    { name: t("dashboard.chartLabels.converted"), value: (leadsConverted as any)?.metadata?.total ?? 0, color: "#22c55e" },
    { name: t("dashboard.chartLabels.lost"), value: (leadsLost as any)?.metadata?.total ?? 0, color: "#ef4444" },
  ];

  if (isTechnician) return <ScreenLoader />;

  const stats = STATS(t, totals);

  return (
    <div className="flex flex-col gap-8 p-6 max-w-screen-2xl mx-auto">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50 p-8">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="success" appearance="light" className="gap-1 text-[10px] uppercase tracking-widest font-black">
                <Wifi className="size-2.5" />
                {t("dashboard.live")}
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              {getGreeting(t)}, <span className="text-primary">{user?.fullName?.split(" ")[0]}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {user?.primaryRole} · {user?.primaryBranch}
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground font-mono">
            <p className="font-bold text-foreground text-sm">{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            <p className="mt-0.5 uppercase tracking-widest text-[10px]">{t("dashboard.platform")}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">{t("dashboard.overview")}</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color, bg, badge }) => (
            <Card key={label} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex size-10 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`size-5 ${color}`} />
                  </div>
                  <Badge variant="secondary" appearance="light" className="text-[9px] uppercase tracking-widest font-black">{badge}</Badge>
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                <p className={`text-3xl font-black ${color}`}>
                  {value > 0
                    ? <CountingNumber to={value} duration={1.2} startOnView once />
                    : "—"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">{t("dashboard.quickAccess")}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {MENU_GROUPS(t).map(({ group, color, accent, items }) => (
            <Card key={group} className={`overflow-hidden border ${accent}`}>
              <div className={`bg-gradient-to-br ${color} px-5 pt-4 pb-3 border-b border-border/40`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/70">{group}</p>
              </div>
              <CardContent className="p-0">
                {items.map(({ icon: Icon, label, description, href, iconColor }) => (
                  <Link
                    key={label}
                    href={href}
                    className="group flex items-center gap-3 px-4 py-3 border-b border-border/30 last:border-0 hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:bg-muted/50"
                  >
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconColor}`}>
                      <Icon className="size-3.5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground leading-tight">{label}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{description}</p>
                    </div>
                    <ChevronRight className="size-3.5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-[color,transform] duration-150" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">{t("dashboard.analytics")}</p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* WO by Status */}
          <Card>
            <CardHeader className="px-5 pt-5 pb-3">
              <CardHeading className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <ClipboardList className="size-4 text-orange-500" /> {t("menu.workOrders")}
              </CardHeading>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={woChartData} barSize={36}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, fontWeight: 700, borderRadius: 8, border: "none", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {woChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    <LabelList dataKey="value" position="top" style={{ fontSize: 10, fontWeight: 700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-3">
                {woChartData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{name}</span>
                    <span className="text-[11px] font-black text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leads by Status */}
          <Card>
            <CardHeader className="px-5 pt-5 pb-3">
              <CardHeading className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="size-4 text-violet-500" /> {t("menu.leads")}
              </CardHeading>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={leadsChartData} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, fontWeight: 700, borderRadius: 8, border: "none", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {leadsChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    <LabelList dataKey="value" position="top" style={{ fontSize: 10, fontWeight: 700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-3">
                {leadsChartData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{name}</span>
                    <span className="text-[11px] font-black text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Tables */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">{t("dashboard.recentActivity")}</p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Recent Work Orders */}
          <Card>
            <CardHeader className="px-5 pt-5 pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardHeading className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <ClipboardList className="size-4 text-orange-500" /> {t("technician.workOrders")}
                </CardHeading>
                <Link href={paths.dashboard.operations.workOrders.root.getHref()} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                  {t("dashboard.viewAll")}
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {(recentWO?.workOrders ?? []).length === 0 ? (
                <p className="text-[11px] text-muted-foreground text-center py-8">{t("dashboard.noData")}</p>
              ) : (
                (recentWO?.workOrders ?? []).map((wo: any) => (
                  <div key={wo.id} className="flex items-center gap-3 px-5 py-3 border-b border-border/30 last:border-0 hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
                    <div className={`size-2 rounded-full shrink-0 ${wo.status === "DONE" ? "bg-green-500" : wo.status === "IN_PROGRESS" ? "bg-blue-500" : "bg-amber-500"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground truncate">{wo.title}</p>
                      <p className="text-[10px] text-muted-foreground">{wo.customerName ?? "—"}</p>
                    </div>
                    <Badge
                      variant={wo.status === "DONE" ? "success" : wo.status === "IN_PROGRESS" ? "info" : "warning"}
                      appearance="light"
                      className="text-[9px] font-black uppercase tracking-widest shrink-0"
                    >
                      {wo.status === "IN_PROGRESS" ? t("technician.status.inProgress") : wo.status === "DONE" ? t("technician.status.done") : t("technician.status.created")}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card>
            <CardHeader className="px-5 pt-5 pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardHeading className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="size-4 text-violet-500" /> {t("menu.leads")}
                </CardHeading>
                <Link href={paths.dashboard.crmAndSales.leads.root.getHref()} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                  {t("dashboard.viewAll")}
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {((recentLeads as any)?.leads ?? []).length === 0 ? (
                <p className="text-[11px] text-muted-foreground text-center py-8">{t("dashboard.noData")}</p>
              ) : (
                ((recentLeads as any)?.leads ?? []).map((lead: any) => (
                  <div key={lead.id} className="flex items-center gap-3 px-5 py-3 border-b border-border/30 last:border-0 hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
                    <div className={`size-2 rounded-full shrink-0 ${
                      lead.status === "converted" ? "bg-green-500" :
                      lead.status === "lost" ? "bg-red-500" :
                      lead.status === "active" ? "bg-blue-500" :
                      lead.status === "warm" ? "bg-amber-500" : "bg-violet-500"
                    }`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground truncate">{lead.name ?? lead.full_name ?? "—"}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{lead.source ?? "—"}</p>
                    </div>
                    <Badge variant="secondary" appearance="light" className="text-[9px] font-black uppercase tracking-widest shrink-0 capitalize">
                      {t(`dashboard.leadStatus.${lead.status}`)}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
