"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetBody } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCreateBroadbandPlan, useUpdateBroadbandPlan,
  useAddBranchToBroadbandPlan, useRemoveBranchFromBroadbandPlan,
} from "../../api/products-queries";
import type { BroadbandPlan, CreateBroadbandPlanPayload } from "../../types/products";
import { PlanForm } from "./plan-form";
import { BranchAvailability } from "../branch-availability";

interface PlanSheetProps {
  open: boolean;
  mode: "new" | "edit" | "details";
  selected: BroadbandPlan | null;
  onClose: () => void;
}

export function PlanSheet({ open, mode, selected, onClose }: PlanSheetProps) {
  const create = useCreateBroadbandPlan();
  const update = useUpdateBroadbandPlan();
  const addBranch = useAddBranchToBroadbandPlan();
  const removeBranch = useRemoveBranchFromBroadbandPlan();
  const isPending = create.isPending || update.isPending;
  const branchPending = addBranch.isPending || removeBranch.isPending;

  const handleSubmit = (payload: CreateBroadbandPlanPayload) => {
    if (mode === "new") {
      create.mutate(payload, { onSuccess: onClose });
    } else if (mode === "edit" && selected) {
      update.mutate({ id: selected.id, payload }, { onSuccess: onClose });
    }
  };

  const handleSave = () => {
    const fn = (window as unknown as Record<string, unknown>).__productFormSubmit;
    if (typeof fn === "function") (fn as () => void)();
  };

  const title = mode === "new" ? "Add Broadband Plan" : mode === "edit" ? "Edit Broadband Plan" : "Broadband Plan Detail";
  const showBranches = mode !== "new" && selected;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        aria-describedby={undefined}
        className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[520px] lg:w-[620px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl"
      >
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">{title}</SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          {showBranches ? (
            <Tabs defaultValue="details" className="flex flex-col h-full">
              <TabsList className="w-full justify-start rounded-none border-b px-5 h-10 bg-transparent gap-1 shrink-0">
                <TabsTrigger value="details" className="rounded-sm text-xs">Details</TabsTrigger>
                <TabsTrigger value="branches" className="rounded-sm text-xs">
                  Branch Availability
                  {selected.branches && selected.branches.length > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold px-1.5 min-w-[18px]">
                      {selected.branches.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="flex-1 overflow-hidden mt-0">
                <PlanForm selected={selected} mode={mode} onSubmit={handleSubmit} />
              </TabsContent>
              <TabsContent value="branches" className="flex-1 overflow-hidden mt-0">
                <BranchAvailability
                  assignedBranchIds={selected.branches ?? []}
                  onAdd={(branchId) => addBranch.mutate({ planId: selected.id, branchId })}
                  onRemove={(branchId) => removeBranch.mutate({ planId: selected.id, branchId })}
                  isPending={branchPending}
                  readOnly={mode === "details"}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <PlanForm selected={selected} mode={mode} onSubmit={handleSubmit} />
          )}
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose} className="mr-3" disabled={isPending}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={mode === "details" || isPending} className="font-semibold">
            {isPending ? "Saving..." : mode === "new" ? "Create Plan" : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
