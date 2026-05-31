"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { Ticket } from "../../../types";
import {
  statusBadgeVariant,
  statusLabel,
  priorityBadgeVariant,
  ticketTypeLabel,
  channelLabel,
} from "../../../types/ticket-labels";

interface TicketOverviewTabProps {
  ticket: Ticket;
}

export function TicketOverviewTab({ ticket }: TicketOverviewTabProps) {
  const slaFirstResponseDue = new Date(ticket.sla_first_response_due);
  const slaResolutionDue = new Date(ticket.sla_resolution_due);

  const slaInfo = useMemo(() => {
    const now = new Date();
    const firstResponseRemaining = slaFirstResponseDue.getTime() - now.getTime();
    const resolutionRemaining = slaResolutionDue.getTime() - now.getTime();

    const formatRemaining = (ms: number) => {
      if (ms <= 0) return "Breached";
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days}d ${hours % 24}h remaining`;
      }
      return `${hours}h ${minutes}m remaining`;
    };

    return {
      firstResponseText: ticket.sla_first_response_at
        ? `Responded at ${format(new Date(ticket.sla_first_response_at), "dd MMM HH:mm")}`
        : formatRemaining(firstResponseRemaining),
      firstResponseBreached: firstResponseRemaining <= 0 && !ticket.sla_first_response_at,
      resolutionText:
        ticket.status === "resolved" || ticket.status === "closed"
          ? "Resolved"
          : formatRemaining(resolutionRemaining),
      resolutionBreached:
        resolutionRemaining <= 0 &&
        ticket.status !== "resolved" &&
        ticket.status !== "closed",
    };
  }, [ticket.sla_first_response_due, ticket.sla_resolution_due, ticket.sla_first_response_at, ticket.status]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {ticket.subject}
        </h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {ticket.description}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Status
          </p>
          <Badge className={statusBadgeVariant[ticket.status]}>
            {statusLabel[ticket.status]}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Priority
          </p>
          <Badge className={priorityBadgeVariant[ticket.priority]}>
            {ticket.priority}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Type
          </p>
          <p className="text-sm font-medium text-foreground">
            {ticketTypeLabel[ticket.ticket_type]}
            {ticket.complaint_type && (
              <span className="text-muted-foreground ml-1">
                ({ticket.complaint_type.replace(/_/g, " ")})
              </span>
            )}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Channel
          </p>
          <p className="text-sm font-medium text-foreground">
            {channelLabel[ticket.channel]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            SLA First Response
          </p>
          <p className={`text-sm font-medium ${slaInfo.firstResponseBreached ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
            {slaInfo.firstResponseText}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            SLA Resolution
          </p>
          <p className={`text-sm font-medium ${slaInfo.resolutionBreached ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
            {slaInfo.resolutionText}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Created
          </p>
          <p className="text-sm font-medium text-foreground">
            {format(new Date(ticket.created_at), "dd MMM yyyy, HH:mm")}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Reopens
          </p>
          <p className="text-sm font-medium text-foreground">
            {ticket.reopen_count} / {ticket.max_reopens}
          </p>
        </div>
      </div>

      {ticket.assignments.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Assignments
          </h4>
          <div className="space-y-2">
            {ticket.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center gap-3 p-2 rounded-md bg-muted/50"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {assignment.user_name ?? "Unassigned"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {assignment.role.replace(/_/g, " ")}
                    {assignment.branch_name && ` \u2014 ${assignment.branch_name}`}
                  </p>
                </div>
                {assignment.is_primary && (
                  <Badge variant="outline" className="text-xs">
                    Primary
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
