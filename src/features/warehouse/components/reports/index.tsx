"use client";

import { useTranslation } from "react-i18next";
import { RiDownloadLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { ReportsList } from "./list/reports-list";

export function ReportsListPage() {
  const { t } = useTranslation();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb items={[{ title: t("menu.warehouse", "Warehouse & Asset"), path: paths.dashboard.warehouse.root.getHref() }, { title: t("warehouse.reportsTitle", "Reports") }]} />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading><ToolbarTitle className="text-2xl font-extrabold tracking-tight">{t("warehouse.reportsTitle", "Reports")}</ToolbarTitle></ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs"><RiDownloadLine className="size-4" />{t("common.exportData", "Export Data")}</Button>
        </ToolbarActions>
      </Toolbar>
      <div className="flex-1 overflow-auto mt-4"><ReportsList /></div>
    </div>
  );
}
