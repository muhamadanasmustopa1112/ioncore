"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { entryTypeIcon, entryTypeLabel } from "../../../types/ticket-labels";
import type { Ticket, TicketTimelineEntry } from "../../../types";

interface TicketTimelineTabProps {
  ticket: Ticket;
}

export function TicketTimelineTab({ ticket }: TicketTimelineTabProps) {
  const sortedTimeline = useMemo(
    () =>
      [...ticket.timeline].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [ticket.timeline]
  );

  return (
    <div className="space-y-0">
      {sortedTimeline.map((entry, index) => (
        <TimelineEntryItem
          key={entry.id}
          entry={entry}
          isLast={index === sortedTimeline.length - 1}
        />
      ))}
      {sortedTimeline.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No timeline entries yet.
        </p>
      )}
    </div>
  );
}

function TimelineEntryItem({
  entry,
  isLast,
}: {
  entry: TicketTimelineEntry;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`size-3 rounded-full mt-1.5 ${entryTypeIcon[entry.entry_type] ?? "bg-gray-500"}`}
        />
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>
      <div className="pb-6 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {entryTypeLabel[entry.entry_type] ?? entry.entry_type}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {format(new Date(entry.created_at), "dd MMM yyyy, HH:mm")}
          </span>
          <span className="text-xs text-muted-foreground">
            by {entry.created_by}
          </span>
        </div>
        <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">
          {entry.content}
        </p>
      </div>
    </div>
  );
}
