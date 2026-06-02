"use client";

import { useTranslation } from "react-i18next";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { SettlementList } from "./list/settlement-list";

export function SettlementListPage() {
  const { t } = useTranslation();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb
        items={[
          { title: t("menu.enterprise", "Enterprise System"), path: paths.dashboard.enterprise.root.getHref() },
          { title: t("enterprise.settlement.title", "Settlement") },
        ]}
      />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("enterprise.settlement.title", "Settlement")}
          </ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <Receipt className="size-3.5" />
              {t("enterprise.settlement.badge", "Monthly Reseller Settlement")}
            </Badge>
          </div>
        </ToolbarHeading>
      </Toolbar>
      <div className="flex-1 overflow-auto mt-4">
        <SettlementList />
      </div>
    </div>
  );
}
