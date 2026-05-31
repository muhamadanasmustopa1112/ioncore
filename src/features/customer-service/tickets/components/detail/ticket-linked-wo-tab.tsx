"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { woStatusBadgeVariant } from "../../../types/ticket-labels";
import type { Ticket, TicketLinkedWo } from "../../../types";

interface TicketLinkedWoTabProps {
  ticket: Ticket;
}

export function TicketLinkedWoTab({ ticket }: TicketLinkedWoTabProps) {
  if (ticket.linked_wos.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No work orders linked to this ticket.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ticket.linked_wos.map((wo) => (
        <LinkedWoCard key={wo.wo_id} wo={wo} />
      ))}
    </div>
  );
}

function LinkedWoCard({ wo }: { wo: TicketLinkedWo }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{wo.wo_number}</p>
        <p className="text-xs text-muted-foreground capitalize">
          {wo.wo_type.replace(/_/g, " ")} &middot;{" "}
          {format(new Date(wo.created_at), "dd MMM yyyy")}
        </p>
      </div>
      <Badge className={woStatusBadgeVariant[wo.status] ?? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}>
        {wo.status.replace(/_/g, " ")}
      </Badge>
    </div>
  );
}
