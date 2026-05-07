"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus, Shield } from "lucide-react";
import { toast } from "sonner";
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
import { getPageCount } from "@/lib/pagination";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useAccessPolicies, useCreateAccessPolicy } from "@/features/user-service/api/access-policies";
import { useRoles } from "@/features/user-service/api/roles";
import { usePermissions } from "@/features/user-service/api/permissions";
import type { AccessPolicy, CreateAccessPolicyRequest } from "@/features/user-service/types";

const columns: ColumnDef<AccessPolicy>[] = [
  {
    id: "role",
    header: "Role",
    accessorFn: (r) => r.role?.name ?? "—",
    cell: ({ row }) => <span className="font-medium">{row.original.role?.name ?? "—"}</span>,
  },
  {
    id: "permission",
    header: "Permission",
    accessorFn: (r) => r.permission?.name ?? "—",
  },
  {
    id: "resource",
    header: "Resource",
    accessorFn: (r) => r.permission?.resource ?? "—",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">{row.original.permission?.resource ?? "—"}</span>
    ),
  },
  {
    id: "action",
    header: "Action",
    accessorFn: (r) => r.permission?.action ?? "—",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">{row.original.permission?.action ?? "—"}</span>
    ),
  },
  {
    id: "effect",
    header: "Effect",
    accessorFn: (r) => r.effect,
    cell: ({ row }) => (
      <Badge
        variant={row.original.effect === "allow" ? "success" : "destructive"}
        appearance="light"
        size="sm"
        className="capitalize"
      >
        {row.original.effect}
      </Badge>
    ),
  },
  {
    id: "created",
    header: "Created",
    accessorFn: (r) => r.created_at ?? "",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : "—"}
      </span>
    ),
  },
];

export function AccessPoliciesPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<Partial<CreateAccessPolicyRequest>>({ effect: "allow" });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const { data: policiesResp, isLoading } = useAccessPolicies({
    page: pagination.page,
    per_page: pagination.limit,
  });
  const { data: rolesResp } = useRoles({ per_page: 100 });
  const { data: permsResp } = usePermissions({ per_page: 100 });
  const { mutateAsync: createPolicy, isPending } = useCreateAccessPolicy();

  const policies = useMemo<AccessPolicy[]>(
    () => (Array.isArray(policiesResp?.data) ? policiesResp.data : []),
    [policiesResp],
  );
  const roles = Array.isArray(rolesResp?.data) ? rolesResp.data : [];
  const permissions = Array.isArray(permsResp?.data) ? permsResp.data : [];
  const total = policiesResp?.metadata?.total ?? policies.length;

  const table = useReactTable({
    columns,
    data: policies,
    manualPagination: true,
    pageCount: getPageCount(policiesResp?.metadata, pagination.limit) || 1,
    getRowId: (row) => row.id ?? `${row.role?.id}-${row.permission?.id}`,
    state: {
      pagination: { pageIndex: pagination.page - 1, pageSize: pagination.limit },
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function"
        ? updater({ pageIndex: pagination.page - 1, pageSize: pagination.limit })
        : updater;
      setPagination({ page: next.pageIndex + 1, limit: next.pageSize });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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

      <DataGrid
        table={table}
        recordCount={total}
        tableLayout={{ cellBorder: true }}
        isLoading={isLoading}
        emptyMessage="No policies defined yet"
      >
        <Card className="mt-5">
          <CardHeader>
            <CardHeading>
              <Shield className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">{total} policies</span>
            </CardHeading>
            <CardToolbar />
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridContainer className="w-full">
                <DataGridTable />
              </DataGridContainer>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination setFilter={setPagination} filter={pagination} />
          </CardFooter>
        </Card>
      </DataGrid>

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
