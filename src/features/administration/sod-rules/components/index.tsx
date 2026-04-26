"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ShieldOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
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

type Enforcement = "hard_block" | "soft_warning" | "audit_only";
type ConflictType = "role_role" | "role_permission" | "permission_permission";

interface SodRule {
  id: string;
  name: string;
  description: string;
  conflict_type: ConflictType;
  subject_a: string;
  subject_b: string;
  enforcement: Enforcement;
  is_active: boolean;
  created_at: string;
}

const ENFORCEMENT_LABELS: Record<Enforcement, string> = {
  hard_block: "Hard Block",
  soft_warning: "Soft Warning",
  audit_only: "Audit Only",
};

const ENFORCEMENT_VARIANTS: Record<Enforcement, "destructive" | "warning" | "secondary"> = {
  hard_block: "destructive",
  soft_warning: "warning",
  audit_only: "secondary",
};

const CONFLICT_TYPE_LABELS: Record<ConflictType, string> = {
  role_role: "Role ↔ Role",
  role_permission: "Role ↔ Permission",
  permission_permission: "Permission ↔ Permission",
};

const ROLES = ["super_admin", "admin", "noc", "sales", "technician", "finance", "cs_agent"];

const PERMISSIONS = [
  "user.manage", "role.manage", "order.create", "order.approve",
  "billing.manage", "billing.approve", "schema.publish", "schema.approve",
  "audit.read", "admin.manage", "master.manage",
];

const SEED: SodRule[] = [
  {
    id: "1",
    name: "Finance cannot approve own billing",
    description: "A user with finance role cannot also hold billing approval rights.",
    conflict_type: "role_permission",
    subject_a: "finance",
    subject_b: "billing.approve",
    enforcement: "hard_block",
    is_active: true,
    created_at: "2026-01-05",
  },
  {
    id: "2",
    name: "Sales cannot manage own orders",
    description: "Sales reps cannot approve the orders they created.",
    conflict_type: "role_permission",
    subject_a: "sales",
    subject_b: "order.approve",
    enforcement: "soft_warning",
    is_active: true,
    created_at: "2026-01-08",
  },
  {
    id: "3",
    name: "Admin and Super Admin conflict",
    description: "A single user should not hold both admin and super_admin roles simultaneously.",
    conflict_type: "role_role",
    subject_a: "admin",
    subject_b: "super_admin",
    enforcement: "audit_only",
    is_active: false,
    created_at: "2026-02-01",
  },
];

const EMPTY_FORM = {
  name: "",
  description: "",
  conflict_type: "role_role" as ConflictType,
  subject_a: "",
  subject_b: "",
  enforcement: "soft_warning" as Enforcement,
  is_active: true,
};

export function SodRulesPage() {
  const [rules, setRules] = useState<SodRule[]>(SEED);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setSheetOpen(true);
  };

  const openEdit = (r: SodRule) => {
    setForm({ ...r });
    setEditId(r.id);
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.subject_a || !form.subject_b) return;
    if (editId) {
      setRules((prev) => prev.map((r) => (r.id === editId ? { ...r, ...form } : r)));
    } else {
      setRules((prev) => [
        ...prev,
        { ...form, id: Date.now().toString(), created_at: new Date().toISOString().slice(0, 10) },
      ]);
    }
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setRules((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
  };

  const toggleActive = (id: string) =>
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, is_active: !r.is_active } : r)));

  const subjectOptions = (type: ConflictType, side: "a" | "b") => {
    if (type === "role_role") return ROLES;
    if (type === "permission_permission") return PERMISSIONS;
    return side === "a" ? ROLES : PERMISSIONS;
  };

  const subjectLabel = (type: ConflictType, side: "a" | "b") => {
    if (type === "role_role") return side === "a" ? "Role A" : "Role B";
    if (type === "permission_permission") return side === "a" ? "Permission A" : "Permission B";
    return side === "a" ? "Role" : "Permission";
  };

  const activeCount = rules.filter((r) => r.is_active).length;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "SoD Rules" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Segregation of Duties Rules
          </ToolbarTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Prevent conflicting roles or permissions from being assigned to the same user
          </p>
        </ToolbarHeading>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="size-4" /> New Rule
        </Button>
      </Toolbar>

      <div className="mt-5 grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Total Rules", value: rules.length, variant: "secondary" },
          { label: "Active Rules", value: activeCount, variant: "success" },
          { label: "Hard Blocks", value: rules.filter((r) => r.enforcement === "hard_block" && r.is_active).length, variant: "destructive" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between py-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <Badge variant={stat.variant as "secondary" | "success" | "destructive"} appearance="light" size="md">
                {stat.value}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardHeading>
            <ShieldOff className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">{rules.length} rules</span>
          </CardHeading>
          <CardToolbar />
        </CardHeader>
        <CardTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Conflict Type</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Enforcement</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Created</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No SoD rules defined
                  </TableCell>
                </TableRow>
              )}
              {rules.map((r) => (
                <TableRow key={r.id} className={!r.is_active ? "opacity-50" : ""}>
                  <TableCell>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[220px]">{r.description}</p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {CONFLICT_TYPE_LABELS[r.conflict_type]}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="secondary" appearance="outline" size="sm">{r.subject_a}</Badge>
                      <span className="text-muted-foreground text-xs">↔</span>
                      <Badge variant="secondary" appearance="outline" size="sm">{r.subject_b}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ENFORCEMENT_VARIANTS[r.enforcement]} appearance="light" size="sm">
                      {ENFORCEMENT_LABELS[r.enforcement]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={r.is_active} onCheckedChange={() => toggleActive(r.id)} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.created_at}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(r)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(r.id)}
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
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editId ? "Edit SoD Rule" : "New SoD Rule"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-6">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Rule Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Finance cannot approve own billing"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Conflict Type</Label>
              <Select
                value={form.conflict_type}
                onValueChange={(v) =>
                  setForm({ ...form, conflict_type: v as ConflictType, subject_a: "", subject_b: "" })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CONFLICT_TYPE_LABELS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {subjectLabel(form.conflict_type, "a")} *
                </Label>
                <Select value={form.subject_a} onValueChange={(v) => setForm({ ...form, subject_a: v })}>
                  <SelectTrigger className="text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    {subjectOptions(form.conflict_type, "a").map((o) => (
                      <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {subjectLabel(form.conflict_type, "b")} *
                </Label>
                <Select value={form.subject_b} onValueChange={(v) => setForm({ ...form, subject_b: v })}>
                  <SelectTrigger className="text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    {subjectOptions(form.conflict_type, "b").map((o) => (
                      <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Enforcement</Label>
              <Select
                value={form.enforcement}
                onValueChange={(v) => setForm({ ...form, enforcement: v as Enforcement })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hard_block">Hard Block — prevents assignment</SelectItem>
                  <SelectItem value="soft_warning">Soft Warning — warns but allows</SelectItem>
                  <SelectItem value="audit_only">Audit Only — logs the violation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Explain why these subjects conflict…"
                className="resize-none min-h-[72px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
              <Label className="text-sm">Active</Label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSave}
                disabled={!form.name || !form.subject_a || !form.subject_b}
              >
                {editId ? "Save Changes" : "Create Rule"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete SoD rule?</AlertDialogTitle>
            <AlertDialogDescription>
              This rule will be permanently removed. Conflicting assignments will no longer be flagged.
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
