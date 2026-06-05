"use client";

import { useTranslation } from "react-i18next";
import { RiAddLine, RiDownloadLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { paths } from "@/config/paths";
import { OpnameList } from "./list/opname-list";
import { OpnameFormSheet } from "./form/opname-form-sheet";
import { useWarehouseStore } from "../../store/warehouse";

export function OpnameListPage() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { openOpnameFormSheet } = useWarehouseStore();

  return (
    <div className={`relative h-full w-full overflow-hidden ${isMobile ? "px-4 py-3" : "px-6 py-3"}`}>
      {!isMobile && (
        <PageBreadcrumb items={[{ title: t("menu.warehouse", "Warehouse & Asset"), path: paths.dashboard.warehouse.root.getHref() }, { title: t("warehouse.opnameTitle", "Stock Opname") }]} />
      )}
      <Toolbar className={isMobile ? "mt-2 items-center" : "mt-5 items-center"}>
        <ToolbarHeading>
          <ToolbarTitle className={isMobile ? "text-lg font-extrabold tracking-tight" : "text-2xl font-extrabold tracking-tight"}>
            {t("warehouse.opnameTitle", "Stock Opname")}
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          {!isMobile && (
            <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
              <RiDownloadLine className="size-4" />
              {t("common.exportData", "Export Data")}
            </Button>
          )}
          <Button variant="primary" className="h-10 px-4 font-semibold shadow-md" onClick={() => openOpnameFormSheet("new")}>
            <RiAddLine className="size-5" />
            {t("warehouse.newOpname", "New Opname")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="flex-1 overflow-auto mt-4"><OpnameList /></div>
      <OpnameFormSheet />
    </div>
  );
}
