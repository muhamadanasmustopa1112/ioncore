"use client";

import { useTranslation } from "react-i18next";
import { RiDownloadLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { KpiCards } from "./kpi-cards";
import { RevenueTrendChart } from "./revenue-trend-chart";
import { ArAgingChart } from "./ar-aging-chart";
import { RevenueByTypeChart } from "./revenue-by-type-chart";
import { RevenueByBranchChart } from "./revenue-by-branch-chart";
import { SuspensionTrendChart } from "./suspension-trend-chart";
import { CommissionSummaryChart } from "./commission-summary-chart";
import { ReportTables } from "./report-tables";

export function ReportDashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.finance"),
            path: paths.dashboard.finance.root.getHref(),
          },
          { title: t("menu.reports") },
        ]}
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("billing.report.title", "Financial Reports")}
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="font-medium">
              {t("billing.report.range.today", "Today")}
            </Button>
            <Button variant="outline" size="sm" className="font-medium">
              {t("billing.report.range.thisWeek", "This Week")}
            </Button>
            <Button variant="primary" size="sm" className="font-medium">
              {t("billing.report.range.thisMonth", "This Month")}
            </Button>
            <Button variant="outline" size="sm" className="font-medium">
              {t("billing.report.range.thisQuarter", "This Quarter")}
            </Button>
          </div>
          <Button
            variant="outline"
            className="h-11 px-5 font-semibold shadow-xs"
          >
            <RiDownloadLine className="size-4" />
            {t("billing.common.export", "Export")}
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="mt-6 space-y-6">
        <KpiCards />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueTrendChart />
          <ArAgingChart />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueByTypeChart />
          <RevenueByBranchChart />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SuspensionTrendChart />
          <CommissionSummaryChart />
        </div>

        <ReportTables />
      </div>
    </div>
  );
}
