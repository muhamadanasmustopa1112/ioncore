"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiAddLine, RiDownloadLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { BulkOperationList } from "./list/bulk-operation-list";
import { BulkOperationWizard } from "./wizard/bulk-operation-wizard";

export function BulkOperationListPage() {
  const { t } = useTranslation();
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.operations"),
            path: paths.dashboard.operations.root.getHref(),
          },
          { title: t("menu.bulkOperations") },
        ]}
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("bulkOperations.title", "Bulk Operations")}
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            variant="outline"
            className="h-11 px-5 font-semibold shadow-xs"
          >
            <RiDownloadLine className="size-4" />
            {t("common.exportData", "Export Data")}
          </Button>
          <Button
            variant="primary"
            className="h-11 px-6 font-semibold shadow-md"
            onClick={() => setWizardOpen(true)}
          >
            <RiAddLine className="size-5" />
            {t("bulkOperations.newOperation", "New Bulk Operation")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="mt-4 flex-1 overflow-auto">
        <BulkOperationList />
      </div>
      <BulkOperationWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}
