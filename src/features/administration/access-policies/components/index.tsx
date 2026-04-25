"use client";

import { useState } from "react";
import { Plus, Shield } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from "@/components/ui/card";
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
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useAccessPolicies, useCreateAccessPolicy } from "@/features/user-service/api/access-policies";
import { useRoles } from "@/features/user-service/api/roles";
import { usePermissions } from "@/features/user-service/api/permissions";
import type { CreateAccessPolicyRequest } from "@/features/user-service/types";

export function AccessPoliciesPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<Partial<CreateAccessPolicyRequest>>({ effect: "allow" });

  const { data: policiesResp, isLoading } = useAccessPolicies({ per_page: 100 });
  const { data: rolesResp } = useRoles({ per_page: 100 });
  const { data: permsResp } = usePermissions({ per_page: 100 });
  const { mutateAsync: createPolicy, isPending } = useCreateAccessPolicy();

  const policies = Array.isArray(policiesResp?.data) ? policiesResp.data : [];
  const roles = Array.isArray(rolesResp?.data) ? rolesResp.data : [];
  const permissions = Array.isArray(permsResp?.data) ? permsResp.data : [];

  const handleCreate = async () => {
    if (!form.role_id || !form.permission_id || !form.effect) {
      toast.error("Role, permission, and effect are required");
      return;
    }
    try {
      await createPolicy(form as CreateAccessPolicyRequest);
      toast.success("Access policy created");
      setSheetOpen(false);
      setForm({ effect: "allow" });
    } catch {
      toast.error("Failed to create access policy");
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "Access Policies" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Access Policies
          </ToolbarTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Role ↔ permission bindings with allow / deny effect
          </p>
        </ToolbarHeading>
        <Button variant="primary" onClick={() => setSheetOpen(true)}>
          <Plus className="size-4" /> New Policy
        </Button>
      </Toolbar>

      <Card className="mt-5">
        <CardHeader>
          <CardHeading>
            <Shield className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">{policies.length} policies</span>
          </CardHeading>
          <CardToolbar />
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Permission</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Effect</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && policies.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No policies defined yet
                    </TableCell>
                  </TableRow>
                )}
                {policies.map((p) => (
                  <TableRow key={p.id ?? `${p.role?.id}-${p.permission?.id}`}>
                    <TableCell className="font-medium">{p.role?.name ?? "—"}</TableCell>
                    <TableCell>{p.permission?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{p.permission?.resource ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{p.permission?.action ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={p.effect === "allow" ? "success" : "destructive"}
                        appearance="light"
                        size="sm"
                        className="capitalize"
                      >
                        {p.effect}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>New Access Policy</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-6 px-1">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Role</Label>
              <Select value={form.role_id ?? ""} onValueChange={(v) => setForm({ ...form, role_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Permission</Label>
              <Select value={form.permission_id ?? ""} onValueChange={(v) => setForm({ ...form, permission_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  {permissions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name || `${p.resource}.${p.action}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Effect</Label>
              <Select value={form.effect ?? "allow"} onValueChange={(v) => setForm({ ...form, effect: v as "allow" | "deny" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setSheetOpen(false)} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleCreate} disabled={isPending} className="flex-1">
                Create Policy
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
