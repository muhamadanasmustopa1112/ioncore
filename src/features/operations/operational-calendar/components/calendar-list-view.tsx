"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "../store/calendar";
import { ConflictIndicator } from "./conflict-indicator";
import type { CalendarConflict, CalendarEvent, CalendarEventType } from "../types";

const EVENT_TYPE_BADGE_VARIANT: Record<CalendarEventType, "primary" | "info" | "secondary" | "destructive"> = {
  maintenance: "primary",
  bulk_operation: "info",
  announcement: "secondary",
  incident: "destructive",
};

const EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  maintenance: "Maintenance",
  bulk_operation: "Bulk Operation",
  announcement: "Announcement",
  incident: "Incident",
};

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

type SortField = "date" | "title" | "type" | "status";
type SortDirection = "asc" | "desc";

interface ListViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function ListView({ events, onEventClick }: ListViewProps) {
  const { t } = useTranslation();
  const { setSelectedEvent } = useCalendarStore();
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortedEvents = useMemo(() => {
    const sorted = [...events];
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "date":
          cmp = a.start_date.localeCompare(b.start_date);
          break;
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "type":
          cmp = a.event_type.localeCompare(b.event_type);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [events, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="size-3 text-muted-foreground" />;
    return sortDir === "asc" ? (
      <ChevronUp className="size-3 text-primary" />
    ) : (
      <ChevronDown className="size-3 text-primary" />
    );
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return (
    <div className="overflow-x-auto border border-border rounded-lg bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => toggleSort("date")}
              >
                {t("calendar.date", "Date")} <SortIcon field="date" />
              </button>
            </th>
            <th className="px-4 py-3 text-left">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => toggleSort("title")}
              >
                {t("calendar.title", "Title")} <SortIcon field="title" />
              </button>
            </th>
            <th className="px-4 py-3 text-left">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => toggleSort("type")}
              >
                {t("calendar.type", "Type")} <SortIcon field="type" />
              </button>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
              {t("calendar.area", "Area")}
            </th>
            <th className="px-4 py-3 text-left">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => toggleSort("status")}
              >
                {t("common.status", "Status")} <SortIcon field="status" />
              </button>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
              {t("calendar.conflicts", "Conflicts")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedEvents.map((event) => (
            <tr
              key={event.event_id}
              className="border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => {
                setSelectedEvent(event);
                onEventClick(event);
              }}
            >
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-foreground">
                  {formatDate(event.start_date)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(event.start_date)} - {formatTime(event.end_date)}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-foreground max-w-[280px] truncate">
                  {event.title}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={EVENT_TYPE_BADGE_VARIANT[event.event_type]}
                  appearance="light"
                  size="sm"
                >
                  {EVENT_TYPE_LABELS[event.event_type]}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="text-xs text-muted-foreground">
                  {event.affected_areas.map((a) => a.area_name).join(", ") || "-"}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    event.status === "completed"
                      ? "success"
                      : event.status === "in_progress"
                        ? "warning"
                        : event.status === "cancelled"
                          ? "destructive"
                          : "primary"
                  }
                  appearance="light"
                  size="sm"
                >
                  {STATUS_LABELS[event.status] ?? event.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {event.has_conflicts ? (
                  <ConflictIndicator
                    conflicts={[
                      {
                        conflict_type: "overlapping_maintenance",
                        conflicting_event_id: "dummy",
                        conflicting_event_title: "Overlapping event",
                        conflicting_event_date: event.start_date,
                        severity: "high",
                      } as CalendarConflict,
                    ]}
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </td>
            </tr>
          ))}
          {sortedEvents.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                {t("calendar.noEvents", "No events found.")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
