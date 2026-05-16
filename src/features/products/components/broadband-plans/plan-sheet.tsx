"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetBody } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCreateBroadbandPlan, useUpdateBroadbandPlan,
  useAdminBroadbandPlan,
  useAddBranchToBroadbandPlan, useRemoveBranchFromBroadbandPlan,
} from "../../api/products-queries";
import { useCreateBroadbandPlanSchema } from "@/features/rule-schema";
import { SCHEMA_TYPE_OPTIONS } from "@/features/administration/schema/types/schema-type-constants";
import type { BroadbandPlan, CreateBroadbandPlanPayload, ProductEnvelope } from "../../types/products";
import { PlanForm } from "./plan-form";
import { BranchAvailability } from "../branch-availability";
import { PlanSchemaTab, type PendingSchema } from "./plan-schema-tab";

interface PlanSheetProps {
  open: boolean;
  mode: "new" | "edit" | "details";
  selected: BroadbandPlan | null;
  onClose: () => void;
}

export function PlanSheet({ open, mode, selected, onClose }: PlanSheetProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [pendingBranchIds, setPendingBranchIds] = useState<string[]>([]);
  const [pendingSchemas, setPendingSchemas] = useState<PendingSchema[]>([]);
  const [customerType, setCustomerType] = useState(selected?.customer_type ?? "broadband");
  const [isFormDirty, setIsFormDirty] = useState(false);

  const { data: detail } = useAdminBroadbandPlan(
    open && mode !== "new" && selected ? selected.id : null
  );
  const planData = mode === "new" ? null : (detail ?? selected);

  const create = useCreateBroadbandPlan();
  const update = useUpdateBroadbandPlan();
  const addBranch = useAddBranchToBroadbandPlan();
  const removeBranch = useRemoveBranchFromBroadbandPlan();
  const assignSchema = useCreateBroadbandPlanSchema();
  const isPending = create.isPending || update.isPending;
  const branchPending = addBranch.isPending || removeBranch.isPending;

  const handleClose = () => {
    setActiveTab("details");
    setPendingBranchIds([]);
    setPendingSchemas([]);
    setCustomerType("broadband");
    onClose();
  };

  const handleSubmit = (payload: CreateBroadbandPlanPayload) => {
    if (mode === "new") {
      create.mutate(payload, {
        onSuccess: (res: ProductEnvelope<BroadbandPlan>) => {
          const planId = res.data?.id;
          if (!planId) { handleClose(); return; }

          handleClose();

          if (pendingBranchIds.length > 0) {
            addBranch.mutate({ planId, branchIds: pendingBranchIds });
          }
          pendingSchemas.forEach((s) => {
            assignSchema.mutate({
              broadband_plan_id: planId,
              schema_id: s.schemaId,
              schema_type: s.schemaType,
            });
          });
        },
      });
    } else if (mode === "edit" && planData) {
      update.mutate({ id: planData.id, payload });
    }
  };

  const handleSave = () => {
    if (mode === "new") {
      if (pendingBranchIds.length === 0) {
        setActiveTab("branches");
        toast.error("At least 1 branch must be assigned before creating a plan.");
        return;
      }
      if (pendingSchemas.length < SCHEMA_TYPE_OPTIONS.length) {
        setActiveTab("schemas");
        toast.error(`All ${SCHEMA_TYPE_OPTIONS.length} schema types must be assigned before creating a plan.`);
        return;
      }
    }
    const fn = (window as unknown as Record<string, unknown>).__productFormSubmit;
    if (typeof fn === "function") {
      (fn as () => void)();
    } else {
      setActiveTab("details");
    }
  };

  const title = mode === "new" ? "Add Broadband Plan" : mode === "edit" ? "Edit Broadband Plan" : "Broadband Plan Detail";

  const branchBadgeCount = mode === "new"
    ? pendingBranchIds.length
    : (planData?.branches?.length ?? 0);

  const schemaBadgeCount = mode === "new" ? pendingSchemas.length : 0;
  const allSchemasAssigned = pendingSchemas.length >= SCHEMA_TYPE_OPTIONS.length;


  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent
        aria-describedby={undefined}
        className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[520px] lg:w-[620px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl"
      >
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">{title}</SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="w-full justify-start rounded-none border-b px-5 h-10 bg-transparent gap-1 shrink-0">
              <TabsTrigger value="details" className="rounded-sm text-xs">Details</TabsTrigger>
              <TabsTrigger value="branches" className="rounded-sm text-xs">
                Branch Availability
                {branchBadgeCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold px-1.5 min-w-[18px]">
                    {branchBadgeCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="schemas" className="rounded-sm text-xs">
                Schemas
                {mode === "new" && (
                  <span className={`ml-1.5 inline-flex items-center justify-center rounded-full text-[10px] font-semibold px-1.5 min-w-[18px] ${allSchemasAssigned ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive"}`}>
                    {schemaBadgeCount}/{SCHEMA_TYPE_OPTIONS.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Keep PlanForm always mounted — unmounting resets react-hook-form state */}
            <div className={`flex-1 overflow-hidden ${activeTab !== "details" ? "hidden" : ""}`}>
              <PlanForm selected={planData} mode={mode} onSubmit={handleSubmit} onCustomerTypeChange={setCustomerType} onDirtyChange={setIsFormDirty} />
            </div>

            <TabsContent value="branches" className="flex-1 overflow-hidden mt-0">
              {mode === "new" ? (
                <BranchAvailability
                  assignedBranchIds={pendingBranchIds}
                  onAdd={(branchId) => setPendingBranchIds((prev) => [...prev, branchId])}
                  onRemove={(branchId) => setPendingBranchIds((prev) => prev.filter((id) => id !== branchId))}
                  isPending={false}
                />
              ) : planData ? (
                <BranchAvailability
                  assignedBranchIds={(planData.branches ?? []).map((b) => b.id)}
                  onAdd={(branchId) => addBranch.mutate({ planId: planData.id, branchIds: [branchId] })}
                  onRemove={(branchId) => {
                    if ((planData.branches ?? []).length <= 1) {
                      toast.error("At least 1 branch must remain assigned to this plan.");
                      return;
                    }
                    removeBranch.mutate({ planId: planData.id, branchId });
                  }}
                  isPending={branchPending}
                  readOnly={mode === "details"}
                />
              ) : null}
            </TabsContent>

            <TabsContent value="schemas" className="flex-1 overflow-hidden mt-0">
              {mode === "new" ? (
                <PlanSchemaTab
                  planId={null}
                  customerType={customerType}
                  pending={pendingSchemas}
                  onAddPending={(s) => setPendingSchemas((prev) => [...prev, s])}
                  onRemovePending={(schemaId) =>
                    setPendingSchemas((prev) => prev.filter((s) => s.schemaId !== schemaId))
                  }
                />
              ) : planData ? (
                <PlanSchemaTab
                  planId={planData.id}
                  customerType={planData.customer_type}
                  readOnly={mode === "details"}
                />
              ) : null}
            </TabsContent>
          </Tabs>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <>
            <Button variant="ghost" onClick={handleClose}>Close</Button>
            <div className="flex-1" />
            {(mode === "new" || activeTab === "details") && (
              <>
                {mode === "new" && (
                  <Button variant="outline" onClick={handleClose} className="mr-3" disabled={isPending}>Cancel</Button>
                )}
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={mode === "details" || isPending || (mode === "edit" && !isFormDirty)}
                  className="font-semibold"
                >
                  {isPending ? "Saving..." : mode === "new" ? "Create Plan" : "Save Changes"}
                </Button>
              </>
            )}
          </>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
