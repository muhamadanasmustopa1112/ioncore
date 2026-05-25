"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getCoreRowModel, getSortedRowModel, useReactTable, RowSelectionState } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { RiAddLine } from "@remixicon/react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardHeader, CardHeading, CardTable } from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import {
  useAdminBroadbandPlans,
  useDeleteBroadbandPlan,
  useUpdateBroadbandPlan,
  useSubmitReviewBroadbandPlan,
  useApproveBroadbandPlan,
  useRejectBroadbandPlan,
  useSetBroadbandPlanVisibility,
} from "../../api/products-queries";
import type { BroadbandPlan } from "../../types/products";
import { usePlanColumns } from "./plan-columns";
import { PlanSheet } from "./plan-sheet";

export function PlanList() {
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryStates({
    search: parseAsString,
    branch: parseAsString,
    status: parseAsString,
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  });

  const { data: branchesData } = useBranchList({ per_page: 200, branch_type: "noc" });
  const branches = branchesData ?? [];

  const { data, isLoading } = useAdminBroadbandPlans({
    name: filter.search || undefined,
    branch_id: filter.branch || undefined,
    status: (filter.status as import("../../types/products").BroadbandPlanStatus) || undefined,
    page: filter.page,
    per_page: filter.limit,
  });

  const deletePlan = useDeleteBroadbandPlan();
  const updatePlan = useUpdateBroadbandPlan();
  const submitReview = useSubmitReviewBroadbandPlan();
  const approvePlan = useApproveBroadbandPlan();
  const rejectPlan = useRejectBroadbandPlan();
  const setVisibility = useSetBroadbandPlanVisibility();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mode, setMode] = useState<"new" | "edit" | "details">("new");
  const [selected, setSelected] = useState<BroadbandPlan | null>(null);

  const openNew = () => { setMode("new"); setSelected(null); setSheetOpen(true); };
  const openEdit = (row: BroadbandPlan) => { setMode("edit"); setSelected(row); setSheetOpen(true); };
  const openDetail = (row: BroadbandPlan) => { setMode("details"); setSelected(row); setSheetOpen(true); };
  const handleClose = () => { setSheetOpen(false); setSelected(null); };

  const plans = data?.broadband_plans ?? [];
  const total = data?.metadata?.total ?? 0;

  const setPagination = (updater: (prev: { page: number; limit: number }) => { page: number; limit: number }) => {
    const next = updater({ page: filter.page, limit: filter.limit });
    setFilter({ page: next.page, limit: next.limit });
  };

  const columns = usePlanColumns(
    openEdit,
    openDetail,
    (id) => deletePlan.mutate(id),
    (id) => submitReview.mutate(id),
    (id) => approvePlan.mutate(id),
    (id, notes) => rejectPlan.mutate({ id, notes }),
    (id, status) => setVisibility.mutate({ id, status }),
    (row) => updatePlan.mutate({ id: row.id, payload: { name: row.name, speed_download_mbps: row.speed_download_mbps, speed_upload_mbps: row.speed_upload_mbps, price: row.price, one_time_charge: row.one_time_charge, customer_type: row.customer_type, is_active: row.is_active } }),
  );

  const table = useReactTable({
    columns,
    data: plans,
    manualPagination: true,
    pageCount: Math.ceil(total / filter.limit),
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination: { pageIndex: filter.page - 1, pageSize: filter.limit },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <DataGrid table={table} recordCount={total} tableLayout={{ columnsResizable: true, cellBorder: true }} isLoading={isLoading}>
        <Card className="mt-3">
          <CardHeader>
            <CardHeading className="py-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[150px]">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    placeholder={t("administration.productsPage.planSearch")}
                    value={filter.search || ""}
                    onChange={(e) => setFilter({ search: e.target.value || null, page: 1 })}
                    className="ps-9 w-full"
                  />
                  {filter.search && (
                    <Button mode="icon" variant="ghost" className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2" onClick={() => setFilter({ search: null, page: 1 })}>
                      <X />
                    </Button>
                  )}
                </div>
                <Select
                  value={filter.branch || "all"}
                  onValueChange={(v) => setFilter({ branch: v === "all" ? null : v, page: 1 })}
                >
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder={t("administration.productsPage.planAllBranches")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("administration.productsPage.planAllBranches")}</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filter.status || "all"}
                  onValueChange={(v) => setFilter({ status: v === "all" ? null : v, page: 1 })}
                >
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue placeholder={t("administration.productsPage.planAllStatuses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("administration.productsPage.planAllStatuses")}</SelectItem>
                    <SelectItem value="draft">{t("administration.productsPage.planStatusDraft")}</SelectItem>
                    <SelectItem value="in_review">{t("administration.productsPage.planStatusInReview")}</SelectItem>
                    <SelectItem value="rejected">{t("administration.productsPage.planStatusRejected")}</SelectItem>
                    <SelectItem value="approved">{t("administration.productsPage.planStatusApproved")}</SelectItem>
                    <SelectItem value="published">{t("administration.productsPage.planStatusPublished")}</SelectItem>
                    <SelectItem value="inactive">{t("administration.productsPage.planStatusInactive")}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="primary" className="h-9 px-4 text-sm font-semibold" onClick={openNew}>
                  <RiAddLine className="size-4" /> {t("administration.productsPage.planAddBtn")}
                </Button>
              </div>
            </CardHeading>
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridContainer className="w-full"><DataGridTable /></DataGridContainer>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination
              filter={{ page: filter.page, limit: filter.limit }}
              setFilter={setPagination}
            />
          </CardFooter>
        </Card>
      </DataGrid>
      <PlanSheet open={sheetOpen} mode={mode} selected={selected} onClose={handleClose} onSwitchToEdit={openEdit} />
    </>
  );
}
