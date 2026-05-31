"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Activity, AlertTriangle, Clock, Ticket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { DUMMY_CS_DASHBOARD_KPI, DUMMY_TICKETS } from "../data/dummy-tickets";

export function CsDashboard() {
  const { t } = useTranslation();
  const kpi = DUMMY_CS_DASHBOARD_KPI;

  const openTickets = DUMMY_TICKETS.filter(
    (ticket) => ticket.status === "open" || ticket.status === "reopened"
  ).slice(0, 5);
  const inProgressTickets = DUMMY_TICKETS.filter(
    (ticket) => ticket.status === "in_progress" || ticket.status === "pending_field"
  ).slice(0, 5);

  return (
    <div className="flex-1 p-8 bg-background">
      <PageBreadcrumb
        items={[
          { title: t("menu.home", "Home"), path: paths.dashboard.root.getHref() },
          { title: t("menu.customerService", "Customer Service") },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {t("cs.dashboardTitle", "Customer Service Dashboard")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("cs.dashboardSubtitle", "Ticket queue overview and team performance")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("cs.kpiOpenTickets", "Open Tickets")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-foreground">
                {kpi.open_tickets}
              </span>
              <Ticket className="size-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("cs.kpiSlaBreach", "SLA Breach")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-red-500">
                {kpi.sla_breach_count}
              </span>
              <AlertTriangle className="size-5 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("cs.kpiAvgResponseTime", "Avg Response Time")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-foreground">
                {kpi.avg_first_response_minutes}m
              </span>
              <Clock className="size-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("cs.kpiCsatAverage", "CSAT Average")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-foreground">
                {kpi.csat_average.toFixed(1)}
              </span>
              <Activity className="size-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {t("cs.queueOpen", "Open / Unassigned")}
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={paths.dashboard.customerService.tickets.root.getHref()}>
                  {t("common.viewAll", "View All")}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {openTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={paths.dashboard.customerService.tickets.detail.getHref(ticket.id)}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.ticket_number} &middot;{" "}
                      {ticket.customer_name ?? "Public Report"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      ticket.priority === "P1"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : ticket.priority === "P2"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </Link>
              ))}
              {openTickets.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t("cs.noOpenTickets", "No open tickets.")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {t("cs.queueInProgress", "In Progress")}
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={paths.dashboard.customerService.tickets.root.getHref()}>
                  {t("common.viewAll", "View All")}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inProgressTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={paths.dashboard.customerService.tickets.detail.getHref(ticket.id)}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.ticket_number} &middot;{" "}
                      {ticket.assignments[0]?.user_name ?? "Unassigned"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      ticket.sla_breached
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {ticket.sla_breached ? "Breached" : "On Track"}
                  </span>
                </Link>
              ))}
              {inProgressTickets.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t("cs.noInProgressTickets", "No tickets in progress.")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
