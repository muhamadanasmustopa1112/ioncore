"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiArrowRightUpLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { useRerouteLead, useSalesAdminUsers } from "../api/leads-queries";
import type { LeadDto } from "../types/leads-api";

interface Props {
  lead: LeadDto | null;
  open: boolean;
  onClose: () => void;
}

export function RerouteLeadSheet({ lead, open, onClose }: Props) {
  const { t } = useTranslation();
  const [branchId, setBranchId] = useState("");
  const [assignedSalesId, setAssignedSalesId] = useState("");
  const [notes, setNotes] = useState("");
  const [notesError, setNotesError] = useState("");
  const [assignedSalesError, setAssignedSalesError] = useState("");

  const { data: branches = [], isLoading: branchesLoading } = useBranchList({
    branch_type: "office",
    per_page: 200,
  });
  const { users: salesAdminUsers, isLoading: salesAdminsLoading } = useSalesAdminUsers(
    branchId || undefined,
  );

  const reroute = useRerouteLead(lead?.id ?? "");

  const activeBranches = useMemo(
    () =>
      branches.filter(
        (b) =>
          b.active &&
          (b.level === "area" || b.level === "sub_area") &&
          b.branchType === "office",
      ),
    [branches],
  );

  useEffect(() => {
    if (!open) return;

    const currentBranchId = lead?.branch_id ?? "";
    const canKeepCurrentBranch = activeBranches.some((b) => b.id === currentBranchId);

    setBranchId(canKeepCurrentBranch ? currentBranchId : "");
    setAssignedSalesId(canKeepCurrentBranch ? (lead?.assigned_sales_id ?? "") : "");
    setNotes("");
    setNotesError("");
    setAssignedSalesError("");
  }, [open, lead, activeBranches]);

  const handleSubmit = () => {
    if (!lead || !branchId) return;

    let hasError = false;

    if (!assignedSalesId) {
      setAssignedSalesError(t("leads.rerouteAssignedSalesRequired", "Assigned sales is required for reroute."));
      hasError = true;
    } else {
      setAssignedSalesError("");
    }

    const trimmedNotes = notes.trim();
    if (!trimmedNotes) {
      setNotesError(t("leads.rerouteNotesRequired", "Notes are required for reroute."));
      hasError = true;
    } else {
      setNotesError("");
    }

    if (hasError) return;

    reroute.mutate(
      {
        branch_id: branchId,
        assigned_sales_id: assignedSalesId,
        notes: trimmedNotes,
      },
      { onSuccess: onClose }
    );
  };

  const canSubmit = !!branchId && !!assignedSalesId && !!notes.trim() && !reroute.isPending;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[480px] lg:w-[520px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl flex items-center gap-2">
            <RiArrowRightUpLine className="size-5 text-amber-500" />
            Reroute Lead
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full px-6 py-6">
            <div className="space-y-6">
              {lead && (
                <div className="rounded-md border border-border/50 bg-muted/30 px-4 py-3 space-y-1">
                  <p className="text-sm font-semibold">{lead.lead_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.lead_type} · {lead.customer_sub_type} · status will reset to <span className="font-medium text-foreground">new</span>
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  New Branch <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={branchId}
                  onValueChange={(v) => {
                    setBranchId(v);
                    setAssignedSalesId("");
                    setAssignedSalesError("");
                  }}
                  disabled={branchesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={branchesLoading ? "Loading branches…" : "Select branch"} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeBranches.map((b) => {
                      const parentArea = b.level === "sub_area" ? branches.find((item) => item.id === b.parentId || item.id === b._areaId) : null;
                      const parentName = parentArea?.name || b.parentName || b._areaName;
                      return (
                        <SelectItem key={b.id} value={b.id}>
                          <span>{b.name}</span>
                          {parentName && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({parentName})
                            </span>
                          )}
                          <span className="ml-2 text-xs text-muted-foreground capitalize">
                            {b.level.replace("_", " ")}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("leads.assignedSales", "Assigned Sales")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={assignedSalesId}
                  onValueChange={(v) => {
                    setAssignedSalesId(v);
                    if (assignedSalesError) setAssignedSalesError("");
                  }}
                  disabled={!branchId || salesAdminsLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !branchId
                          ? t("leads.selectBranchFirst", "Select branch first")
                          : salesAdminsLoading
                            ? t("common.loading")
                            : t("leads.selectAssignedSales", "Select sales admin")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {salesAdminUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {assignedSalesError && (
                  <p className="text-xs text-destructive">{assignedSalesError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("leads.notes", "Notes")} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    if (notesError) setNotesError("");
                  }}
                  placeholder={t("leads.rerouteNotesPlaceholder", "Reason for rerouting this lead...")}
                  className="min-h-[96px] resize-none"
                />
                {notesError && (
                  <p className="text-xs text-destructive">{notesError}</p>
                )}
              </div>
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose} className="mr-3">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="font-semibold"
          >
            {reroute.isPending ? "Rerouting…" : "Confirm Reroute"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
