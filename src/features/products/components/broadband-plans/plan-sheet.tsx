"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetBody } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateBroadbandPlan, useUpdateBroadbandPlan,
  useAdminBroadbandPlan,
  useAddBranchToBroadbandPlan, useRemoveBranchFromBroadbandPlan,
  useSubmitReviewBroadbandPlan, useApproveBroadbandPlan,
  useRejectBroadbandPlan, useSetBroadbandPlanVisibility,
} from "../../api/products-queries";
import { useCreateBroadbandPlanSchema, useDeleteBroadbandPlanSchema, useBroadbandPlanSchemas } from "@/features/rule-schema";
import { useCan } from "@/lib/permissions";
import type { EditSchemaChange } from "./plan-schema-tab";
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
  onSwitchToEdit?: (plan: BroadbandPlan) => void;
}

export function PlanSheet({ open, mode, selected, onClose, onSwitchToEdit }: PlanSheetProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [pendingBranchIds, setPendingBranchIds] = useState<string[]>([]);
  const [pendingSchemas, setPendingSchemas] = useState<PendingSchema[]>([]);
  const [customerType, setCustomerType] = useState(selected?.customer_type ?? "broadband");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [rejectDetailOpen, setRejectDetailOpen] = useState(false);
  const [actionConfirm, setActionConfirm] = useState<{ title: string; description: string; onConfirm: () => void } | null>(null);

  // edit-mode buffered branch changes
  const [editBranchAdds, setEditBranchAdds] = useState<string[]>([]);
  const [editBranchRemoves, setEditBranchRemoves] = useState<string[]>([]);

  // edit-mode buffered schema changes
  const [editSchemaChanges, setEditSchemaChanges] = useState<Record<string, EditSchemaChange>>({});

  const { data: detail, isLoading: isDetailLoading } = useAdminBroadbandPlan(
    open && mode !== "new" && selected ? selected.id : null
  );
  const planData = mode === "new" ? null : (detail ?? selected);

  const { data: schemasEnv } = useBroadbandPlanSchemas(
    open && mode !== "new" && planData ? { broadband_plan_id: planData.id, size: 100 } : undefined
  );
  const liveSchemas = schemasEnv?.data?.broadband_plan_schemas ?? [];

  const create = useCreateBroadbandPlan();
  const update = useUpdateBroadbandPlan();
  const addBranch = useAddBranchToBroadbandPlan();
  const removeBranch = useRemoveBranchFromBroadbandPlan();
  const assignSchema = useCreateBroadbandPlanSchema();
  const deleteSchema = useDeleteBroadbandPlanSchema();
  const canApprove = useCan("product.approve");
  const submitReview = useSubmitReviewBroadbandPlan();
  const approvePlan = useApproveBroadbandPlan();
  const rejectPlan = useRejectBroadbandPlan();
  const setVisibility = useSetBroadbandPlanVisibility();

  const anyPending =
    create.isPending || update.isPending ||
    addBranch.isPending || removeBranch.isPending ||
    assignSchema.isPending || deleteSchema.isPending;

  const isEditDirty =
    isFormDirty ||
    editBranchAdds.length > 0 ||
    editBranchRemoves.length > 0 ||
    Object.keys(editSchemaChanges).length > 0;

  const handleClose = () => {
    setActiveTab("details");
    setPendingBranchIds([]);
    setPendingSchemas([]);
    setCustomerType("broadband");
    setEditBranchAdds([]);
    setEditBranchRemoves([]);
    setEditSchemaChanges({});
    setRejectOpen(false);
    setRejectNotes("");
    setRejectDetailOpen(false);
    setActionConfirm(null);
    onClose();
  };

  const getEffectiveBranchCount = () =>
    [
      ...(planData?.branches ?? []).map((b) => b.id).filter((id) => !editBranchRemoves.includes(id)),
      ...editBranchAdds,
    ].length;

  const getUncoveredSchemaCount = () =>
    SCHEMA_TYPE_OPTIONS.filter((opt) => {
      const change = editSchemaChanges[opt.value];
      if (change?.action === "remove") return true;
      if (change?.action === "assign") return false;
      return !liveSchemas.find((r) => r.schema_type === opt.value);
    }).length;

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
      update.mutate({ id: planData.id, payload }, { onSuccess: () => handleClose() });
    }
  };

  const handleSave = async () => {
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
      const fn = (window as unknown as Record<string, unknown>).__productFormSubmit;
      if (typeof fn === "function") (fn as () => void)();
      else setActiveTab("details");
      return;
    }

    if (mode === "edit") {
      if (getEffectiveBranchCount() === 0) {
        setActiveTab("branches");
        toast.error("At least 1 branch must be assigned to this plan.");
        return;
      }
      if (getUncoveredSchemaCount() > 0) {
        setActiveTab("schemas");
        toast.error(`All ${SCHEMA_TYPE_OPTIONS.length} schema types must be assigned.`);
        return;
      }

      if (isFormDirty) {
        const fn = (window as unknown as Record<string, unknown>).__productFormSubmit;
        if (typeof fn === "function") (fn as () => void)();
        else setActiveTab("details");
      }

      const branchDirty = editBranchAdds.length > 0 || editBranchRemoves.length > 0;
      const schemaDirty = Object.keys(editSchemaChanges).length > 0;

      if (!branchDirty && !schemaDirty) return;

      try {
        await Promise.all([
          branchDirty && editBranchAdds.length > 0
            ? addBranch.mutateAsync({ planId: planData!.id, branchIds: editBranchAdds })
            : Promise.resolve(),
          ...(branchDirty
            ? editBranchRemoves.map((branchId) =>
                removeBranch.mutateAsync({ planId: planData!.id, branchId })
              )
            : []),
          ...(schemaDirty
            ? Object.entries(editSchemaChanges).map(async ([schemaType, change]) => {
                if (change.action === "remove") {
                  await deleteSchema.mutateAsync(change.removeRecordId);
                } else {
                  if (change.removeRecordId) await deleteSchema.mutateAsync(change.removeRecordId);
                  await assignSchema.mutateAsync({
                    broadband_plan_id: planData!.id,
                    schema_id: change.schemaId,
                    schema_type: schemaType,
                  });
                }
              })
            : []),
        ]);

        if (branchDirty) { setEditBranchAdds([]); setEditBranchRemoves([]); }
        if (schemaDirty) setEditSchemaChanges({});
        if (branchDirty || schemaDirty) toast.success("Changes saved.");
      } catch {
        toast.error("Failed to save changes.");
      }
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

        <SheetBody className="flex-1 p-0 overflow-hidden relative">
          {isDetailLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
              <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          )}
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
                  assignedBranchIds={[
                    ...(planData.branches ?? [])
                      .map((b) => b.id)
                      .filter((id) => !editBranchRemoves.includes(id)),
                    ...editBranchAdds,
                  ]}
                  onAdd={(branchId) => {
                    setEditBranchAdds((prev) => prev.includes(branchId) ? prev : [...prev, branchId]);
                    setEditBranchRemoves((prev) => prev.filter((id) => id !== branchId));
                  }}
                  onRemove={(branchId) => {
                    if (editBranchAdds.includes(branchId)) {
                      setEditBranchAdds((prev) => prev.filter((id) => id !== branchId));
                    } else {
                      setEditBranchRemoves((prev) => prev.includes(branchId) ? prev : [...prev, branchId]);
                    }
                  }}
                  isPending={false}
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
                  editChanges={mode === "edit" ? editSchemaChanges : undefined}
                  onEditChange={
                    mode === "edit"
                      ? (schemaType, change) =>
                          setEditSchemaChanges((prev) => ({ ...prev, [schemaType]: change }))
                      : undefined
                  }
                  onEditUndo={
                    mode === "edit"
                      ? (schemaType) =>
                          setEditSchemaChanges((prev) => {
                            const next = { ...prev };
                            delete next[schemaType];
                            return next;
                          })
                      : undefined
                  }
                />
              ) : null}
            </TabsContent>
          </Tabs>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <>
            <Button variant="ghost" onClick={handleClose}>
              {mode === "new" ? "Cancel" : "Close"}
            </Button>
            <div className="flex-1" />
            {mode !== "details" && (
              <>
                {mode === "edit" && planData?.status === "inactive" && (
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={anyPending || !isEditDirty}
                  >
                    Submit Draft
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={anyPending || (mode === "edit" && !isEditDirty)}
                  className="font-semibold"
                >
                  {anyPending ? "Saving..." : mode === "new" ? "Create Plan" : "Save Changes"}
                </Button>
              </>
            )}
            {mode === "details" && planData && (() => {
              const s = planData.status;
              const canSubmit = (planData.branches?.length ?? 0) > 0 && liveSchemas.length >= SCHEMA_TYPE_OPTIONS.length;
              const ac = (title: string, description: string, onConfirm: () => void) =>
                setActionConfirm({ title, description, onConfirm });
              if (s === "draft") return (
                <Button variant="primary" onClick={() => ac("Submit for Review?", "Plan will be submitted to reviewers.", () => submitReview.mutate(planData.id))} disabled={!canSubmit || submitReview.isPending} className="font-semibold">
                  {submitReview.isPending ? "Submitting..." : "Submit for Review"}
                </Button>
              );
              if (s === "rejected") return (
                <>
                  <Button variant="outline" onClick={() => setRejectDetailOpen(true)}>Reject Detail</Button>
                  <Button
                    variant="outline"
                    disabled={update.isPending}
                    onClick={() => ac("Back to Draft?", "Plan will be saved as draft.", () => update.mutate({ id: planData.id, payload: { name: planData.name, speed_download_mbps: planData.speed_download_mbps, speed_upload_mbps: planData.speed_upload_mbps, price: planData.price, one_time_charge: planData.one_time_charge, customer_type: planData.customer_type, is_active: planData.is_active } }))}
                  >
                    {update.isPending ? "Saving..." : "Back to Draft"}
                  </Button>
                  <Button variant="primary" onClick={() => ac("Submit for Review?", "Plan will be submitted to reviewers.", () => submitReview.mutate(planData.id))} disabled={submitReview.isPending} className="font-semibold">
                    {submitReview.isPending ? "Submitting..." : "Submit for Review"}
                  </Button>
                </>
              );
              if (s === "in_review") return canApprove ? (
                <>
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => setRejectOpen(true)} disabled={rejectPlan.isPending}>Reject</Button>
                  <Button variant="primary" onClick={() => ac("Approve Plan?", "Plan status will change to Approved.", () => approvePlan.mutate(planData.id))} disabled={approvePlan.isPending} className="font-semibold">
                    {approvePlan.isPending ? "Approving..." : "Approve"}
                  </Button>
                </>
              ) : null;
              if (s === "approved") return (
                <Button variant="primary" onClick={() => ac("Publish Plan?", "Plan will be visible to customers.", () => setVisibility.mutate({ id: planData.id, status: "published" }))} disabled={setVisibility.isPending} className="font-semibold">
                  {setVisibility.isPending ? "Publishing..." : "Publish"}
                </Button>
              );
              if (s === "published") return (
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => ac("Deactivate Plan?", "Plan will be hidden from customers.", () => setVisibility.mutate({ id: planData.id, status: "inactive" }))} disabled={setVisibility.isPending}>
                  {setVisibility.isPending ? "Deactivating..." : "Deactivate"}
                </Button>
              );
              if (s === "inactive") return (
                <Button
                  variant="primary"
                  className="font-semibold"
                  disabled={update.isPending}
                  onClick={() => ac("Submit Draft?", "Plan will be saved as draft.", () => update.mutate({ id: planData.id, payload: { name: planData.name, speed_download_mbps: planData.speed_download_mbps, speed_upload_mbps: planData.speed_upload_mbps, price: planData.price, one_time_charge: planData.one_time_charge, customer_type: planData.customer_type, is_active: planData.is_active } }))}
                >
                  {update.isPending ? "Saving..." : "Submit Draft"}
                </Button>
              );
              return null;
            })()}
          </>
        </SheetFooter>
      </SheetContent>

      <AlertDialog open={!!actionConfirm} onOpenChange={(o) => !o && setActionConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionConfirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>{actionConfirm?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { actionConfirm?.onConfirm(); setActionConfirm(null); }}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectDetailOpen} onOpenChange={setRejectDetailOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejection Detail</AlertDialogTitle>
            <AlertDialogDescription>
              {planData?.rejection_notes || "No rejection notes provided."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectOpen} onOpenChange={(o) => { setRejectOpen(o); if (!o) setRejectNotes(""); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Plan?</AlertDialogTitle>
            <AlertDialogDescription>Optionally provide a reason for rejection.</AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea placeholder="Reason (optional)" value={rejectNotes} onChange={(e) => setRejectNotes(e.target.value)} rows={3} className="mx-6 w-auto" />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (planData) rejectPlan.mutate({ id: planData.id, notes: rejectNotes || undefined });
                setRejectOpen(false);
                setRejectNotes("");
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
