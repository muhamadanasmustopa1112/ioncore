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
  CheckCircle,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  X,
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
import { useTemplateList } from "../../api/checklist-template-queries";
import {
  useOverrideList,
  useCreateOverride,
  useUpdateOverride,
  useApproveOverride,
  useArchiveOverride,
} from "../../api/overrides-queries";
import { useOverridesStore } from "../../store/overrides";
import type { Override, ExceptionAction, SignerRole, OverrideScopeType } from "../../types/overrides";
import type { ExceptionRulePayload, OverridePayload } from "../../types/overrides-api";
import {
  SCOPE_TYPE_LABELS,
  OVERRIDE_STATUS_LABELS,
  OVERRIDE_STATUS_VARIANTS,
  EXCEPTION_ACTION_LABELS,
} from "../../types/overrides";

// ─── Exception Rule Row ───────────────────────────────────────────────────────

interface ExceptionRuleDraft {
  stepId: string;
  captureId: string;
  action: ExceptionAction | "";
  newLabel: string;
  newSignerRole: SignerRole | "";
  reason: string;
}

function emptyRule(): ExceptionRuleDraft {
  return { stepId: "", captureId: "", action: "", newLabel: "", newSignerRole: "", reason: "" };
}

interface RuleRowProps {
  rule: ExceptionRuleDraft;
  index: number;
  steps: Array<{ id: string; title: string; captures: Array<{ captureId: string; label: string }> }>;
  onChange: (index: number, patch: Partial<ExceptionRuleDraft>) => void;
  onRemove: (index: number) => void;
}

