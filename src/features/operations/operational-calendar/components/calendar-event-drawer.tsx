"use client";

import { useTranslation } from "react-i18next";
import { Calendar, Clock, MapPin, Zap, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCalendarStore } from "../store/calendar";
import type { CalendarEvent, CalendarEventType, CalendarEventStatus } from "../types";

const EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  maintenance: "Maintenance",
  bulk_operation: "Bulk Operation",
  announcement: "Announcement",
  incident: "Incident",
};

const EVENT_TYPE_BADGE: Record<CalendarEventType, "primary" | "info" | "secondary" | "destructive"> = {
  maintenance: "primary",
  bulk_operation: "info",
  announcement: "secondary",
  incident: "destructive",
};

const STATUS_BADGE: Record<CalendarEventStatus, "success" | "warning" | "primary" | "destructive"> = {
  scheduled: "primary",
  in_progress: "warning",
  completed: "success",
  cancelled: "destructive",
};

const STATUS_LABELS: Record<CalendarEventStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const DUMMY_TIMELINE = [
  { time: "Created", description: "Event created by system", offset: "0d" },
  { time: "Scheduled", description: "Added to operations calendar", offset: "0d" },
  { time: "Team Notified", description: "Affected teams notified via email", offset: "-1d" },
];

const DUMMY_LINKED_WOS = [
  { id: "WO-2026-0481", title: "OLT Port Check", status: "CREATED" },
  { id: "WO-2026-0482", title: "Fiber Route Inspection", status: "IN_PROGRESS" },
];

interface EventDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDrawer({ open, onOpenChange }: EventDrawerProps) {
  const { t } = useTranslation();
  const { selectedEvent } = useCalendarStore();

  if (!selectedEvent) return null;

  const event = selectedEvent;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[520px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <SheetTitle className="font-semibold text-lg leading-tight">
                {event.title}
              </SheetTitle>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {event.event_id}
              </p>
            </div>
            <Badge
              variant={STATUS_BADGE[event.status]}
              appearance="light"
              size="sm"
              className="shrink-0 mt-1"
            >
              {STATUS_LABELS[event.status]}
            </Badge>
          </div>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-auto p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("calendar.eventType", "Event Type")}
              </p>
              <Badge variant={EVENT_TYPE_BADGE[event.event_type]} appearance="light" size="sm">
                {EVENT_TYPE_LABELS[event.event_type]}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("calendar.priority", "Priority")}
              </p>
              <Badge
                variant={
                  event.metadata.priority === "critical"
                    ? "destructive"
                    : event.metadata.priority === "high"
                      ? "warning"
                      : "secondary"
                }
                appearance="light"
                size="sm"
              >
                {PRIORITY_LABELS[event.metadata.priority ?? "medium"]}
              </Badge>
            </div>
          </div>

          <div className="rounded-md border border-border p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium text-foreground">
                {formatDate(event.start_date)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium text-foreground">
                {formatTime(event.start_date)} - {formatTime(event.end_date)}
              </span>
            </div>
            {event.metadata.service_impact && (
              <div className="flex items-center gap-2 text-sm">
                <Zap className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Impact:</span>
                <span className="font-medium text-foreground capitalize">
                  {event.metadata.service_impact.replace(/_/g, " ")}
                </span>
              </div>
            )}
            {event.metadata.estimated_customers_affected !== undefined &&
              event.metadata.estimated_customers_affected > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground ml-6">Affected Customers:</span>
                  <span className="font-medium text-foreground">
                    {event.metadata.estimated_customers_affected.toLocaleString()}
                  </span>
                </div>
              )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("calendar.affectedAreas", "Affected Areas")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {event.affected_areas.map((area) => (
                <div
                  key={area.area_id}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2.5 py-1.5 text-xs"
                >
                  <MapPin className="size-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">{area.area_name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("calendar.impactedNodes", "Impacted Nodes")}
            </p>
            <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              <p>3 OLT devices, 12 ODP nodes, 1 backbone segment</p>
              <p className="mt-1 text-[11px]">
                Affected fiber route: Kelapa Gading → Sunter → PIK
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("calendar.linkedWOs", "Linked Work Orders")}
            </p>
            <div className="space-y-1.5">
              {DUMMY_LINKED_WOS.map((wo) => (
                <div
                  key={wo.id}
                  className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{wo.id}</span>
                    <span className="text-xs text-muted-foreground">- {wo.title}</span>
                  </div>
                  <Badge
                    variant={
                      wo.status === "DONE"
                        ? "success"
                        : wo.status === "IN_PROGRESS"
                          ? "warning"
                          : "primary"
                    }
                    appearance="light"
                    size="xs"
                  >
                    {wo.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("calendar.timeline", "Timeline")}
            </p>
            <div className="relative ml-2 border-l-2 border-border pl-4 space-y-4">
              {DUMMY_TIMELINE.map((entry, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-primary bg-background" />
                  <p className="text-xs font-medium text-foreground">{entry.time}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {event.metadata.created_by && (
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                Created by:{" "}
                <span className="font-medium text-foreground">
                  {event.metadata.created_by}
                </span>
              </p>
            </div>
          )}
        </SheetBody>

        <div className="border-t border-border p-5 pb-4 flex gap-2.5 justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("common.close", "Close")}
          </Button>
          <Button variant="outline" size="sm">
            {t("calendar.escalate", "Escalate")}
          </Button>
          <Button variant="outline" size="sm">
            {t("calendar.cancelEvent", "Cancel Event")}
          </Button>
          <Button variant="primary" size="sm">
            {t("common.edit", "Edit")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
