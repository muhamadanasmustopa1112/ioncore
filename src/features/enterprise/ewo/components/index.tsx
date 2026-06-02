"use client";

import { useTranslation } from "react-i18next";
import { RiAddLine } from "@remixicon/react";
import { Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toolbar, ToolbarHeading, ToolbarTitle, ToolbarActions } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { EwoList } from "./list/ewo-list";
import { EwoFormSheet } from "./form/ewo-form-sheet";
import { useEwoStore } from "../store/ewo";

export function EwoListPage() {
  const { t } = useTranslation();
  const { openFormSheet } = useEwoStore();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb
        items={[
          { title: t("menu.enterprise", "Enterprise System"), path: paths.dashboard.enterprise.root.getHref() },
          { title: t("enterprise.ewo.title", "EWO") },
        ]}
      />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("enterprise.ewo.title", "Enterprise Work Orders")}
          </ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <Wrench className="size-3.5" />
              {t("enterprise.ewo.badge", "Work Order Management")}
            </Badge>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" className="h-11 px-6 font-semibold shadow-md" onClick={() => openFormSheet("new")}>
            <RiAddLine className="size-5" />
            {t("enterprise.ewo.addNew", "Add EWO")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="flex-1 overflow-auto mt-4">
        <EwoList />
      </div>
      <EwoFormSheet />
    </div>
  );
}
