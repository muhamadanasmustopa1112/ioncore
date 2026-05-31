"use client";

import { useTranslation } from "react-i18next";
import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { TicketList } from "./list/ticket-list";

export function TicketListPage() {
  const { t } = useTranslation();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.customerService", "Customer Service"),
            path: paths.dashboard.customerService.root.getHref(),
          },
          { title: t("cs.tickets", "Tickets") },
        ]}
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("cs.tickets", "Tickets")}
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            variant="primary"
            className="h-11 px-6 font-semibold shadow-md"
          >
            <RiAddLine className="size-5" />
            {t("cs.newTicket", "New Ticket")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="flex-1 overflow-auto mt-4">
        <TicketList />
      </div>
    </div>
  );
}
