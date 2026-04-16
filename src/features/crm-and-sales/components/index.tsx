"use client";
import React from 'react';
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Download, Calendar, ChevronDown } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CrmKpiCards } from "./crm-kpi-cards";
import { CrmLeadsChart } from "./crm-leads-chart";
import { CrmCustomersTable } from "./crm-customers-table";
import { CrmLeadsTable } from "./crm-leads-table";
import { CrmSalesTable } from "./crm-sales-table";
import { CrmWorkOrdersTable } from "./crm-work-orders-table";
import { paths } from "@/config/paths";
// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function CrmAndSales() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2026, 3, 1),
    to: new Date(2026, 3, 30),
  });
  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Breadcrumb — sits directly below the header navbar */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root.getHref()}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>CRM &amp; Sales</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Filter / Actions row */}
      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-card border-border z-[100]" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        
        <Button variant="primary">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      <CrmKpiCards />
      <CrmLeadsChart />
      {/* Bottom Tables 2×2 grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <CrmCustomersTable />
        <CrmLeadsTable />
        <CrmSalesTable />
        <CrmWorkOrdersTable />
      </div>
    </div>
  );
}
