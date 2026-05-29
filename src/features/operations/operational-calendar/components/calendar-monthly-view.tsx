"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "../store/calendar";
import type { CalendarEvent, CalendarEventType } from "../types";

const EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
  maintenance: "bg-blue-500 dark:bg-blue-400",
  bulk_operation: "bg-purple-500 dark:bg-purple-400",
  announcement: "bg-gray-400 dark:bg-gray-500",
  incident: "bg-red-500 dark:bg-red-400",
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr);
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

interface MonthlyViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function MonthlyView({ events, onEventClick }: MonthlyViewProps) {
  const { t } = useTranslation();
  const { currentMonth, setCurrentMonth, setSelectedEvent } =
    useCalendarStore();

  const [year, month] = currentMonth.split("-").map(Number);

  const daysInMonth = getDaysInMonth(year, month - 1);
  const firstDay = getFirstDayOfMonth(year, month - 1);

  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1);
    setCurrentMonth(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const nextMonth = () => {
    const d = new Date(year, month, 1);
    setCurrentMonth(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const today = new Date();

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    events.forEach((event) => {
      const start = parseLocalDate(event.start_date);
      const end = parseLocalDate(event.end_date);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getMonth() + 1 === month && d.getFullYear() === year) {
          const day = d.getDate();
          if (!map.has(day)) map.set(day, []);
          map.get(day)!.push(event);
        }
      }
    });
    return map;
  }, [events, year, month]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          {new Date(year, month - 1).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="size-8" onClick={prevMonth}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-medium"
            onClick={() => {
              const now = new Date();
              setCurrentMonth(
                `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
              );
            }}
          >
            Today
          </Button>
          <Button variant="outline" size="icon" className="size-8" onClick={nextMonth}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        className="grid grid-cols-7 border border-border rounded-lg overflow-hidden bg-card"
      >
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="border-b border-r border-border bg-muted/50 px-2 py-2 text-center text-xs font-semibold text-muted-foreground last:border-r-0"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: totalCells }, (_, i) => {
          const dayNum = i - firstDay + 1;
          const isValidDay = dayNum >= 1 && dayNum <= daysInMonth;
          const isToday =
            isValidDay &&
            today.getFullYear() === year &&
            today.getMonth() + 1 === month &&
            today.getDate() === dayNum;

          const dayEvents = isValidDay ? eventsByDay.get(dayNum) ?? [] : [];

          return (
            <div
              key={i}
              className={cn(
                "min-h-[90px] border-b border-r border-border p-1.5 last:border-r-0 transition-colors",
                isValidDay
                  ? "bg-card hover:bg-muted/30 cursor-pointer"
                  : "bg-muted/20",
                isToday && "bg-primary/5",
              )}
              onClick={() => {
                if (dayEvents.length === 1) {
                  setSelectedEvent(dayEvents[0]);
                  onEventClick(dayEvents[0]);
                } else if (dayEvents.length > 1) {
                  setSelectedEvent(dayEvents[0]);
                  onEventClick(dayEvents[0]);
                }
              }}
            >
              {isValidDay && (
                <>
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-xs font-medium",
                      isToday &&
                        "bg-primary text-primary-foreground font-bold",
                      !isToday && "text-foreground",
                    )}
                  >
                    {dayNum}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <button
                        key={event.event_id}
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-1 rounded px-1 py-0.5 text-left text-[10px] font-medium leading-tight text-white truncate hover:opacity-80 transition-opacity",
                          EVENT_TYPE_COLORS[event.event_type],
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          onEventClick(event);
                        }}
                      >
                        <span className="truncate">{event.title}</span>
                      </button>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="block px-1 text-[10px] text-muted-foreground font-medium">
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