function RuleRow({ rule, index, steps, onChange, onRemove }: RuleRowProps) {
  const selectedStep = steps.find((s) => s.id === rule.stepId);
  const captures = selectedStep?.captures ?? [];

  const needsCaptureSelect = [
    "make_optional",
    "make_required",
    "modify_label",
    "remove_capture",
    "change_signer_role",
  ].includes(rule.action);

  const needsNewLabel = rule.action === "modify_label";
  const needsSignerRole = rule.action === "change_signer_role";

  return (
    <div className="rounded-md border p-3 space-y-3 bg-muted/20">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Rule {index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Step *</Label>
          <Select value={rule.stepId} onValueChange={(v) => onChange(index, { stepId: v, captureId: "" })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select step..." />
            </SelectTrigger>
            <SelectContent>
              {steps.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-xs">{s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Action *</Label>
          <Select value={rule.action} onValueChange={(v) => onChange(index, { action: v as ExceptionAction, captureId: "", newLabel: "", newSignerRole: "" })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select action..." />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(EXCEPTION_ACTION_LABELS) as [ExceptionAction, string][]).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {needsCaptureSelect && captures.length > 0 && (
        <div className="space-y-1">
          <Label className="text-xs">Capture (optional)</Label>
          <Select value={rule.captureId || "none"} onValueChange={(v) => onChange(index, { captureId: v === "none" ? "" : v })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All captures in step" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-xs">— All captures in step —</SelectItem>
              {captures.map((c) => (
                <SelectItem key={c.captureId} value={c.captureId} className="text-xs">{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {needsNewLabel && (
        <div className="space-y-1">
          <Label className="text-xs">New Label *</Label>
          <Input
            className="h-8 text-xs"
            value={rule.newLabel}
            onChange={(e) => onChange(index, { newLabel: e.target.value })}
            placeholder="Replacement label text..."
          />
        </div>
      )}

      {needsSignerRole && (
        <div className="space-y-1">
          <Label className="text-xs">New Signer Role *</Label>
          <Select value={rule.newSignerRole || "none"} onValueChange={(v) => onChange(index, { newSignerRole: v === "none" ? "" : v as SignerRole })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select role..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer" className="text-xs">Customer</SelectItem>
              <SelectItem value="enterprise_pic" className="text-xs">Enterprise PIC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1">
        <Label className="text-xs">Reason *</Label>
        <Textarea
          className="text-xs min-h-[48px]"
          value={rule.reason}
          onChange={(e) => onChange(index, { reason: e.target.value })}
          placeholder="Why is this exception needed?"
          rows={2}
        />
      </div>
    </div>
  );
}

// ─── Override Sheet ───────────────────────────────────────────────────────────

function OverrideSheet() {
  const sheetOpen = useOverridesStore((s) => s.sheetOpen);
  const closeSheet = useOverridesStore((s) => s.closeSheet);
  const selectedOverride = useOverridesStore((s) => s.selectedOverride);

  const isEdit = !!selectedOverride;

  const { data: templates = [] } = useTemplateList();

  const [scopeType, setScopeType] = useState<OverrideScopeType | "">(selectedOverride?.scopeType ?? "");
  const [scopeRefId, setScopeRefId] = useState(selectedOverride?.scopeRefId ?? "");
  const [scopeRefName, setScopeRefName] = useState(selectedOverride?.scopeRefName ?? "");
  const [baseTemplateId, setBaseTemplateId] = useState(selectedOverride?.baseTemplateId ?? "");
  const [validFrom, setValidFrom] = useState(selectedOverride?.validFrom ?? "");
  const [validUntil, setValidUntil] = useState(selectedOverride?.validUntil ?? "");
  const [submitForApproval, setSubmitForApproval] = useState(false);
  const [rules, setRules] = useState<ExceptionRuleDraft[]>(
    selectedOverride?.exceptionRules.map((r) => ({
      stepId: r.stepId,
      captureId: r.captureId ?? "",
      action: r.action,
      newLabel: r.newLabel ?? "",
      newSignerRole: r.newSignerRole ?? "",
      reason: r.reason,
    })) ?? [emptyRule()]
  );

  const selectedTemplate = templates.find((t) => t.id === baseTemplateId);
  const steps = (selectedTemplate?.steps ?? []).map((s) => ({
    id: s.stepId,
    title: s.title,
    captures: s.captures.map((c) => ({ captureId: c.captureId, label: c.label })),
  }));

  const createOverride = useCreateOverride();
  const updateOverride = useUpdateOverride();

  const handleRuleChange = (index: number, patch: Partial<ExceptionRuleDraft>) => {
    setRules((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const handleRuleRemove = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid =
    scopeType &&
    scopeRefId.trim() &&
    baseTemplateId &&
    rules.length > 0 &&
    rules.every((r) => r.stepId && r.action && r.reason.trim());

  const handleSave = () => {
    if (!scopeType || !baseTemplateId) return;

    const exceptionRules: ExceptionRulePayload[] = rules.map((r) => ({
      step_id: r.stepId,
      capture_id: r.captureId || null,
      action: r.action as ExceptionAction,
      new_label: r.newLabel || null,
      new_signer_role: r.newSignerRole as SignerRole | null || null,
      reason: r.reason,
    }));

    const payload: OverridePayload = {
      scope_type: scopeType,
      scope_ref_id: scopeRefId,
      base_template_id: baseTemplateId,
      exception_rules: exceptionRules,
      valid_from: validFrom || null,
      valid_until: validUntil || null,
      submit_for_approval: submitForApproval,
    };

    if (isEdit && selectedOverride) {
      updateOverride.mutate({ id: selectedOverride.id, payload }, { onSuccess: closeSheet });
    } else {
      createOverride.mutate(payload, { onSuccess: closeSheet });
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(o) => !o && closeSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[580px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {isEdit ? "Edit Override" : "New Override & Exception"}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-auto p-5 space-y-5">
          {/* Scope */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scope</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Scope Type *</Label>
                <Select value={scopeType || "none"} onValueChange={(v) => setScopeType(v === "none" ? "" : v as OverrideScopeType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(SCOPE_TYPE_LABELS) as [OverrideScopeType, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Scope Reference ID *</Label>
                <Input
                  value={scopeRefId}
                  onChange={(e) => setScopeRefId(e.target.value)}
                  placeholder="customer_id / contract_id..."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Scope Reference Name</Label>
              <Input
                value={scopeRefName}
                onChange={(e) => setScopeRefName(e.target.value)}
                placeholder="Display name for reference..."
              />
            </div>
          </div>

          {/* Base Template */}
          <div className="space-y-1.5">
            <Label className="text-xs">Base Template *</Label>
            <Select value={baseTemplateId || "none"} onValueChange={(v) => { setBaseTemplateId(v === "none" ? "" : v); setRules([emptyRule()]); }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.schemaName} <span className="text-muted-foreground">({t.woType})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exception Rules */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Exception Rules *
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => setRules((prev) => [...prev, emptyRule()])}
                disabled={!baseTemplateId}
              >
                <Plus className="size-3.5 mr-1" />Add Rule
              </Button>
            </div>

            {!baseTemplateId && (
              <p className="text-xs text-muted-foreground italic">Select a template first to add exception rules.</p>
            )}

            {rules.map((rule, i) => (
              <RuleRow
                key={i}
                rule={rule}
                index={i}
                steps={steps}
                onChange={handleRuleChange}
                onRemove={handleRuleRemove}
              />
            ))}
          </div>

          {/* Validity */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Validity Period</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Valid From</Label>
                <Input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Valid Until</Label>
                <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Submit for approval toggle */}
          {!isEdit && (
            <div className="flex items-center gap-3 rounded-md border px-4 py-3 bg-muted/20">
              <input
                type="checkbox"
                id="submit-approval"
                className="size-4"
                checked={submitForApproval}
                onChange={(e) => setSubmitForApproval(e.target.checked)}
              />
              <label htmlFor="submit-approval" className="text-sm cursor-pointer select-none">
                Submit for approval immediately after saving
              </label>
            </div>
          )}
        </SheetBody>

        <div className="border-t p-5 pb-4 flex gap-2.5 justify-end">
          <Button variant="ghost" onClick={closeSheet}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isValid || createOverride.isPending || updateOverride.isPending}
            className="font-semibold"
          >
            {createOverride.isPending || updateOverride.isPending
              ? "Saving..."
              : isEdit
              ? "Save Changes"
              : "Create Override"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Override List ────────────────────────────────────────────────────────────

function OverrideList() {
  const { data: overrides = [], isLoading, isError, refetch } = useOverrideList();
  const openSheet = useOverridesStore((s) => s.openSheet);
  const approveOverride = useApproveOverride();
  const archiveOverride = useArchiveOverride();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return overrides;
    const q = search.toLowerCase();
    return overrides.filter(
      (o) =>
        o.baseTemplateName.toLowerCase().includes(q) ||
        o.scopeRefName.toLowerCase().includes(q) ||
        o.scopeType.toLowerCase().includes(q),
    );
  }, [overrides, search]);

  const columns = useMemo<ColumnDef<Override>[]>(
    () => [
      {
        accessorKey: "scopeType",
        header: "Scope Type",
        cell: ({ row }) => (
          <span className="text-sm">{SCOPE_TYPE_LABELS[row.original.scopeType]}</span>
        ),
      },
      {
        accessorKey: "scopeRefName",
        header: "Scope Ref",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium">{row.original.scopeRefName || row.original.scopeRefId}</p>
            <p className="text-xs text-muted-foreground">{row.original.scopeRefId}</p>
          </div>
        ),
      },
      {
        accessorKey: "baseTemplateName",
        header: "Base Template",
        cell: ({ row }) => <span className="text-sm">{row.original.baseTemplateName}</span>,
      },
      {
        id: "exceptionCount",
        header: "Exceptions",
        cell: ({ row }) => (
          <Badge variant="secondary" appearance="light" className="text-xs">
            {row.original.exceptionRules.length} rule{row.original.exceptionRules.length !== 1 ? "s" : ""}
          </Badge>
        ),
      },
      {
        accessorKey: "validFrom",
        header: "Valid From",
        cell: ({ row }) =>
          row.original.validFrom
            ? new Date(row.original.validFrom).toLocaleDateString("id-ID")
            : <span className="text-muted-foreground">—</span>,
      },
      {
        accessorKey: "validUntil",
        header: "Valid Until",
        cell: ({ row }) =>
          row.original.validUntil
            ? new Date(row.original.validUntil).toLocaleDateString("id-ID")
            : <span className="text-muted-foreground">—</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={OVERRIDE_STATUS_VARIANTS[row.original.status]} appearance="light" className="text-xs capitalize">
            {OVERRIDE_STATUS_LABELS[row.original.status]}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const o = row.original;
          return (
            <div className="flex items-center gap-0.5 justify-end">
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => openSheet(o)}>
                Edit
              </Button>
              {o.status === "pending_approval" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-success hover:text-success"
                  onClick={() => approveOverride.mutate(o.id)}
                  disabled={approveOverride.isPending}
                >
                  <CheckCircle className="size-3.5 mr-1" />Approve
                </Button>
              )}
              {o.status === "active" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-muted-foreground"
                  onClick={() => archiveOverride.mutate(o.id)}
                  disabled={archiveOverride.isPending}
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [openSheet, approveOverride, archiveOverride],
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

  const pendingCount = overrides.filter((o) => o.status === "pending_approval").length;

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
                    className="ps-9 w-60"
                    placeholder="Search overrides..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {pendingCount > 0 && (
                  <Badge variant="warning" appearance="light" className="gap-1.5 h-7 px-2.5">
                    <AlertCircle className="size-3.5" />
                    {pendingCount} pending approval
                  </Badge>
                )}
              </CardToolbar>
            </CardHeading>
          </CardHeader>

          {isError && (
            <div className="flex items-center gap-2 px-5 py-3 text-sm text-destructive bg-destructive/5">
              <AlertCircle className="size-4 shrink-0" />
              Failed to load overrides.
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

export function ChecklistOverridesPage() {
  const openSheet = useOverridesStore((s) => s.openSheet);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "Checklist" },
          { title: "Override & Exception Rules" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Override &amp; Exception Rules
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" onClick={() => openSheet()} className="font-semibold">
            <ShieldAlert className="size-4" />
            New Override
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="mt-5">
        <OverrideList />
      </div>

      <OverrideSheet />
    </div>
  );
}
