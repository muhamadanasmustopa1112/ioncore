"use client";

import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAY_KEYS, type DayKey, type MaintenanceScheduleItem } from "../../../types/service-schema";

const DAY_LABELS: Record<DayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

interface Props {
  value: MaintenanceScheduleItem[];
  onChange: (v: MaintenanceScheduleItem[]) => void;
  disabled?: boolean;
}

export function MaintenanceSchedulePicker({ value, onChange, disabled }: Props) {
  const activeMap = new Map(value.map((item) => [item.day, item]));

  function toggleDay(day: DayKey) {
    if (activeMap.has(day)) {
      onChange(value.filter((item) => item.day !== day));
    } else {
      const ordered = DAY_KEYS.filter((d) => d === day || activeMap.has(d)).map((d) => {
        if (d === day) return { day, start_time: "02:00", end_time: "06:00" };
        return activeMap.get(d)!;
      });
      onChange(ordered);
    }
  }

  function updateTime(day: DayKey, field: "start_time" | "end_time", part: "h" | "m", val: string) {
    onChange(
      value.map((item) => {
        if (item.day !== day) return item;
        const [h, m] = item[field].split(":");
        const newTime = field === "start_time"
          ? `${part === "h" ? val : h}:${part === "m" ? val : m}`
          : `${part === "h" ? val : h}:${part === "m" ? val : m}`;
        return { ...item, [field]: newTime };
      })
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">Maintenance Schedule</Label>
        <p className="text-[11px] text-muted-foreground">
          Enable days and set individual time windows. Disabled days have no maintenance.
        </p>
      </div>

      <div className="space-y-2">
        {DAY_KEYS.map((day) => {
          const item = activeMap.get(day);
          const isActive = !!item;
          const [startH, startM] = (item?.start_time ?? "02:00").split(":");
          const [endH, endM] = (item?.end_time ?? "06:00").split(":");

          return (
            <div
              key={day}
              className={`rounded-lg border transition-colors ${isActive ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"}`}
            >
              <div className="flex items-center gap-3 px-3 py-2">
                <Toggle
                  size="sm"
                  variant="outline"
                  pressed={isActive}
                  onPressedChange={() => toggleDay(day)}
                  disabled={disabled}
                  className="w-28 shrink-0 justify-start text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                >
                  {DAY_LABELS[day]}
                </Toggle>

                {isActive ? (
                  <div className="flex flex-1 items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground w-14">Start</span>
                      <Select value={startH} onValueChange={(v) => updateTime(day, "start_time", "h", v)} disabled={disabled}>
                        <SelectTrigger className="w-14 h-7 text-xs px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {HOURS.map((h) => <SelectItem key={h} value={h} className="text-xs">{h}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground text-xs">:</span>
                      <Select value={startM} onValueChange={(v) => updateTime(day, "start_time", "m", v)} disabled={disabled}>
                        <SelectTrigger className="w-14 h-7 text-xs px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MINUTES.map((m) => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <span className="text-muted-foreground text-xs">→</span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground w-14">End</span>
                      <Select value={endH} onValueChange={(v) => updateTime(day, "end_time", "h", v)} disabled={disabled}>
                        <SelectTrigger className="w-14 h-7 text-xs px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {HOURS.map((h) => <SelectItem key={h} value={h} className="text-xs">{h}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground text-xs">:</span>
                      <Select value={endM} onValueChange={(v) => updateTime(day, "end_time", "m", v)} disabled={disabled}>
                        <SelectTrigger className="w-14 h-7 text-xs px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MINUTES.map((m) => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <span className="text-[11px] text-muted-foreground/50 italic">No maintenance window</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
