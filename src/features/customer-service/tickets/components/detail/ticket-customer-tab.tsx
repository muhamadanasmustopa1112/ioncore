"use client";

import { Badge } from "@/components/ui/badge";
import { customerTypeBadgeVariant } from "../../../types/ticket-labels";
import type { Ticket } from "../../../types";

interface TicketCustomerTabProps {
  ticket: Ticket;
}

export function TicketCustomerTab({ ticket }: TicketCustomerTabProps) {
  const isPublicReport = !ticket.customer_id;

  if (isPublicReport) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-dashed border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            This is a public report — no customer account linked.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Reporter Name
            </p>
            <p className="text-sm font-medium text-foreground">
              {ticket.reporter_name ?? "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Reporter Phone
            </p>
            <p className="text-sm font-medium text-foreground">
              {ticket.reporter_phone ?? "N/A"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Customer Name
          </p>
          <p className="text-sm font-medium text-foreground">
            {ticket.customer_name}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Customer Type
          </p>
          {ticket.customer_type && (
            <Badge className={customerTypeBadgeVariant[ticket.customer_type]}>
              {ticket.customer_type}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Customer ID
          </p>
          <p className="text-sm font-medium text-foreground">
            {ticket.customer_id}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Phone
          </p>
          <p className="text-sm font-medium text-foreground">
            {ticket.customer_phone ?? "N/A"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Email
          </p>
          <p className="text-sm font-medium text-foreground">
            {ticket.customer_email ?? "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
