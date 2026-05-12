"use client";

import { useState, useEffect } from "react";
import { UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWorkOrderStore } from "../store/work-order";
import {
  useCreateWorkOrder,
  useUpdateWorkOrder,
  useAssignTechnician,
  useUpdateWorkOrderStatus,
} from "../api/work-order-queries";
import type { WoType, WoStatus, WoPriority } from "../types/work-order";
import type { CreateWorkOrderPayload, UpdateWorkOrderPayload } from "../types/work-order-api";
import {
  WO_TYPE_LABELS,
  WO_STATUS_LABELS,
  WO_STATUS_VARIANTS,
  WO_PRIORITY_LABELS,
  WO_PRIORITY_VARIANTS,
} from "../types/work-order";
import { ChecklistPanel } from "./checklist-panel";

export function DetailSheet() {
  const sheetOpen = useWorkOrderStore((s) => s.sheetOpen);
  const sheetMode = useWorkOrderStore((s) => s.sheetMode);
  const selectedWorkOrder = useWorkOrderStore((s) => s.selectedWorkOrder);
  const closeSheet = useWorkOrderStore((s) => s.closeSheet);

  const isDetail = sheetMode === "detail";
  const isCreate = sheetMode === "create";
  const isEdit = sheetMode === "edit";

  const wo = selectedWorkOrder;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<WoType | "">("");
  const [priority, setPriority] = useState<WoPriority | "">("");
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [branchId, setBranchId] = useState("");
  const [notes, setNotes] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const [technicianId, setTechnicianId] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [assignMode, setAssignMode] = useState(false);
  const [isCrossArea, setIsCrossArea] = useState(false);

  const [newStatus, setNewStatus] = useState<WoStatus | "">("");
  const [statusNotes, setStatusNotes] = useState("");
  const [statusMode, setStatusMode] = useState(false);

  useEffect(() => {
    setTitle(wo?.title ?? "");
    setDescription(wo?.description ?? "");
    setType(wo?.type ?? "");
    setPriority(wo?.priority ?? "");
    setCustomerId(wo?.customerId ?? "");
    setCustomerName(wo?.customerName ?? "");
    setServiceAddress(wo?.serviceAddress ?? "");
    setBranchId(wo?.branchId ?? "");
    setNotes(wo?.notes ?? "");
    setScheduledAt(wo?.scheduledAt?.slice(0, 16) ?? "");

    setTechnicianId(wo?.technicianId ?? "");
    setTechnicianName(wo?.technicianName ?? "");
    setIsCrossArea(wo?.cross_area ?? false);

    setNewStatus(wo?.status ?? "");
    setStatusNotes("");
    setAssignMode(false);
    setStatusMode(false);
  }, [wo, sheetOpen, sheetMode]);

  const createWO = useCreateWorkOrder();
  const updateWO = useUpdateWorkOrder();
  const assignTech = useAssignTechnician();
  const updateStatus = useUpdateWorkOrderStatus();

  const isValid =
    title.trim() &&
    type &&
    priority &&
    customerId.trim() &&
    serviceAddress.trim() &&
    branchId.trim();

  const handleSave = () => {
    if (!type || !priority) return;
    if (isCreate) {
      const payload: CreateWorkOrderPayload = {
        title,
        description,
        type,
        priority,
        customer_id: customerId,
        customer_name: customerName,
        service_address: serviceAddress,
        branch_id: branchId,
        notes,
        scheduled_at: scheduledAt || null,
      };
      createWO.mutate(payload, { onSuccess: closeSheet });
    } else if (isEdit && wo) {
      const payload: UpdateWorkOrderPayload = {
        title,
        description,
        priority,
        notes,
        scheduled_at: scheduledAt || null,
      };
      updateWO.mutate({ id: wo.id, payload }, { onSuccess: closeSheet });
    }
  };

  const handleAssign = () => {
    if (!wo || !technicianId.trim() || !technicianName.trim()) return;
    assignTech.mutate(
      {
        id: wo.id,
        payload: {
          technician_id: technicianId,
          technician_name: technicianName,
        },
      },
      {
        onSuccess: () => {
          wo.cross_area = isCrossArea;
          setAssignMode(false);
        },
      }
    );
  };

  const handleStatusUpdate = () => {
    if (!wo || !newStatus) return;
    updateStatus.mutate(
      { id: wo.id, payload: { status: newStatus, notes: statusNotes } },
      { onSuccess: () => setStatusMode(false) }
    );
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(o) => !o && closeSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[600px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="font-medium text-xl">
                {isCreate
                  ? "New Work Order"
                  : isEdit
                    ? "Edit Work Order"
                    : wo?.title}
              </SheetTitle>
              {isDetail && wo && (
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {wo.woNumber}
                </p>
              )}
            </div>
            {isDetail && wo && (
              <Badge
                variant={WO_STATUS_VARIANTS[wo.status]}
                appearance="light"
                className="shrink-0 text-xs mt-1"
              >
                {WO_STATUS_LABELS[wo.status]}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-auto p-5 space-y-5">
          {/* Detail view */}
          {isDetail && wo && (
            <>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-medium mt-0.5">
                    {WO_TYPE_LABELS[wo.type]}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge
                    variant={WO_PRIORITY_VARIANTS[wo.priority]}
                    appearance="light"
                    className="text-xs mt-0.5"
                  >
                    {WO_PRIORITY_LABELS[wo.priority]}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium mt-0.5">{wo.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Branch ID</p>
                  <p className="font-mono text-xs mt-0.5">{wo.branchId}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">
                    Service Address
                  </p>
                  <p className="font-medium mt-0.5">{wo.serviceAddress}</p>
                </div>
                {wo.scheduledAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Scheduled</p>
                    <p className="font-medium mt-0.5">
                      {new Date(wo.scheduledAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
                {wo.startedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Started</p>
                    <p className="font-medium mt-0.5">
                      {new Date(wo.startedAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
                {wo.completedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="font-medium mt-0.5">
                      {new Date(wo.completedAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
              </div>

              {wo.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm">{wo.description}</p>
                </div>
              )}

              {wo.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{wo.notes}</p>
                </div>
              )}

              {/* Technician */}
              <div className="rounded-md border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Technician
                  </p>
                  {wo.status !== "DONE" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => setAssignMode(!assignMode)}
                    >
                      <UserCheck className="size-3.5 mr-1" />
                      {wo.technicianId ? "Reassign" : "Assign"}
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {wo.technicianName ? (
                    <p className="text-sm font-medium">{wo.technicianName}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No technician assigned
                    </p>
                  )}
                  {wo.cross_area && (
                    <Badge
                      variant="warning"
                      className="text-[9px] uppercase font-black px-1.5 py-0.5 tracking-widest bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse"
                    >
                      Cross Area
                    </Badge>
                  )}
                </div>
                {assignMode && (
                  <div className="space-y-2 pt-1">
                    <Input
                      className="h-8 text-xs"
                      placeholder="Technician ID..."
                      value={technicianId}
                      onChange={(e) => setTechnicianId(e.target.value)}
                    />
                    <Input
                      className="h-8 text-xs"
                      placeholder="Technician name..."
                      value={technicianName}
                      onChange={(e) => setTechnicianName(e.target.value)}
                    />
                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        id="isCrossArea"
                        checked={isCrossArea}
                        onChange={(e) => setIsCrossArea(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary size-3.5"
                      />
                      <label
                        htmlFor="isCrossArea"
                        className="text-xs text-muted-foreground font-medium select-none cursor-pointer"
                      >
                        Cross-Area Assignment
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => setAssignMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        className="h-7 text-xs"
                        onClick={handleAssign}
                        disabled={
                          !technicianId.trim() ||
                          !technicianName.trim() ||
                          assignTech.isPending
                        }
                      >
                        {assignTech.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Status update */}
              {wo.status !== "DONE" && (
                <div className="rounded-md border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Update Status
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => setStatusMode(!statusMode)}
                    >
                      Change
                    </Button>
                  </div>
                  {statusMode && (
                    <div className="space-y-2 pt-1">
                      <Select
                        value={newStatus || "none"}
                        onValueChange={(v) =>
                          setNewStatus(v === "none" ? "" : (v as WoStatus))
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="New status..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(["CREATED", "IN_PROGRESS", "DONE"] as WoStatus[])
                            .filter((s) => s !== wo.status)
                            .map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="text-xs"
                              >
                                {WO_STATUS_LABELS[s]}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        className="text-xs min-h-[48px]"
                        placeholder="Status update notes..."
                        value={statusNotes}
                        onChange={(e) => setStatusNotes(e.target.value)}
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => setStatusMode(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          className="h-7 text-xs"
                          onClick={handleStatusUpdate}
                          disabled={!newStatus || updateStatus.isPending}
                        >
                          {updateStatus.isPending ? "Updating..." : "Update"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Checklists */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Checklists
                </p>
                <ChecklistPanel workOrderId={wo.id} />
              </div>
            </>
          )}

          {/* Create / Edit form */}
          {(isCreate || isEdit) && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Title *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Work order title..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Type *</Label>
                  <Select
                    value={type || "none"}
                    onValueChange={(v) =>
                      setType(v === "none" ? "" : (v as WoType))
                    }
                    disabled={isEdit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        Object.entries(WO_TYPE_LABELS) as [WoType, string][]
                      ).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Priority *</Label>
                  <Select
                    value={priority || "none"}
                    onValueChange={(v) =>
                      setPriority(v === "none" ? "" : (v as WoPriority))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        Object.entries(WO_PRIORITY_LABELS) as [
                          WoPriority,
                          string,
                        ][]
                      ).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Customer ID *</Label>
                  <Input
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="UUID..."
                    disabled={isEdit}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Customer Name</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Display name..."
                    disabled={isEdit}
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Service Address *</Label>
                  <Input
                    value={serviceAddress}
                    onChange={(e) => setServiceAddress(e.target.value)}
                    placeholder="Full address..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Branch ID *</Label>
                  <Input
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    placeholder="UUID..."
                    disabled={isEdit}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Scheduled At</Label>
                  <Input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Optional description..."
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
            </>
          )}
        </SheetBody>

        <div className="border-t p-5 pb-4 flex gap-2.5 justify-end">
          <Button variant="ghost" onClick={closeSheet}>
            {isDetail ? "Close" : "Cancel"}
          </Button>
          {(isCreate || isEdit) && (
            <Button
              variant="primary"
              className="font-semibold"
              onClick={handleSave}
              disabled={
                !isValid || createWO.isPending || updateWO.isPending
              }
            >
              {createWO.isPending || updateWO.isPending
                ? "Saving..."
                : isCreate
                  ? "Create Work Order"
                  : "Save Changes"}
            </Button>
          )}
          {isDetail && wo && (
            <Button
              variant="outline"
              onClick={() => useWorkOrderStore.getState().openSheet("edit", wo)}
            >
              Edit
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
