"use client";

import { useState } from "react";
import { Plus, Clock, ShieldPlus, Trash2, CheckCircle2, XCircle } from "lucide-react";
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
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";

type ExceptionStatus = "pending" | "active" | "expired" | "revoked";

interface AccessException {
  id: string;
  user_name: string;
  user_id: string;
  elevated_role: string;
  reason: string;
  requested_by: string;
  approved_by?: string;
  status: ExceptionStatus;
  valid_from: string;
  valid_until: string;
  created_at: string;
}

const STATUS_VARIANTS: Record<ExceptionStatus, "warning" | "success" | "secondary" | "destructive"> = {
  pending: "warning",
  active: "success",
  expired: "secondary",
  revoked: "destructive",
};

const ROLES = ["super_admin", "admin", "noc", "sales", "technician", "finance", "cs_agent"];

const SEED: AccessException[] = [
  {
    id: "1",
    user_name: "Budi Santoso",
    user_id: "usr-001",
    elevated_role: "admin",
    reason: "Covering for admin who is on leave, needs to approve pending schema publishes.",
    requested_by: "HR Manager",
    approved_by: "super_admin",
    status: "active",
    valid_from: "2026-04-20",
    valid_until: "2026-04-30",
    created_at: "2026-04-19",
  },
  {
    id: "2",
    user_name: "Sari Dewi",
    user_id: "usr-002",
    elevated_role: "finance",
    reason: "Temporary access to process end-of-quarter billing corrections.",
    requested_by: "Finance Lead",
    status: "pending",
    valid_from: "2026-04-26",
    valid_until: "2026-04-28",
    created_at: "2026-04-25",
  },
];

const EMPTY_FORM = {
  user_name: "",
  user_id: "",
  elevated_role: "",
  reason: "",
  requested_by: "",
  valid_from: "",
  valid_until: "",
};

export function AccessExceptionPage() {
  const [exceptions, setExceptions] = useState<AccessException[]>(SEED);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ExceptionStatus | "all">("all");
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const filtered =
    statusFilter === "all" ? exceptions : exceptions.filter((e) => e.status === statusFilter);

  const handleCreate = () => {
    if (!form.user_name || !form.elevated_role || !form.reason) return;
    setExceptions((prev) => [
      ...prev,
      {
        ...form,
        id: Date.now().toString(),
        status: "pending" as ExceptionStatus,
        created_at: new Date().toISOString().slice(0, 10),
      },
    ]);
    setForm({ ...EMPTY_FORM });
    setSheetOpen(false);
  };

  const approve = (id: string) =>
    setExceptions((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: "active", approved_by: "super_admin" } : e,
      ),
    );

  const revoke = (id: string) =>
    setExceptions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "revoked" } : e)),
    );

  const remove = (id: string) =>
    setExceptions((prev) => prev.filter((e) => e.id !== id));

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "Access Exceptions" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Access Exception & Temporary Elevation
          </ToolbarTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Grant time-limited role elevation to users for specific needs
          </p>
        </ToolbarHeading>
        <Button variant="primary" onClick={() => setSheetOpen(true)}>
          <Plus className="size-4" /> New Exception
        </Button>
      </Toolbar>

      <Card className="mt-5">
        <CardHeader>
          <CardHeading>
            <ShieldPlus className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">{exceptions.length} exceptions</span>
          </CardHeading>
          <CardToolbar>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ExceptionStatus | "all")}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </CardToolbar>
        </CardHeader>
        <CardTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Elevated Role</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No exceptions found
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((ex) => {
                const isExpiredByDate = ex.valid_until < today && ex.status === "active";
                const displayStatus: ExceptionStatus = isExpiredByDate ? "expired" : ex.status;
                return (
                  <TableRow key={ex.id}>
                    <TableCell>
                      <p className="font-medium">{ex.user_name}</p>
                      <p className="text-xs text-muted-foreground">{ex.user_id}</p>
                    </TableCell>
                    <TableCell className="capitalize">{ex.elevated_role.replace(/_/g, " ")}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {ex.valid_from} → {ex.valid_until}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[displayStatus]} appearance="light" size="sm" className="capitalize">
                        {displayStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{ex.requested_by}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{ex.approved_by ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {ex.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-success hover:text-success"
                            onClick={() => approve(ex.id)}
                            title="Approve"
                          >
                            <CheckCircle2 className="size-3.5" />
                          </Button>
                        )}
                        {ex.status === "active" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => revoke(ex.id)}
                            title="Revoke"
                          >
                            <XCircle className="size-3.5" />
                          </Button>
                        )}
                        {(ex.status === "expired" || ex.status === "revoked") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={() => remove(ex.id)}
                            title="Remove"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardTable>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>New Access Exception</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-6">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">User Name *</Label>
              <Input
                value={form.user_name}
                onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                placeholder="Full name of the user"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">User ID</Label>
              <Input
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                placeholder="e.g. usr-123"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Elevated Role *</Label>
              <Select
                value={form.elevated_role}
                onValueChange={(v) => setForm({ ...form, elevated_role: v })}
              >
                <SelectTrigger><SelectValue placeholder="Select role to elevate to…" /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="capitalize">
                      {r.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Valid From *</Label>
                <Input
                  type="date"
                  value={form.valid_from}
                  onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Valid Until *</Label>
                <Input
                  type="date"
                  value={form.valid_until}
                  onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Requested By</Label>
              <Input
                value={form.requested_by}
                onChange={(e) => setForm({ ...form, requested_by: e.target.value })}
                placeholder="e.g. HR Manager"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Reason *</Label>
              <Textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Why is this temporary elevation needed?"
                className="resize-none min-h-[80px]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleCreate}
                disabled={!form.user_name || !form.elevated_role || !form.reason}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
