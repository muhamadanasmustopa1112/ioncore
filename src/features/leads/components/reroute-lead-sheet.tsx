"use client";

import { useEffect, useState } from "react";
import { RiArrowRightUpLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useRerouteLead, useSalesList } from "../api/leads-queries";
import type { LeadDto } from "../types/leads-api";

interface Props {
  lead: LeadDto | null;
  open: boolean;
  onClose: () => void;
}

export function RerouteLeadSheet({ lead, open, onClose }: Props) {
  const [branchId, setBranchId] = useState("");
  const [salesId, setSalesId] = useState("");

  const { data: branches = [], isLoading: branchesLoading } = useBranchList();
  const { data: salesReps = [], isLoading: salesLoading } = useSalesList(
    branchId ? { branch_id: branchId } : {}
  );

  const reroute = useRerouteLead(lead?.id ?? "");

  useEffect(() => {
    if (open) {
      setBranchId(lead?.branch_id ?? "");
      setSalesId(lead?.assigned_sales_id ?? "");
    }
  }, [open, lead]);

  useEffect(() => {
    setSalesId("");
  }, [branchId]);

  const handleSubmit = () => {
    if (!lead || !branchId || !salesId) return;
    reroute.mutate(
      { branch_id: branchId, assigned_sales_id: salesId },
      { onSuccess: onClose }
    );
  };

  const activeBranches = branches.filter((b) => b.active && (b.level === "area" || b.level === "sub_area"));

  // Filter sales reps by type matching lead_type (SIT-C05)
  const compatibleReps = salesReps.filter((rep) => {
    if (!lead) return true;
    if (rep.type === "both") return true;
    return rep.type === lead.lead_type;
  });

  const canSubmit = !!branchId && !!salesId && !reroute.isPending;

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
                  onValueChange={setBranchId}
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
                  Assigned Sales Rep <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={salesId}
                  onValueChange={setSalesId}
                  disabled={!branchId || salesLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !branchId
                          ? "Select a branch first"
                          : salesLoading
                            ? "Loading sales reps…"
                            : salesReps.length === 0
                              ? "No reps in this branch"
                              : "Select sales rep"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {compatibleReps.map((rep) => (
                      <SelectItem key={rep.id} value={rep.id}>
                        <span>{rep.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground capitalize">
                          {rep.type}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {branchId && !salesLoading && compatibleReps.length === 0 && salesReps.length > 0 && (
                  <p className="text-xs text-amber-600">
                    No {lead?.lead_type} reps in this branch. Only reps with matching type are shown.
                  </p>
                )}
                {branchId && !salesLoading && salesReps.length === 0 && (
                  <p className="text-xs text-amber-600">
                    No sales reps assigned to this branch.
                  </p>
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
