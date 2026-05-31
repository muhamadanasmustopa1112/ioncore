"use client";

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
import { InvoiceList } from "./list/invoice-list";
import { useInvoiceStore } from "../store/invoice";
import { InvoiceFormSheet } from "./form/invoice-form-sheet";

export function InvoiceListPage() {
  const { t } = useTranslation();
  const { openInvoiceFormSheet } = useInvoiceStore();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.finance"),
            path: paths.dashboard.finance.root.getHref(),
          },
          { title: t("menu.invoices") },
        ]}
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("billing.invoice.title")}
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            variant="outline"
            className="h-11 px-5 font-semibold shadow-xs"
          >
            <RiDownloadLine className="size-4" />
            {t("billing.common.export")}
          </Button>
          <Button
            variant="primary"
            className="h-11 px-6 font-semibold shadow-md"
            onClick={() => openInvoiceFormSheet("new")}
          >
            <RiAddLine className="size-5" />
            {t("billing.invoice.addNew")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="flex-1 overflow-auto mt-4">
        <InvoiceList />
      </div>
      <InvoiceFormSheet />
    </div>
  );
}
