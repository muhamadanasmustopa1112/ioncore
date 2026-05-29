"use client";

import { useTranslation } from "react-i18next";
import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { MaintenanceList } from "./list/maintenance-list";
import { useMaintenanceStore } from "../store/maintenance";
import { MaintenanceFormSheet } from "./form/maintenance-form-sheet";

export function MaintenanceListPage() {
  const { t } = useTranslation();
  const { openFormSheet } = useMaintenanceStore();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb items={[
        { title: t("menu.operations", "Operations"), path: paths.dashboard.operations?.root?.getHref() || "/operations" },
        { title: t("operations.plannedMaintenance", "Planned Maintenance") },
      ]} />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("operations.plannedMaintenance", "Planned Maintenance")}
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            variant="primary"
            className="h-11 px-6 font-semibold shadow-md"
            onClick={() => openFormSheet("new")}
          >
            <RiAddLine className="size-5" />
            {t("operations.maintenance.newMaintenance", "New Maintenance")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="flex-1 overflow-auto mt-4">
        <MaintenanceList />
      </div>
      <MaintenanceFormSheet />
    </div>
  );
}
