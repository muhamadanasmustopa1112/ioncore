"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { paths } from "@/config/paths";
import { TechnicianKpiCards } from "./technician-kpi-cards";
import { TechnicianWorkOrdersTable } from "./technician-work-orders-table";
import { TechnicianFilterBar } from "./technician-filter-bar";

export function TechnicianDashboard() {
  return (
    <div className="flex-1 p-8 bg-background relative">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root.getHref()}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Technician &amp; Field</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Work Order Monitoring</h1>
        <p className="text-sm text-on-surface-variant text-slate-500">Real-time status tracking for field technician operations.</p>
      </div>

      <TechnicianFilterBar />

      <TechnicianKpiCards />

      <TechnicianWorkOrdersTable />

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-8 right-8 group z-20">
        <button className="h-14 w-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
          <Plus className="size-8" />
        </button>
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          New Work Order
        </span>
      </div>
    </div>
  );
}
