"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, GitMerge } from "lucide-react";
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
  Card,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";

type ApprovalType = "sequential" | "parallel" | "any_one";
type TriggerAction =
  | "customer_status_change"
  | "order_create"
  | "work_order_complete"
  | "schema_publish"
  | "user_role_assign"
  | "lead_convert"
  | "branch_policy_change";

interface ApprovalStep {
  order: number;
  approver_role: string;
  timeout_hours: number;
}

interface ApprovalPolicy {
  id: string;
  name: string;
  trigger_action: TriggerAction;
  approval_type: ApprovalType;
  steps: ApprovalStep[];
  description: string;
  is_active: boolean;
  created_at: string;
}

const TRIGGER_LABELS: Record<TriggerAction, string> = {
  customer_status_change: "Customer Status Change",
  order_create: "Order Creation",
  work_order_complete: "Work Order Completion",
  schema_publish: "Schema Publish",
  user_role_assign: "User Role Assignment",
  lead_convert: "Lead Conversion",
  branch_policy_change: "Branch Policy Change",
};

const APPROVAL_TYPE_LABELS: Record<ApprovalType, string> = {
  sequential: "Sequential",
  parallel: "Parallel",
  any_one: "Any One",
};

const APPROVAL_TYPE_VARIANTS: Record<ApprovalType, "primary" | "success" | "warning"> = {
  sequential: "primary",
  parallel: "success",
  any_one: "warning",
};

const ROLES = ["super_admin", "admin", "noc", "sales", "technician", "finance", "cs_agent"];

const SEED: ApprovalPolicy[] = [
  {
    id: "1",
    name: "Schema Publish Approval",
    trigger_action: "schema_publish",
    approval_type: "sequential",
    steps: [
      { order: 1, approver_role: "admin", timeout_hours: 24 },
      { order: 2, approver_role: "super_admin", timeout_hours: 48 },
    ],
    description: "Requires admin then super_admin sign-off before publishing a schema version.",
    is_active: true,
    created_at: "2026-01-10",
  },
  {
    id: "2",
    name: "Lead Conversion Approval",
    trigger_action: "lead_convert",
    approval_type: "any_one",
    steps: [{ order: 1, approver_role: "admin", timeout_hours: 8 }],
    description: "Any admin can approve lead conversion to customer.",
    is_active: true,
    created_at: "2026-01-15",
  },
];

const EMPTY_FORM = {
  name: "",
  trigger_action: "" as TriggerAction | "",
  approval_type: "sequential" as ApprovalType,
  description: "",
  is_active: true,
  steps: [{ order: 1, approver_role: "", timeout_hours: 24 }] as ApprovalStep[],
};

export function ApprovalPolicyPage() {
  const [policies, setPolicies] = useState<ApprovalPolicy[]>(SEED);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, steps: [{ order: 1, approver_role: "", timeout_hours: 24 }] });
    setEditId(null);
    setSheetOpen(true);
  };

  const openEdit = (p: ApprovalPolicy) => {
    setForm({ ...p });
    setEditId(p.id);
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.trigger_action) return;
    if (editId) {
      setPolicies((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...form, trigger_action: form.trigger_action as TriggerAction } : p)),
      );
    } else {
      setPolicies((prev) => [
        ...prev,
        {
          ...(form as Omit<ApprovalPolicy, "id" | "created_at">),
          trigger_action: form.trigger_action as TriggerAction,
          id: Date.now().toString(),
          created_at: new Date().toISOString().slice(0, 10),
        },
      ]);
    }
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setPolicies((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  const addStep = () =>
    setForm((f) => ({
      ...f,
      steps: [...f.steps, { order: f.steps.length + 1, approver_role: "", timeout_hours: 24 }],
    }));

  const removeStep = (idx: number) =>
    setForm((f) => ({ ...f, steps: f.steps.filter((_, i) => i !== idx) }));

  const updateStep = (idx: number, field: keyof ApprovalStep, value: string | number) =>
    setForm((f) => ({
      ...f,
      steps: f.steps.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }));

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "Approval Policies" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Approval Policy Management
          </ToolbarTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Define multi-step approval workflows for sensitive actions
          </p>
        </ToolbarHeading>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="size-4" /> New Policy
        </Button>
      </Toolbar>

      <Card className="mt-5">
        <CardHeader>
          <CardHeading>
            <GitMerge className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">{policies.length} policies</span>
          </CardHeading>
          <CardToolbar />
        </CardHeader>
        <CardTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No approval policies defined
                  </TableCell>
                </TableRow>
              )}
              {policies.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {TRIGGER_LABELS[p.trigger_action]}
                  </TableCell>
                  <TableCell>
                    <Badge variant={APPROVAL_TYPE_VARIANTS[p.approval_type]} appearance="light" size="sm">
                      {APPROVAL_TYPE_LABELS[p.approval_type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.steps.length}</TableCell>
                  <TableCell>
                    <Badge variant={p.is_active ? "success" : "secondary"} appearance="light" size="sm">
                      {p.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.created_at}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardTable>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editId ? "Edit Policy" : "New Approval Policy"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-6">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Policy Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Schema Publish Approval"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Trigger Action *</Label>
              <Select
                value={form.trigger_action}
                onValueChange={(v) => setForm({ ...form, trigger_action: v as TriggerAction })}
              >
                <SelectTrigger><SelectValue placeholder="Select trigger…" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TRIGGER_LABELS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Approval Type</Label>
              <Select
                value={form.approval_type}
                onValueChange={(v) => setForm({ ...form, approval_type: v as ApprovalType })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential — all must approve in order</SelectItem>
                  <SelectItem value="parallel">Parallel — all must approve (any order)</SelectItem>
                  <SelectItem value="any_one">Any One — first approval sufficient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe when and why this policy applies…"
                className="resize-none min-h-[72px]"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">Approval Steps</Label>
                <Button variant="ghost" size="sm" onClick={addStep}>
                  <Plus className="size-3.5" /> Add Step
                </Button>
              </div>
              {form.steps.map((step, idx) => (
                <div key={idx} className="rounded-lg border p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Step {idx + 1}
                    </span>
                    {form.steps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive h-6 px-2"
                        onClick={() => removeStep(idx)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Approver Role</Label>
                      <Select
                        value={step.approver_role}
                        onValueChange={(v) => updateStep(idx, "approver_role", v)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select role…" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r} className="capitalize">
                              {r.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Timeout (hours)</Label>
                      <Input
                        type="number"
                        min={1}
                        value={step.timeout_hours}
                        onChange={(e) => updateStep(idx, "timeout_hours", Number(e.target.value))}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleSave}>
                {editId ? "Save Changes" : "Create Policy"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete approval policy?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the policy permanently. Actions that relied on it will no longer require approval.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
