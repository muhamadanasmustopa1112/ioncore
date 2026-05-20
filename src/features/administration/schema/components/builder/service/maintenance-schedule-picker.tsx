"use client";

import { useMemo } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
] as const;

type DayKey = (typeof DAYS)[number]["key"];

interface ParsedSchedule {
  days: DayKey[];
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

function parseSchedule(raw: string): ParsedSchedule {
  const defaults: ParsedSchedule = {
    days: ["mon", "tue", "wed", "thu", "fri"],
    startHour: "02",
    startMinute: "00",
    endHour: "06",
    endMinute: "00",
  };

  if (!raw) return defaults;

  const parts = raw.split("_");
  if (parts.length < 2) return defaults;

  const daysPart = parts[0];
  const timePart = parts.slice(1).join("_");

  const knownKeys = DAYS.map((d) => d.key);
  const parsed = daysPart.split(",").filter((d): d is DayKey =>
    knownKeys.includes(d as DayKey)
  );
  const days: DayKey[] = parsed.length ? parsed : defaults.days;

  const timeMatch = timePart.match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
  if (!timeMatch) return { ...defaults, days };

  return {
    days,
    startHour: timeMatch[1],
    startMinute: timeMatch[2],
    endHour: timeMatch[3],
    endMinute: timeMatch[4],
  };
}

function serializeSchedule(parsed: ParsedSchedule): string {
  const { days, startHour, startMinute, endHour, endMinute } = parsed;
  const dayStr = days.length === 0 ? "none" : days.join(",");
  return `${dayStr}_${startHour}:${startMinute}-${endHour}:${endMinute}`;
}

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MINUTES = ["00", "15", "30", "45"];

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function MaintenanceSchedulePicker({ value, onChange, disabled }: Props) {
  const parsed = useMemo(() => parseSchedule(value), [value]);

  function update(patch: Partial<ParsedSchedule>) {
    onChange(serializeSchedule({ ...parsed, ...patch }));
  }

  function toggleDay(day: DayKey) {
    const next = parsed.days.includes(day)
      ? parsed.days.filter((d) => d !== day)
      : [...parsed.days, day];
    const ordered = DAYS.map((d) => d.key).filter((d) => next.includes(d));
    update({ days: ordered });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">Active Days</Label>
        <p className="text-[11px] text-muted-foreground">
          Select days maintenance is allowed. Unselected days are off-days.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {DAYS.map(({ key, label }) => {
            const active = parsed.days.includes(key);
            return (
              <Toggle
                key={key}
                size="sm"
                variant="outline"
                pressed={active}
                onPressedChange={() => toggleDay(key)}
                disabled={disabled}
                className="px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
              >
                {label}
              </Toggle>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Start Time</Label>
          <div className="flex gap-1.5">
            <Select
              value={parsed.startHour}
              onValueChange={(v) => update({ startHour: v })}
              disabled={disabled}
            >
              <SelectTrigger className="flex-1 text-xs h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {HOURS.map((h) => (
                  <SelectItem key={h} value={h} className="text-xs">{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={parsed.startMinute}
              onValueChange={(v) => update({ startMinute: v })}
              disabled={disabled}
            >
              <SelectTrigger className="flex-1 text-xs h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MINUTES.map((m) => (
                  <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">End Time</Label>
          <div className="flex gap-1.5">
            <Select
              value={parsed.endHour}
              onValueChange={(v) => update({ endHour: v })}
              disabled={disabled}
            >
              <SelectTrigger className="flex-1 text-xs h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {HOURS.map((h) => (
                  <SelectItem key={h} value={h} className="text-xs">{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={parsed.endMinute}
              onValueChange={(v) => update({ endMinute: v })}
              disabled={disabled}
            >
              <SelectTrigger className="flex-1 text-xs h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MINUTES.map((m) => (
                  <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
