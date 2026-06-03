"use client";

import { useTranslation } from "react-i18next";
import { RiAddLine, RiDownloadLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { ReceiveList } from "./list/receive-list";
import { ReceiveFormSheet } from "./form/receive-form-sheet";
import { useWarehouseStore } from "../../store/warehouse";

export function ReceiveListPage() {
  const { t } = useTranslation();
  const { openReceiveFormSheet } = useWarehouseStore();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb items={[{ title: t("menu.warehouse", "Warehouse & Asset"), path: paths.dashboard.warehouse.root.getHref() }, { title: t("warehouse.receiveTitle", "Receive Stock") }]} />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading><ToolbarTitle className="text-2xl font-extrabold tracking-tight">{t("warehouse.receiveTitle", "Receive Stock")}</ToolbarTitle></ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs"><RiDownloadLine className="size-4" />{t("common.exportData", "Export Data")}</Button>
          <Button variant="primary" className="h-11 px-6 font-semibold shadow-md" onClick={() => openReceiveFormSheet("new")}><RiAddLine className="size-5" />{t("warehouse.newReceive", "New Receive")}</Button>
        </ToolbarActions>
      </Toolbar>
      <div className="flex-1 overflow-auto mt-4"><ReceiveList /></div>
      <ReceiveFormSheet />
    </div>
  );
}
