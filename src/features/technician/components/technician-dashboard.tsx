"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import type { WorkOrderListParams, WorkOrderState, WorkOrderType } from "../types/technician-api";
import { TechnicianKpiCards } from "./technician-kpi-cards";
import { TechnicianWorkOrdersTable } from "./technician-work-orders-table";
import { TechnicianFilterBar } from "./technician-filter-bar";

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

export function TechnicianDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const perPage = Number(searchParams.get("per_page") ?? 15);
  const stateParam = (searchParams.get("state") ?? "") as WorkOrderState | "";
  const typeParam = (searchParams.get("type") ?? "") as WorkOrderType | "";

  const appliedFilters: WorkOrderListParams = {
    page,
    per_page: perPage,
    order: "desc",
    sort_by: "created_at",
    ...(stateParam ? { state: stateParam } : {}),
    ...(typeParam ? { type: typeParam } : {}),
  };

  const [pendingFilters, setPendingFilters] = useState<WorkOrderListParams>({
    page,
    per_page: perPage,
    order: "desc",
    sort_by: "created_at",
    ...(stateParam ? { state: stateParam } : {}),
    ...(typeParam ? { type: typeParam } : {}),
  });

  const { data, isLoading } = useWorkOrderList({ params: appliedFilters });

  const setParams = useCallback((updates: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined || v === "") p.delete(k);
      else p.set(k, String(v));
    }
    router.push(`?${p.toString()}`);
  }, [router, searchParams]);

  function handleApply() {
    setParams({
      page: 1,
      per_page: pendingFilters.per_page,
      state: pendingFilters.state ?? "",
      type: pendingFilters.type ?? "",
    });
  }

  function handlePageChange(p: number) {
    setParams({ page: p });
  }

  function handlePerPageChange(pp: number) {
    setParams({ page: 1, per_page: pp });
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <Breadcrumb>
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

      <div>
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Work Order Monitoring</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Real-time status tracking for field technician operations.
        </p>
      </div>

      <TechnicianKpiCards summary={data?.summary} isLoading={isLoading} />

      <TechnicianFilterBar
        filters={pendingFilters}
        onChange={setPendingFilters}
        onApply={handleApply}
      />

      <TechnicianWorkOrdersTable
        items={data?.items ?? []}
        total={data?.metadata?.count ?? 0}
        isLoading={isLoading}
        page={page}
        perPage={perPage}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

      <div className="fixed bottom-6 right-6 group z-20">
        <button className="h-12 w-12 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
          <Plus className="size-6" />
        </button>
        <span className="hidden sm:inline-block absolute right-14 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          New Work Order
        </span>
      </div>
    </div>
  );
}
