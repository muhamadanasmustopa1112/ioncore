"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
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
import { PERMISSIONS } from "@/config/permissions";
import { useBranchScope } from "@/hooks/use-branch-scope";
import { Can, PageGuard } from "@/lib/permissions";
import { useWorkOrderList, useWorkOrderListByBranches } from "../api/dashboard";
import { useAuthStore } from "@/store/auth-store";
import type { WorkOrderListParams, WorkOrderState, WorkOrderType } from "../types/technician-api";
import { TechnicianKpiCards } from "./technician-kpi-cards";
import { WorkOrdersTable } from "./work-order-table/work-orders-table";
import { TechnicianFilterBar } from "./technician-filter-bar";

export function TechnicianDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const perPage = Number(searchParams.get("per_page") ?? 10);
  const stateParam = (searchParams.get("state") ?? "") as WorkOrderState | "";
  const typeParam = (searchParams.get("type") ?? "") as WorkOrderType | "";
  const branchParam = searchParams.get("branch_id") ?? "";
  const dateParam = searchParams.get("date") ?? "";

  const appliedFilters: WorkOrderListParams = {
    page,
    per_page: perPage,
    order: "desc",
    sort_by: "created_at",
    ...(stateParam ? { state: stateParam } : {}),
    ...(typeParam ? { type: typeParam } : {}),
    ...(branchParam ? { branch_id: branchParam } : {}),
    ...(dateParam ? { date: dateParam } : {}),
  };

  const [pendingFilters, setPendingFilters] = useState<WorkOrderListParams>({
    page,
    per_page: perPage,
    order: "desc",
    sort_by: "created_at",
    ...(stateParam ? { state: stateParam } : {}),
    ...(typeParam ? { type: typeParam } : {}),
    ...(branchParam ? { branch_id: branchParam } : {}),
    ...(dateParam ? { date: dateParam } : {}),
  });

  const { rawUser } = useAuthStore();
  const { isBranchScoped, scopedBranchIds, showBranchFilter, primaryBranchId } =
    useBranchScope("work_orders");

  const resolvedBranchId = isBranchScoped
    ? appliedFilters.branch_id || primaryBranchId
    : appliedFilters.branch_id || undefined;

  const listParams = {
    ...appliedFilters,
    branch_id: resolvedBranchId,
  };

  const useMultiBranchFetch = isBranchScoped && scopedBranchIds.length > 1 && !appliedFilters.branch_id;

  const { data: defaultData, isLoading: isDefaultLoading } = useWorkOrderList({
    params: listParams,
    queryConfig: { enabled: !!rawUser && !useMultiBranchFetch },
  });

  const { data: scopedData, isLoading: isScopedLoading } = useWorkOrderListByBranches(
    scopedBranchIds,
    appliedFilters,
    !!rawUser && useMultiBranchFetch,
  );

  const data = useMultiBranchFetch ? scopedData : defaultData;
  const isLoading = useMultiBranchFetch ? isScopedLoading : isDefaultLoading;

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
      branch_id: pendingFilters.branch_id ?? "",
      date: pendingFilters.date ?? "",
    });
  }

  function handlePageChange(p: number) {
    setParams({ page: p });
  }

  function handlePerPageChange(pp: number) {
    setParams({ page: 1, per_page: pp });
  }

  return (
    <PageGuard permission={PERMISSIONS.technician.read}>
    <div className="flex flex-col gap-5 p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root.getHref()}>{t("common.home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("technician.title")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">{t("workOrder.title")}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {t("workOrder.subtitle")}
        </p>
      </div>

      <TechnicianKpiCards summary={data?.summary} isLoading={isLoading} />

      <TechnicianFilterBar
        filters={pendingFilters}
        onChange={setPendingFilters}
        onApply={handleApply}
        hideSubArea={!showBranchFilter}
      />

      <WorkOrdersTable
        items={data?.items ?? []}
        metadata={data?.metadata}
        isLoading={isLoading}
        page={page}
        onPageChange={handlePageChange}
        perPage={perPage}
        onPerPageChange={handlePerPageChange}
      />

      <Can permission={PERMISSIONS.technician.manage}>
        <div className="fixed bottom-6 right-6 group z-20">
          <button className="h-12 w-12 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
            <Plus className="size-6" />
          </button>
          <span className="hidden sm:inline-block absolute right-14 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {t("workOrder.newWorkOrder")}
          </span>
        </div>
      </Can>
    </div>
    </PageGuard>
  );
}
