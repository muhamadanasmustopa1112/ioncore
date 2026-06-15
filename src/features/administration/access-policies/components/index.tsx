"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { resolvePermissionDisplay } from "@/lib/permission-labels";

const _unusedColumns: ColumnDef<AccessPolicy>[] = [
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
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<AccessPolicy>[]>(() => [
    {
      id: "role",
      header: t("administration.accessPoliciesPage.colRole"),
      accessorFn: (r) => r.role?.name ?? "—",
      cell: ({ row }) => <span className="font-medium">{row.original.role?.name ?? "—"}</span>,
    },
    {
      id: "permission",
      header: t("administration.accessPoliciesPage.colPermission"),
      accessorFn: (r) =>
        r.permission ? resolvePermissionDisplay(r.permission, t).title : "—",
      cell: ({ row }) => {
        const perm = row.original.permission;
        if (!perm) return <span>—</span>;
        const display = resolvePermissionDisplay(perm, t);
        return (
          <div className="min-w-0">
            <p className="text-sm font-medium">{display.title}</p>
            <p className="text-[10px] font-mono text-muted-foreground">{display.technicalName}</p>
          </div>
        );
      },
    },
    {
      id: "resource",
      header: t("administration.accessPoliciesPage.colResource"),
      accessorFn: (r) => r.permission?.resource ?? "—",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">{row.original.permission?.resource ?? "—"}</span>
      ),
    },
    {
      id: "action",
      header: t("administration.accessPoliciesPage.colAction"),
      accessorFn: (r) => r.permission?.action ?? "—",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">{row.original.permission?.action ?? "—"}</span>
      ),
    },
    {
      id: "effect",
      header: t("administration.accessPoliciesPage.colEffect"),
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
      header: t("administration.accessPoliciesPage.colCreated"),
      accessorFn: (r) => r.created_at ?? "",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : "—"}
        </span>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [t]);
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
    columns: columns,
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
      toast.error(t("administration.accessPoliciesPage.toastValidation"));
      return;
    }
    try {
      await createPolicy(form as CreateAccessPolicyRequest);
      toast.success(t("administration.accessPoliciesPage.toastSuccess"));
      setSheetOpen(false);
      setForm({ effect: "allow" });
    } catch {
      toast.error(t("administration.accessPoliciesPage.toastFailed"));
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: t("administration.accessPoliciesPage.breadcrumbAdmin"), path: paths.dashboard.administration.branch.root.getHref() },
          { title: t("administration.accessPoliciesPage.breadcrumbTitle") },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            {t("administration.accessPoliciesPage.title")}
          </ToolbarTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t("administration.accessPoliciesPage.desc")}
          </p>
        </ToolbarHeading>
        <Button variant="primary" onClick={() => setSheetOpen(true)}>
          <Plus className="size-4" /> {t("administration.accessPoliciesPage.newPolicyBtn")}
        </Button>
      </Toolbar>

      <DataGrid
        table={table}
        recordCount={total}
        tableLayout={{ cellBorder: true }}
        isLoading={isLoading}
        emptyMessage={t("administration.accessPoliciesPage.empty")}
      >
        <Card className="mt-5">
          <CardHeader>
            <CardHeading>
              <Shield className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">{total} {t("administration.accessPoliciesPage.policiesCount")}</span>
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
            <SheetTitle>{t("administration.accessPoliciesPage.sheetTitle")}</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-6 px-1">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">{t("administration.accessPoliciesPage.labelRole")}</Label>
              <Select value={form.role_id ?? ""} onValueChange={(v) => setForm({ ...form, role_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t("administration.accessPoliciesPage.placeholderRole")} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">{t("administration.accessPoliciesPage.labelPermission")}</Label>
              <Select value={form.permission_id ?? ""} onValueChange={(v) => setForm({ ...form, permission_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t("administration.accessPoliciesPage.placeholderPermission")} />
                </SelectTrigger>
                <SelectContent>
                  {permissions.map((p) => {
                    const display = resolvePermissionDisplay(p, t);
                    return (
                      <SelectItem key={p.id} value={p.id}>
                        <span className="block">{display.title}</span>
                        <span className="block text-[10px] font-mono text-muted-foreground">
                          {display.technicalName}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">{t("administration.accessPoliciesPage.labelEffect")}</Label>
              <Select value={form.effect ?? "allow"} onValueChange={(v) => setForm({ ...form, effect: v as "allow" | "deny" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">{t("administration.accessPoliciesPage.effectAllow")}</SelectItem>
                  <SelectItem value="deny">{t("administration.accessPoliciesPage.effectDeny")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setSheetOpen(false)} className="flex-1">{t("administration.accessPoliciesPage.cancel")}</Button>
              <Button variant="primary" onClick={handleCreate} disabled={isPending} className="flex-1">
                {t("administration.accessPoliciesPage.createBtn")}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
