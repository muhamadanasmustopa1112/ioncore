"use client";

import { useTranslation } from "react-i18next";
import { RiAddLine, RiDownloadLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { InventoryConfigList } from "./list/inventory-config-list";
import { useInventoryConfigStore } from "../store/inventory-config";
import { InventoryConfigFormSheet } from "./form/inventory-config-form-sheet";

export function InventoryConfigListPage() {
  const { t } = useTranslation();
  const { openFormSheet } = useInventoryConfigStore();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.warehouse", "Warehouse & Asset"),
            path: paths.dashboard.warehouse.root.getHref(),
          },
          { title: t("warehouse.inventoryConfig", "Inventory Config") },
        ]}
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("warehouse.inventoryConfigTitle", "Inventory Valuation Configuration")}
          </ToolbarTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("warehouse.inventoryConfigDesc", "Manage FIFO/LIFO inventory valuation settings per warehouse.")}
          </p>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
            <RiDownloadLine className="size-4" />
            {t("common.exportData", "Export Data")}
          </Button>
          <Button
            variant="primary"
            className="h-11 px-6 font-semibold shadow-md"
            onClick={() => openFormSheet("new")}
          >
            <RiAddLine className="size-5" />
            {t("warehouse.addNew", "Add New")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="flex-1 overflow-auto mt-4">
        <InventoryConfigList />
      </div>
      <InventoryConfigFormSheet />
    </div>
  );
}
