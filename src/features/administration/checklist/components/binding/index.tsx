"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, Plus, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useBindingList, useServiceChangePolicies, useCreateBinding, useUpdateBinding, useDeleteBinding, useDeleteServiceChangePolicy, useCreateServiceChangePolicy } from "../../api/binding-queries";
import { useTemplateList } from "../../api/checklist-template-queries";
import { useBindingStore } from "../../store/binding";
import type { ChecklistBinding, WoType, MaintenanceSubtype } from "../../types/binding";
import { PRODUCT_TYPES, WO_TYPE_COLS } from "../../types/binding";
import { WO_TYPE_LABELS } from "../../types/checklist-template";

type TabId = "matrix" | "policies";

// ─── Binding Form Sheet ──────────────────────────────────────────────────────

function BindingFormSheet() {
  const sheetOpen = useBindingStore((s) => s.sheetOpen);
  const closeSheet = useBindingStore((s) => s.closeSheet);
  const form = useBindingStore((s) => s.form);
  const selectedBinding = useBindingStore((s) => s.selectedBinding);
  const prefillWoType = useBindingStore((s) => s.prefillWoType);
  const prefillProductType = useBindingStore((s) => s.prefillProductType);

  const { data: templates = [] } = useTemplateList();
  const createBinding = useCreateBinding();
  const updateBinding = useUpdateBinding();
  const isPending = createBinding.isPending || updateBinding.isPending;

  const [woType, setWoType] = useState<WoType>("new_installation");
  const [maintenanceSubtype, setMaintenanceSubtype] = useState<MaintenanceSubtype>("hardware_swap");
  const [productType, setProductType] = useState("");
  const [templateId, setTemplateId] = useState("");

  const WO_TYPES: WoType[] = ["new_installation", "maintenance", "termination", "infrastructure_deployment"];
  const MAINTENANCE_SUBTYPES: MaintenanceSubtype[] = ["hardware_swap", "signal_issue", "config", "other"];

  // Sync on open
  useState(() => {
    if (selectedBinding) {
      setWoType(selectedBinding.woType);
      setMaintenanceSubtype(selectedBinding.maintenanceSubtype ?? "hardware_swap");
      setProductType(selectedBinding.productType);
      setTemplateId(selectedBinding.templateId);
    } else {
      setWoType((prefillWoType as WoType) ?? "new_installation");
      setProductType(prefillProductType ?? "");
      setTemplateId("");
    }
  });

  const handleSave = () => {
    const payload = {
      wo_type: woType,
      ...(woType === "maintenance" ? { maintenance_subtype: maintenanceSubtype } : {}),
      product_type: productType,
      template_id: templateId,
    };
    if (form === "new") {
      createBinding.mutate(payload, { onSuccess: closeSheet });
    } else if (form === "edit" && selectedBinding) {
      updateBinding.mutate({ id: selectedBinding.id, payload }, { onSuccess: closeSheet });
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(o) => !o && closeSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[480px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {form === "new" ? "Add Binding" : "Edit Binding"}
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="flex-1 overflow-auto p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">WO Type *</Label>
            <Select value={woType} onValueChange={(v) => setWoType(v as WoType)}>
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                {WO_TYPES.map((t) => <SelectItem key={t} value={t}>{WO_TYPE_LABELS[t]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {woType === "maintenance" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Maintenance Subtype</Label>
              <Select value={maintenanceSubtype} onValueChange={(v) => setMaintenanceSubtype(v as MaintenanceSubtype)}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_SUBTYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">Product Type *</Label>
            <Input value={productType} onChange={(e) => setProductType(e.target.value)} placeholder="e.g. broadband" className="h-8" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Template *</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger className="h-8"><SelectValue placeholder="Select template" /></SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.schemaName} <span className="text-muted-foreground ml-1">v{t.schemaVersion}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SheetBody>
        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 mt-auto">
          <Button variant="ghost" onClick={closeSheet}>Close</Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={closeSheet} disabled={isPending}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={isPending || !templateId || !productType} className="font-semibold">
            {isPending ? "Saving..." : form === "new" ? "Create" : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Matrix View ─────────────────────────────────────────────────────────────

function MatrixView({ bindings }: { bindings: ChecklistBinding[] }) {
  const openSheet = useBindingStore((s) => s.openSheet);
  const deleteBinding = useDeleteBinding();

  const getBinding = (productType: string, col: typeof WO_TYPE_COLS[number]) => {
    return bindings.find((b) => {
      if (b.productType !== productType) return false;
      if (col.maintenanceSubtype) {
        return b.woType === "maintenance" && b.maintenanceSubtype === col.maintenanceSubtype;
      }
      return b.woType === col.key && !b.maintenanceSubtype;
    });
  };

  const missingCount = useMemo(() => {
    let count = 0;
    for (const pt of PRODUCT_TYPES) {
      for (const col of WO_TYPE_COLS) {
        if (!getBinding(pt, col)) count++;
      }
    }
    return count;
  }, [bindings]);

  return (
    <div>
      {missingCount > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          <span className="font-semibold">{missingCount}</span> product type × WO type combinations have no template assigned
        </div>
      )}
      <div className="overflow-auto rounded-lg border">
        <table className="text-xs min-w-max">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground min-w-[120px] sticky left-0 bg-muted/40 z-10">Product</th>
              {WO_TYPE_COLS.map((col) => (
                <th key={col.key} className="text-center px-3 py-2.5 font-medium text-muted-foreground min-w-[140px]">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {PRODUCT_TYPES.map((pt) => (
              <tr key={pt} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium capitalize sticky left-0 bg-background border-e">{pt}</td>
                {WO_TYPE_COLS.map((col) => {
                  const b = getBinding(pt, col);
                  return (
                    <td key={col.key} className="px-3 py-2 text-center">
                      {b ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openSheet("edit", b)}
                            className="inline-flex items-center gap-1 rounded-md bg-success/10 text-success border border-success/20 px-2 py-0.5 text-xs font-medium hover:bg-success/20 transition-colors max-w-[120px] truncate"
                          >
                            {b.templateName}
                          </button>
                          <button
                            onClick={() => deleteBinding.mutate(b.id)}
                            className="p-0.5 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openSheet("new", undefined, { woType: col.maintenanceSubtype ? "maintenance" : col.key as WoType, productType: pt })}
                          className="inline-flex items-center gap-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 text-xs hover:bg-destructive/20 transition-colors"
                        >
                          <Plus className="size-3" /> Assign
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Service Change Policies Tab ─────────────────────────────────────────────

function ServiceChangePoliciesTab() {
  const { data: policies = [], isLoading } = useServiceChangePolicies();
  const createPolicy = useCreateServiceChangePolicy();
  const deletePolicy = useDeleteServiceChangePolicy();
  const [adding, setAdding] = useState(false);
  const [changeType, setChangeType] = useState("upgrade");
  const [fromPkg, setFromPkg] = useState("");
  const [toPkg, setToPkg] = useState("");
  const [checklistType, setChecklistType] = useState<WoType>("maintenance");
  const [notes, setNotes] = useState("");

  const CHANGE_TYPES = ["upgrade", "downgrade", "change_plan", "add_service", "remove_service", "relocation"];
  const WO_TYPES: WoType[] = ["new_installation", "maintenance", "termination"];

  const handleCreate = () => {
    createPolicy.mutate(
      { service_change_type: changeType, from_package_code: fromPkg || undefined, to_package_code: toPkg || undefined, requires_checklist_type: checklistType, notes },
      { onSuccess: () => { setAdding(false); setChangeType("upgrade"); setFromPkg(""); setToPkg(""); setNotes(""); } }
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-muted-foreground">Defines which checklist type is required when customers change service.</p>
        <Button size="sm" variant="primary" className="h-8 px-3 text-xs font-semibold" onClick={() => setAdding(true)}>
          <Plus className="size-3.5" /> Add Policy
        </Button>
      </div>

      {adding && (
        <div className="rounded-lg border p-4 mb-4 space-y-3 bg-muted/20">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Change Type</Label>
              <Select value={changeType} onValueChange={setChangeType}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CHANGE_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize text-xs">{t.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Required Checklist Type</Label>
              <Select value={checklistType} onValueChange={(v) => setChecklistType(v as WoType)}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WO_TYPES.map((t) => <SelectItem key={t} value={t} className="text-xs">{WO_TYPE_LABELS[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">From Package (optional)</Label>
              <Input value={fromPkg} onChange={(e) => setFromPkg(e.target.value)} placeholder="e.g. PKG-001" className="h-7 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To Package (optional)</Label>
              <Input value={toPkg} onChange={(e) => setToPkg(e.target.value)} placeholder="e.g. PKG-002" className="h-7 text-xs" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Why this policy exists" className="h-7 text-xs" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="sm" variant="primary" className="h-7 text-xs" onClick={handleCreate} disabled={createPolicy.isPending}>
              {createPolicy.isPending ? "Saving..." : "Create"}
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="size-4 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Change Type</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">From → To</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Checklist Type</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Notes</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {policies.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground text-xs">No policies configured</td></tr>
              )}
              {policies.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 capitalize">{p.serviceChangeType.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.fromPackageCode ?? "any"} → {p.toPackageCode ?? "any"}</td>
                  <td className="px-4 py-3 text-xs">{WO_TYPE_LABELS[p.requiresChecklistType]}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.notes}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive" onClick={() => deletePolicy.mutate(p.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ChecklistBindingPage() {
  const [activeTab, setActiveTab] = useState<TabId>("matrix");
  const { data: bindings = [], isLoading } = useBindingList();
  const openSheet = useBindingStore((s) => s.openSheet);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "Checklist" },
          { title: "Binding Matrix" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Checklist Binding Matrix
          </ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <LayoutGrid className="size-3.5" />
              WO Type × Product → Template
            </Badge>
          </div>
        </ToolbarHeading>
        <ToolbarActions className="mt-1 sm:mt-0">
          {activeTab === "matrix" && (
            <Button variant="primary" className="h-9 px-4 text-sm font-semibold" onClick={() => openSheet("new")}>
              <Plus className="size-4" /> Add Binding
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      <div className="mt-4">
        <div className="flex gap-0 border-b">
          {([{ id: "matrix", label: "Matrix View" }, { id: "policies", label: "Service Change Policies" }] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {activeTab === "matrix" && (
            isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
            ) : (
              <MatrixView bindings={bindings} />
            )
          )}
          {activeTab === "policies" && <ServiceChangePoliciesTab />}
        </div>
      </div>

      <BindingFormSheet />
    </div>
  );
}
