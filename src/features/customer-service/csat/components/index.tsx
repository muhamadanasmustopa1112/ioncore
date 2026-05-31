"use client";

import { useTranslation } from "react-i18next";
import {
  Toolbar,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { CsatSummaryCard } from "./csat-summary-card";

export function CsatOverviewPage() {
  const { t } = useTranslation();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.customerService", "Customer Service"),
            path: paths.dashboard.customerService.root.getHref(),
          },
          { title: t("cs.csat", "CSAT") },
        ]}
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("cs.csatOverview", "Customer Satisfaction Overview")}
          </ToolbarTitle>
        </ToolbarHeading>
      </Toolbar>
      <div className="mt-4 max-w-md">
        <CsatSummaryCard />
      </div>
    </div>
  );
}
