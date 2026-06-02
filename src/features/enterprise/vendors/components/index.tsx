"use client";

import { useTranslation } from "react-i18next";
import { Truck } from "lucide-react";
import { RiAddLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toolbar, ToolbarHeading, ToolbarTitle, ToolbarActions } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { VendorList } from "./list/vendor-list";
import { VendorFormSheet } from "./form/vendor-form-sheet";
import { useVendorStore } from "../store/vendor";

export function VendorListPage() {
  const { t } = useTranslation();
  const { openFormSheet } = useVendorStore();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb
        items={[
          { title: t("menu.enterprise", "Enterprise System"), path: paths.dashboard.enterprise.root.getHref() },
          { title: t("enterprise.vendors.title", "Vendors") },
        ]}
      />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("enterprise.vendors.title", "Vendors")}
          </ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <Truck className="size-3.5" />
              {t("enterprise.vendors.badge", "Vendor Management")}
            </Badge>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" className="h-11 px-6 font-semibold shadow-md" onClick={() => openFormSheet("new")}>
            <RiAddLine className="size-5" />
            {t("enterprise.vendors.addNew", "Add Vendor")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="flex-1 overflow-auto mt-4">
        <VendorList />
      </div>
      <VendorFormSheet />
    </div>
  );
}
