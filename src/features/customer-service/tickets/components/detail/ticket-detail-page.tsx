"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { RiArrowLeftLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useTicket } from "../../api/get-ticket";
import { TicketOverviewTab } from "./ticket-overview-tab";
import { TicketTimelineTab } from "./ticket-timeline-tab";
import { TicketCustomerTab } from "./ticket-customer-tab";
import { TicketLinkedWoTab } from "./ticket-linked-wo-tab";
import { TicketActionsBar } from "./ticket-actions-bar";
import { statusBadgeVariant, statusLabel } from "@/features/customer-service/types/ticket-labels";

export function TicketDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const ticketId = String(params.id);

  const { data: ticket, isLoading } = useTicket({ id: ticketId });

  if (isLoading) {
    return (
      <div className="px-6 py-3 space-y-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="px-6 py-3">
        <p className="text-muted-foreground">Ticket not found.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.customerService", "Customer Service"),
            path: paths.dashboard.customerService.root.getHref(),
          },
          {
            title: t("cs.tickets", "Tickets"),
            path: paths.dashboard.customerService.tickets.root.getHref(),
          },
          { title: ticket.ticket_number },
        ]}
      />

      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Back to tickets"
              onClick={() =>
                router.push(
                  paths.dashboard.customerService.tickets.root.getHref()
                )
              }
            >
              <RiArrowLeftLine className="size-5" />
            </Button>
            <div>
              <ToolbarTitle className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                {ticket.ticket_number}
                <Badge className={statusBadgeVariant[ticket.status]}>
                  {statusLabel[ticket.status]}
                </Badge>
              </ToolbarTitle>
            </div>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <TicketActionsBar ticket={ticket} />
        </ToolbarActions>
      </Toolbar>

      <div className="mt-4 overflow-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">
              {t("cs.tabOverview", "Overview")}
            </TabsTrigger>
            <TabsTrigger value="timeline">
              {t("cs.tabTimeline", "Timeline")} ({ticket.timeline.length})
            </TabsTrigger>
            <TabsTrigger value="customer">
              {t("cs.tabCustomerInfo", "Customer Info")}
            </TabsTrigger>
            <TabsTrigger value="linked-wos">
              {t("cs.tabLinkedWos", "Linked WOs")} ({ticket.linked_wos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <TicketOverviewTab ticket={ticket} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <TicketTimelineTab ticket={ticket} />
          </TabsContent>

          <TabsContent value="customer" className="mt-4">
            <TicketCustomerTab ticket={ticket} />
          </TabsContent>

          <TabsContent value="linked-wos" className="mt-4">
            <TicketLinkedWoTab ticket={ticket} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
