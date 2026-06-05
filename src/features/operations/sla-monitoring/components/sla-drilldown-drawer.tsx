"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Download, Filter, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlaStatusBadge } from "./sla-status-badge";
import { DrilldownTable } from "./drilldown-table";
import { useSlaStore } from "../store/sla";

const PAGE_SIZE = 5;

const DUMMY_AREAS = [
  "Jakarta Selatan",
  "Jakarta Barat",
  "Jakarta Utara",
  "Tangerang",
  "Bekasi",
  "Depok",
  "Bogor",
];

const DUMMY_STATUSES = [
  "Unassigned",
  "In Progress",
  "Escalated",
  "Critical",
  "Overdue",
  "Warning",
  "Pending",
  "Resolved",
];

export function SlaDrilldownDrawer() {
  const { t } = useTranslation();
  const { selectedMetric, setSelectedMetric } = useSlaStore();
  const open = !!selectedMetric;

  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const records = useMemo(() => {
    if (!selectedMetric) return [];
    let filtered = [...selectedMetric.drilldown_records];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.wo_number?.toLowerCase().includes(q) ||
          r.customer_name?.toLowerCase().includes(q),
      );
    }
    if (areaFilter !== "all") {
      filtered = filtered.filter((r) => r.area === areaFilter);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }
    return filtered;
  }, [selectedMetric, search, areaFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const paged = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allSelected = paged.length > 0 && paged.every((r) => selectedIds.has(r.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map((r) => r.id)));
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClose = () => {
    setSelectedMetric(null);
    setSearch("");
    setAreaFilter("all");
    setStatusFilter("all");
    setPage(1);
    setSelectedIds(new Set());
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && handleClose()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[600px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <SheetTitle className="font-semibold text-lg leading-tight">
                {selectedMetric?.name}
              </SheetTitle>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-extrabold text-foreground">
                  {typeof selectedMetric?.value === "string"
                    ? selectedMetric.value
                    : `${selectedMetric?.value}${selectedMetric?.unit === "%" ? "%" : ""}`}
                </span>
                {selectedMetric && <SlaStatusBadge status={selectedMetric.status} />}
              </div>
            </div>
          </div>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-auto p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder={t("sla.searchRecords", "Search records...")}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="ps-9"
              />
            </div>
            <Select value={areaFilter} onValueChange={(v) => { setAreaFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <Filter className="size-3.5" />
                <SelectValue placeholder={t("common.area", "Area")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all", "All")}</SelectItem>
                {DUMMY_AREAS.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t("common.status", "Status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all", "All")}</SelectItem>
                {DUMMY_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={() => { setSearch(""); setAreaFilter("all"); setStatusFilter("all"); setPage(1); }}>
              <X className="size-4" />
            </Button>
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
              <span className="text-xs font-medium text-foreground">
                {selectedIds.size} {t("sla.selected", "selected")}
              </span>
              <Button variant="outline" size="sm" onClick={() => { toast.success(`Reassigned ${selectedIds.size} items`); setSelectedIds(new Set()); }}>
                {t("sla.reassign", "Reassign")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { toast.success(`Notified ${selectedIds.size} items`); setSelectedIds(new Set()); }}>
                {t("sla.notify", "Notify")}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => { toast.success(`Escalated ${selectedIds.size} items`); setSelectedIds(new Set()); }}>
                {t("sla.escalate", "Escalate")}
              </Button>
            </div>
          )}

          <DrilldownTable
            records={paged}
            selectedIds={selectedIds}
            onSelectAll={toggleSelectAll}
            onToggleRow={toggleRow}
            allSelected={allSelected}
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {records.length} {t("sla.totalRecords", "total records")}
            </p>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" className="size-7" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="size-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button variant="outline" size="icon" className="size-7" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </SheetBody>

        <div className="border-t border-border px-5 py-3 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => toast.info("Export coming soon")}>
            <Download className="size-3.5" />
            {t("common.export", "Export")}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            {t("common.close", "Close")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
