"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  Plus,
  Search,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import {
  useWorkOrderList,
  useWorkOrderDetail,
  useCreateWorkOrder,
  useUpdateWorkOrder,
  useAssignTechnician,
  useUpdateWorkOrderStatus,
  useUpdateChecklistItem,
} from "../api/work-order-queries";
import { useWorkOrderStore } from "../store/work-order";
import type { WorkOrder, WoType, WoStatus, WoPriority } from "../types/work-order";
import type { CreateWorkOrderPayload, UpdateWorkOrderPayload } from "../types/work-order-api";
import {
  WO_TYPE_LABELS,
  WO_STATUS_LABELS,
  WO_STATUS_VARIANTS,
  WO_PRIORITY_LABELS,
  WO_PRIORITY_VARIANTS,
} from "../types/work-order";

// ─── Checklist Panel ──────────────────────────────────────────────────────────

function ChecklistPanel({ workOrderId }: { workOrderId: string }) {
  const { data: wo, isLoading } = useWorkOrderDetail(workOrderId);
  const updateItem = useUpdateChecklistItem();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (isLoading) return <div className="flex justify-center py-6"><Loader2 className="size-4 animate-spin text-muted-foreground" /></div>;
  if (!wo?.checklists.length) return <p className="text-xs text-muted-foreground text-center py-4">No checklists attached.</p>;

  return (
    <div className="space-y-3">
      {wo.checklists.map((cl) => {
        const total = cl.items.length;
        const checked = cl.items.filter((i) => i.isChecked).length;
        const isOpen = expanded[cl.id] ?? true;

        return (
          <div key={cl.id} className="rounded-md border overflow-hidden">
            <button
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
              onClick={() => setExpanded((p) => ({ ...p, [cl.id]: !isOpen }))}
            >
              {isOpen ? <ChevronDown className="size-3.5 shrink-0" /> : <ChevronRight className="size-3.5 shrink-0" />}
              <span className="text-sm font-medium flex-1">{cl.name}</span>
              <span className="text-xs text-muted-foreground">{checked}/{total}</span>
            </button>

            {isOpen && (
              <div className="divide-y">
                {cl.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 px-3 py-2.5">
                    <Checkbox
                      checked={item.isChecked}
                      disabled={updateItem.isPending}
                      onCheckedChange={(checked) => {
                        updateItem.mutate({
                          workOrderId,
                          itemId: item.id,
                          payload: { is_checked: !!checked },
                        });
                      }}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${item.isChecked ? "line-through text-muted-foreground" : ""}`}>
                        {item.itemName}
                        {item.isRequired && <span className="text-destructive ml-1">*</span>}
                      </p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-info mt-0.5 italic">{item.notes}</p>
                      )}
                    </div>
                    {item.checkedAt && (
                      <CheckCircle2 className="size-3.5 text-success shrink-0 mt-0.5" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Detail Sheet ─────────────────────────────────────────────────────────────

function DetailSheet() {
  const sheetOpen = useWorkOrderStore((s) => s.sheetOpen);
  const sheetMode = useWorkOrderStore((s) => s.sheetMode);
  const selectedWorkOrder = useWorkOrderStore((s) => s.selectedWorkOrder);
  const closeSheet = useWorkOrderStore((s) => s.closeSheet);

  const isDetail = sheetMode === "detail";
  const isCreate = sheetMode === "create";
  const isEdit = sheetMode === "edit";

  const wo = selectedWorkOrder;

  const [title, setTitle] = useState(wo?.title ?? "");
  const [description, setDescription] = useState(wo?.description ?? "");
  const [type, setType] = useState<WoType | "">(wo?.type ?? "");
  const [priority, setPriority] = useState<WoPriority | "">(wo?.priority ?? "");
  const [customerId, setCustomerId] = useState(wo?.customerId ?? "");
  const [customerName, setCustomerName] = useState(wo?.customerName ?? "");
  const [serviceAddress, setServiceAddress] = useState(wo?.serviceAddress ?? "");
  const [branchId, setBranchId] = useState(wo?.branchId ?? "");
  const [notes, setNotes] = useState(wo?.notes ?? "");
  const [scheduledAt, setScheduledAt] = useState(wo?.scheduledAt?.slice(0, 16) ?? "");

  const [technicianId, setTechnicianId] = useState(wo?.technicianId ?? "");
  const [technicianName, setTechnicianName] = useState(wo?.technicianName ?? "");
  const [assignMode, setAssignMode] = useState(false);

  const [newStatus, setNewStatus] = useState<WoStatus | "">(wo?.status ?? "");
  const [statusNotes, setStatusNotes] = useState("");
  const [statusMode, setStatusMode] = useState(false);

  const createWO = useCreateWorkOrder();
  const updateWO = useUpdateWorkOrder();
  const assignTech = useAssignTechnician();
  const updateStatus = useUpdateWorkOrderStatus();

  const isValid = title.trim() && type && priority && customerId.trim() && serviceAddress.trim() && branchId.trim();

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
      { id: wo.id, payload: { technician_id: technicianId, technician_name: technicianName } },
      { onSuccess: () => setAssignMode(false) }
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
                {isCreate ? "New Work Order" : isEdit ? "Edit Work Order" : wo?.title}
              </SheetTitle>
              {isDetail && wo && (
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{wo.woNumber}</p>
              )}
            </div>
            {isDetail && wo && (
              <Badge variant={WO_STATUS_VARIANTS[wo.status]} appearance="light" className="shrink-0 text-xs mt-1">
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
                  <p className="font-medium mt-0.5">{WO_TYPE_LABELS[wo.type]}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge variant={WO_PRIORITY_VARIANTS[wo.priority]} appearance="light" className="text-xs mt-0.5">
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
                  <p className="text-xs text-muted-foreground">Service Address</p>
                  <p className="font-medium mt-0.5">{wo.serviceAddress}</p>
                </div>
                {wo.scheduledAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Scheduled</p>
                    <p className="font-medium mt-0.5">{new Date(wo.scheduledAt).toLocaleString("id-ID")}</p>
                  </div>
                )}
                {wo.startedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Started</p>
                    <p className="font-medium mt-0.5">{new Date(wo.startedAt).toLocaleString("id-ID")}</p>
                  </div>
                )}
                {wo.completedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="font-medium mt-0.5">{new Date(wo.completedAt).toLocaleString("id-ID")}</p>
                  </div>
                )}
              </div>

              {wo.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
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
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Technician</p>
                  {wo.status !== "DONE" && (
                    <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setAssignMode(!assignMode)}>
                      <UserCheck className="size-3.5 mr-1" />{wo.technicianId ? "Reassign" : "Assign"}
                    </Button>
                  )}
                </div>
                {wo.technicianName ? (
                  <p className="text-sm font-medium">{wo.technicianName}</p>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No technician assigned</p>
                )}
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
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setAssignMode(false)}>Cancel</Button>
                      <Button
                        size="sm"
                        variant="primary"
                        className="h-7 text-xs"
                        onClick={handleAssign}
                        disabled={!technicianId.trim() || !technicianName.trim() || assignTech.isPending}
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
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Update Status</p>
                    <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setStatusMode(!statusMode)}>
                      Change
                    </Button>
                  </div>
                  {statusMode && (
                    <div className="space-y-2 pt-1">
                      <Select value={newStatus || "none"} onValueChange={(v) => setNewStatus(v === "none" ? "" : v as WoStatus)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="New status..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(["CREATED", "IN_PROGRESS", "DONE"] as WoStatus[])
                            .filter((s) => s !== wo.status)
                            .map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">{WO_STATUS_LABELS[s]}</SelectItem>
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
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setStatusMode(false)}>Cancel</Button>
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
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Checklists</p>
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
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Work order title..." />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Type *</Label>
                  <Select value={type || "none"} onValueChange={(v) => setType(v === "none" ? "" : v as WoType)} disabled={isEdit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(WO_TYPE_LABELS) as [WoType, string][]).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Priority *</Label>
                  <Select value={priority || "none"} onValueChange={(v) => setPriority(v === "none" ? "" : v as WoPriority)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(WO_PRIORITY_LABELS) as [WoPriority, string][]).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Customer ID *</Label>
                  <Input value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="UUID..." disabled={isEdit} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Customer Name</Label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Display name..." disabled={isEdit} />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Service Address *</Label>
                  <Input value={serviceAddress} onChange={(e) => setServiceAddress(e.target.value)} placeholder="Full address..." />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Branch ID *</Label>
                  <Input value={branchId} onChange={(e) => setBranchId(e.target.value)} placeholder="UUID..." disabled={isEdit} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Scheduled At</Label>
                  <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Optional description..." />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Additional notes..." />
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
              disabled={!isValid || createWO.isPending || updateWO.isPending}
            >
              {createWO.isPending || updateWO.isPending
                ? "Saving..."
                : isCreate
                ? "Create Work Order"
                : "Save Changes"}
            </Button>
          )}
          {isDetail && wo && (
            <Button variant="outline" onClick={() => useWorkOrderStore.getState().openSheet("edit", wo)}>
              Edit
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Work Order List ──────────────────────────────────────────────────────────

function WorkOrderList() {
  const openSheet = useWorkOrderStore((s) => s.openSheet);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data, isLoading, isError, refetch } = useWorkOrderList({
    status: statusFilter !== "all" ? (statusFilter as WoStatus) : undefined,
    type: typeFilter !== "all" ? (typeFilter as WoType) : undefined,
  });

  const workOrders = data?.workOrders ?? [];

  const filtered = useMemo(() => {
    if (!search) return workOrders;
    const q = search.toLowerCase();
    return workOrders.filter(
      (wo) =>
        wo.title.toLowerCase().includes(q) ||
        wo.woNumber.toLowerCase().includes(q) ||
        wo.customerName.toLowerCase().includes(q) ||
        wo.serviceAddress.toLowerCase().includes(q),
    );
  }, [workOrders, search]);

  const columns = useMemo<ColumnDef<WorkOrder>[]>(
    () => [
      {
        accessorKey: "woNumber",
        header: "WO #",
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.woNumber}</span>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="max-w-[220px]">
            <p className="text-sm font-medium truncate">{row.original.title}</p>
            <p className="text-xs text-muted-foreground truncate">{row.original.customerName}</p>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <span className="text-xs">{WO_TYPE_LABELS[row.original.type]}</span>
        ),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <Badge variant={WO_PRIORITY_VARIANTS[row.original.priority]} appearance="light" className="text-xs">
            {WO_PRIORITY_LABELS[row.original.priority]}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={WO_STATUS_VARIANTS[row.original.status]} appearance="light" className="text-xs">
            {WO_STATUS_LABELS[row.original.status]}
          </Badge>
        ),
      },
      {
        accessorKey: "technicianName",
        header: "Technician",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.technicianName ?? <span className="text-muted-foreground text-xs">Unassigned</span>}
          </span>
        ),
      },
      {
        accessorKey: "scheduledAt",
        header: "Scheduled",
        cell: ({ row }) =>
          row.original.scheduledAt
            ? new Date(row.original.scheduledAt).toLocaleDateString("id-ID")
            : <span className="text-muted-foreground text-xs">—</span>,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5 justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => openSheet("detail", row.original)}
            >
              View
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => openSheet("edit", row.original)}
            >
              Edit
            </Button>
          </div>
        ),
      },
    ],
    [openSheet],
  );

  const table = useReactTable({
    columns,
    data: filtered,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid table={table} isLoading={isLoading} recordCount={filtered.length}>
      <DataGridContainer>
        <Card>
          <CardHeader>
            <CardHeading>
              <CardToolbar>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    className="ps-9 w-56"
                    placeholder="Search WO..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {(["CREATED", "IN_PROGRESS", "DONE"] as WoStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>{WO_STATUS_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {(Object.entries(WO_TYPE_LABELS) as [WoType, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardToolbar>
            </CardHeading>
          </CardHeader>

          {isError && (
            <div className="flex items-center gap-2 px-5 py-3 text-sm text-destructive bg-destructive/5">
              <AlertCircle className="size-4 shrink-0" />
              Failed to load work orders.
              <button className="underline ml-1" onClick={() => refetch()}>Retry</button>
            </div>
          )}

          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>

          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGridContainer>
    </DataGrid>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function WorkOrdersPage() {
  const openSheet = useWorkOrderStore((s) => s.openSheet);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Operations", path: paths.dashboard.operations.root.getHref() },
          { title: "Work Orders" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Work Orders
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" onClick={() => openSheet("create")} className="font-semibold">
            <Plus className="size-4" />
            New Work Order
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="mt-5">
        <WorkOrderList />
      </div>

      <DetailSheet />
    </div>
  );
}
