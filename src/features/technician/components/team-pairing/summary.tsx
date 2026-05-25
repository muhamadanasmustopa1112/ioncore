"use client";

import { CheckCircle2, Clock, RefreshCw, AlertTriangle, Activity, AlertCircle, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import type { TeamLeaderDailySummary, DashboardAlert } from "../../types/technician-api";

function KpiTile({
  icon: Icon,
  label,
  value,
  subtext,
  gradientClass,
  iconColorClass,
}: {
  icon: React.ElementType;
  label: string;
  value: number | undefined;
  subtext: string;
  gradientClass: string;
  iconColorClass: string;
}) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-100 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md relative group">
      {/* Decorative top colored bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradientClass}`} />

      {/* Dynamic glow effect on card hover */}
      <div className={`absolute -right-10 -bottom-10 size-32 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-tr ${gradientClass}`} />

      <CardContent className="p-5 flex items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
            {value ?? 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{subtext}</p>
        </div>

        <div className="size-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 bg-slate-50 dark:bg-slate-800/50 shadow-inner border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          {/* Accent glow behind icon */}
          <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradientClass}`} />
          <Icon className={`size-6 ${iconColorClass} relative z-10`} />
        </div>
      </CardContent>
    </Card>
  );
}

export function TeamPairingSummary({
  summary,
  alerts,
}: {
  summary: TeamLeaderDailySummary | undefined;
  alerts: DashboardAlert[] | undefined;
}) {
  const { t } = useTranslation();
  const completed = summary?.completed_today ?? 0;
  const pending = summary?.pending_today ?? 0;
  const rescheduled = summary?.rescheduled_today ?? 0;
  const total = completed + pending + rescheduled;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
        <KpiTile
          icon={CheckCircle2}
          label={t("workOrder.teamPairing.completedToday")}
          value={completed}
          subtext={t("workOrder.teamPairing.completedTodaySub")}
          gradientClass="from-emerald-500 to-teal-400"
          iconColorClass="text-emerald-500 dark:text-emerald-400"
        />
        <KpiTile
          icon={Clock}
          label={t("workOrder.teamPairing.pendingToday")}
          value={pending}
          subtext={t("workOrder.teamPairing.pendingTodaySub")}
          gradientClass="from-indigo-500 to-blue-500"
          iconColorClass="text-indigo-500 dark:text-indigo-400"
        />
        <KpiTile
          icon={RefreshCw}
          label={t("workOrder.states.rescheduled")}
          value={rescheduled}
          subtext={t("workOrder.teamPairing.rescheduledSub")}
          gradientClass="from-amber-500 to-orange-400"
          iconColorClass="text-amber-500 dark:text-amber-400"
        />
      </div>

      {/* Progress & Overview bar */}
      <Card className="border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md overflow-hidden">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10">
              <Activity className="size-4.5 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("workOrder.teamPairing.dailyPerformance")}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {t("workOrder.teamPairing.performanceSub", { completed, total })}
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-md w-full flex items-center gap-3">
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-full h-2.5 relative overflow-hidden border border-slate-200/50 dark:border-slate-700/30">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 shrink-0 bg-emerald-50 dark:bg-emerald-950/30 py-1 px-2 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
              {completionRate}% {t("workOrder.states.completed")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Modern alerts section */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 px-1">
            <div className="size-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t("workOrder.teamPairing.alertsTitle", { count: alerts.length })}
            </h4>
          </div>
          <div className={`grid grid-cols-1 gap-3.5 ${alerts.length > 10 ? "max-h-[380px] overflow-y-auto pr-1.5 scrollbar-thin" : ""
            }`}>
            {alerts.map((alert, index) => {
              const severityStyles = {
                critical: {
                  bg: "bg-rose-50/75 dark:bg-rose-950/15 border-rose-100 dark:border-rose-950/40 text-rose-800 dark:text-rose-300",
                  borderLeft: "border-l-rose-500",
                  iconBg: "bg-rose-100/80 dark:bg-rose-900/30",
                  iconColor: "text-rose-600 dark:text-rose-400",
                  icon: AlertCircle,
                  badge: t("workOrder.teamPairing.severity.critical")
                },
                warning: {
                  bg: "bg-amber-50/75 dark:bg-amber-950/15 border-amber-100 dark:border-amber-950/40 text-amber-800 dark:text-amber-300",
                  borderLeft: "border-l-amber-500",
                  iconBg: "bg-amber-100/80 dark:bg-amber-900/30",
                  iconColor: "text-amber-600 dark:text-amber-400",
                  icon: AlertTriangle,
                  badge: t("workOrder.teamPairing.severity.warning")
                },
                info: {
                  bg: "bg-blue-50/75 dark:bg-blue-950/15 border-blue-100 dark:border-blue-950/40 text-blue-800 dark:text-blue-300",
                  borderLeft: "border-l-blue-500",
                  iconBg: "bg-blue-100/80 dark:bg-blue-900/30",
                  iconColor: "text-blue-600 dark:text-blue-400",
                  icon: Info,
                  badge: t("workOrder.teamPairing.severity.info")
                }
              } as const;

              const style = severityStyles[alert.severity] || severityStyles.info;
              const AlertIcon = style.icon;

              return (
                <div
                  key={`${alert.id || "alert"}-${index}`}
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border border-l-4 transition-all duration-200 hover:translate-x-0.5 ${style.bg} ${style.borderLeft}`}
                >
                  <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${style.iconBg}`}>
                    <AlertIcon className={`size-4.5 ${style.iconColor} ${alert.severity === "critical" ? "animate-pulse" : ""}`} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${alert.severity === "critical" ? "bg-rose-100/50 border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-900/40 dark:text-rose-300" :
                          alert.severity === "warning" ? "bg-amber-100/50 border-amber-200 text-amber-700 dark:bg-amber-950/50 dark:border-amber-900/40 dark:text-amber-300" :
                            "bg-blue-100/50 border-blue-200 text-blue-700 dark:bg-blue-950/50 dark:border-blue-900/40 dark:text-blue-300"
                        }`}>
                        {style.badge}
                      </span>
                      {alert.created_at && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed font-semibold">{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
