"use client";

import { useState } from "react";
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
import { useWorkOrderList } from "../api/dashboard";
import type { WorkOrderListParams } from "../types/technician-api";
import { TechnicianKpiCards } from "./technician-kpi-cards";
import { TechnicianWorkOrdersTable } from "./technician-work-orders-table";
import { TechnicianFilterBar } from "./technician-filter-bar";

const DEFAULT_FILTERS: WorkOrderListParams = {
  page: 1,
  per_page: 15,
};

export function TechnicianDashboard() {
  const [pendingFilters, setPendingFilters] = useState<WorkOrderListParams>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<WorkOrderListParams>(DEFAULT_FILTERS);

  const { data, isLoading } = useWorkOrderList({ params: appliedFilters });

  function handleApply() {
    setAppliedFilters({ ...pendingFilters, page: 1 });
  }

  function handlePageChange(page: number) {
    const next = { ...appliedFilters, page };
    setAppliedFilters(next);
    setPendingFilters(next);
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-background relative">
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

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface">Work Order Monitoring</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Real-time status tracking for field technician operations.
        </p>
      </div>

      <TechnicianFilterBar
        filters={pendingFilters}
        onChange={setPendingFilters}
        onApply={handleApply}
      />

      <TechnicianKpiCards summary={data?.summary} isLoading={isLoading} />

      <TechnicianWorkOrdersTable
        items={data?.items ?? []}
        metadata={data?.metadata}
        isLoading={isLoading}
        page={appliedFilters.page ?? 1}
        onPageChange={handlePageChange}
      />

      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 group z-20">
        <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
          <Plus className="size-7 sm:size-8" />
        </button>
        <span className="hidden sm:inline-block absolute right-16 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          New Work Order
        </span>
      </div>
    </div>
  );
}
