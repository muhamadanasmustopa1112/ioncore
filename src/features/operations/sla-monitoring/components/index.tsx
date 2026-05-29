"use client";

import { useTranslation } from "react-i18next";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { dummySlaDashboard } from "../data/dummy-sla-metrics";
import { useSlaStore } from "../store/sla";
import { SlaMetricCard } from "./sla-metric-card";
import { SlaDrilldownDrawer } from "./sla-drilldown-drawer";
import type { SlaMetric } from "../types";

export function SlaDashboardPage() {
  const { t } = useTranslation();
  const { setSelectedMetric } = useSlaStore();

  const metrics = Object.values(dummySlaDashboard.metrics);

  const lastUpdated = new Date(dummySlaDashboard.last_updated).toLocaleString();

  const handleMetricClick = (metric: SlaMetric) => {
    setSelectedMetric(metric);
  };

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.operations", "Operations"),
            path: paths.dashboard.operations?.root?.getHref() || "/operations",
          },
          { title: t("operations.slaMonitoring", "SLA Monitoring") },
        ]}
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("operations.slaMonitoring", "SLA Monitoring")}
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <span className="text-xs text-muted-foreground">
            {t("sla.lastUpdated", "Last updated")}: {lastUpdated}
          </span>
          <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
            <RefreshCw className="size-4" />
            {t("common.refresh", "Refresh")}
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {metrics.map((metric) => (
          <SlaMetricCard
            key={metric.metric_key}
            metric={metric}
            onClick={() => handleMetricClick(metric)}
          />
        ))}
      </div>

      <div className="mt-6">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground">
              {t("sla.summary", "SLA Summary")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "sla.summaryDescription",
                "Monitor service level agreements across all operations. Click any metric card to view detailed breaching records and take action.",
              )}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">
                  {t("sla.greenCount", "{{count}} on track", {
                    count: metrics.filter((m) => m.status === "green").length,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-yellow-500" />
                <span className="text-xs text-muted-foreground">
                  {t("sla.yellowCount", "{{count}} at risk", {
                    count: metrics.filter((m) => m.status === "yellow").length,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-red-500" />
                <span className="text-xs text-muted-foreground">
                  {t("sla.redCount", "{{count}} breached", {
                    count: metrics.filter((m) => m.status === "red").length,
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SlaDrilldownDrawer />
    </div>
  );
}
