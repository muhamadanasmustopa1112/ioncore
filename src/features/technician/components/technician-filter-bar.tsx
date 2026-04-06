"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function TechnicianFilterBar() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 9, 20),
    to: new Date(2023, 9, 27),
  });

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded shadow-sm border border-outline mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Date Range</label>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center justify-start bg-surface-variant dark:bg-slate-800 border border-outline rounded text-sm py-2 pl-3 pr-4 focus:ring-1 focus:ring-primary outline-none text-left",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4 text-slate-400 shrink-0" />
                  {date?.from ? (
                    date.to ? (
                      <span className="truncate">
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </span>
                    ) : (
                      <span className="truncate">{format(date.from, "LLL dd, y")}</span>
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-900 border-outline z-[100]" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</label>
          <select className="w-full bg-surface-variant dark:bg-slate-800 border border-outline text-slate-600 dark:text-slate-300 rounded text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer">
            <option>All Statuses</option>
            <option>On Going</option>
            <option>Pending</option>
            <option>Abort</option>
            <option>Finish</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Order Type</label>
          <select className="w-full bg-surface-variant dark:bg-slate-800 border border-outline text-slate-600 dark:text-slate-300 rounded text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer">
            <option>All Types</option>
            <option>New Installation</option>
            <option>Maintenance</option>
            <option>Termination</option>
          </select>
        </div>
        <div>
          <button className="w-full bg-primary text-white font-semibold py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors shadow-sm">
            <Filter className="size-4" /> Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
