"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "../store/calendar";
import type { CalendarEvent, CalendarEventType } from "../types";

const EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
  maintenance: "bg-blue-500/90 dark:bg-blue-400/90 border-blue-600 dark:border-blue-500",
  bulk_operation: "bg-purple-500/90 dark:bg-purple-400/90 border-purple-600 dark:border-purple-500",
  announcement: "bg-gray-400/90 dark:bg-gray-500/90 border-gray-500 dark:border-gray-400",
  incident: "bg-red-500/90 dark:bg-red-400/90 border-red-600 dark:border-red-500",
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr);
}

function getWeekDates(baseDate: Date): Date[] {
  const d = new Date(baseDate);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

interface WeeklyViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function WeeklyView({ events, onEventClick }: WeeklyViewProps) {
  const { t } = useTranslation();
  const { currentMonth, setCurrentMonth, setSelectedEvent } =
    useCalendarStore();

  const [weekOffset, setWeekOffset] = useState(0);

  const baseDate = useMemo(() => {
    const [y, m] = currentMonth.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }, [currentMonth]);

  const weekDates = useMemo(() => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + weekOffset * 7);
    return getWeekDates(d);
  }, [baseDate, weekOffset]);

  const weekEvents = useMemo(() => {
    return events.filter((event) => {
      const start = parseLocalDate(event.start_date);
      const end = parseLocalDate(event.end_date);
      return weekDates.some((wd) => {
        const dayStart = new Date(wd);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(wd);
        dayEnd.setHours(23, 59, 59, 999);
        return start <= dayEnd && end >= dayStart;
      });
    });
  }, [events, weekDates]);

  const prevWeek = () => setWeekOffset((o) => o - 1);
  const nextWeek = () => setWeekOffset((o) => o + 1);

  const today = new Date();

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          {" - "}
          {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="size-8" onClick={prevWeek}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-medium"
            onClick={() => {
              setWeekOffset(0);
              const now = new Date();
              setCurrentMonth(
                `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
              );
            }}
          >
            Today
          </Button>
          <Button variant="outline" size="icon" className="size-8" onClick={nextWeek}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg bg-card">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
            <div className="border-r border-border bg-muted/50" />
            {weekDates.map((date, i) => {
              const isToday = isSameDay(date, today);
              return (
                <div
                  key={i}
                  className={cn(
                    "border-r border-border px-2 py-2 text-center last:border-r-0",
                    isToday ? "bg-primary/10" : "bg-muted/50",
                  )}
                >
                  <p className={cn(
                    "text-xs font-semibold",
                    isToday ? "text-primary" : "text-muted-foreground",
                  )}>
                    {formatDateHeader(date)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            {HOURS.map((hour) => (
              <div key={hour} className="contents">
                <div className="border-r border-b border-border px-1 py-2 text-right bg-muted/30">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {String(hour).padStart(2, "0")}:00
                  </span>
                </div>
                {weekDates.map((date, dayIdx) => {
                  const cellEvents = weekEvents.filter((event) => {
                    const start = parseLocalDate(event.start_date);
                    const end = parseLocalDate(event.end_date);
                    const cellStart = new Date(date);
                    cellStart.setHours(hour, 0, 0, 0);
                    const cellEnd = new Date(date);
                    cellEnd.setHours(hour + 1, 0, 0, 0);
                    return start < cellEnd && end > cellStart;
                  });

                  const isStartHour = (event: CalendarEvent) => {
                    const start = parseLocalDate(event.start_date);
                    return isSameDay(start, date) && start.getHours() === hour;
                  };

                  return (
                    <div
                      key={dayIdx}
                      className="relative border-r border-b border-border min-h-[48px] last:border-r-0"
                    >
                      {cellEvents
                        .filter((e) => isStartHour(e))
                        .map((event) => {
                          const start = parseLocalDate(event.start_date);
                          const end = parseLocalDate(event.end_date);
                          const startMinutes = start.getMinutes();
                          const durationHours = Math.max(
                            1,
                            Math.ceil(
                              (end.getTime() - start.getTime()) / (1000 * 60 * 60),
                            ),
                          );
                          const height = durationHours * 48;

                          return (
                            <button
                              key={event.event_id}
                              type="button"
                              className={cn(
                                "absolute left-0.5 right-0.5 z-10 rounded border px-1.5 py-1 text-left text-[10px] font-medium text-white overflow-hidden cursor-pointer hover:opacity-90 transition-opacity",
                                EVENT_TYPE_COLORS[event.event_type],
                              )}
                              style={{
                                top: `${(startMinutes / 60) * 48}px`,
                                height: `${height}px`,
                              }}
                              onClick={() => {
                                setSelectedEvent(event);
                                onEventClick(event);
                              }}
                            >
                              <span className="block truncate leading-tight">
                                {event.title}
                              </span>
                              <span className="block text-[9px] opacity-80">
                                {start.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </span>
                            </button>
                          );
                        })}
                      {cellEvents.filter((e) => !isStartHour(e)).length > 0 &&
                        !cellEvents.some((e) => isStartHour(e)) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary/30" />
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
