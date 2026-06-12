"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Database, Loader2, Plus, RefreshCw, Shield } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { RBAC_PERMISSION_SEED } from "@/config/rbac-permission-seed";
import {
  useCreatePermission,
  usePermissions,
  useSeedRbacPermissions,
} from "@/features/user-service/api/permissions";
import type { CreatePermissionRequest, Permission } from "@/features/user-service/types";
import { getPageCount } from "@/lib/pagination";

const EMPTY_FORM: CreatePermissionRequest = {
  name: "",
  resource: "",
  action: "",
  description: "",
};

function buildName(resource: string, action: string) {
  const r = resource.trim();
  const a = action.trim();
  if (!r || !a) return "";
  return `${r}.${a}`;
}

export function PermissionsPage() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<CreatePermissionRequest>(EMPTY_FORM);

  const { data: permissionsResp, isLoading } = usePermissions({
    page: pagination.page,
    per_page: pagination.limit,
  });
  const { mutateAsync: createPermission, isPending: isCreating } = useCreatePermission();
  const { mutateAsync: seedPermissions, isPending: isSeeding } = useSeedRbacPermissions();

  const permissions = permissionsResp?.data ?? [];

  const columns = useMemo<ColumnDef<Permission>[]>(
    () => [
      {
        id: "name",
        accessorFn: (row) => row.name,
        header: t("administration.permissions.colName", "Name"),
        cell: ({ row }) => (
          <span className="font-medium font-mono text-xs">{row.original.name}</span>
        ),
      },
      {
        id: "resource",
        accessorFn: (row) => row.resource,
        header: t("administration.permissions.colResource", "Resource"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">{row.original.resource ?? "—"}</span>
        ),
      },
      {
        id: "action",
        accessorFn: (row) => row.action,
        header: t("administration.permissions.colAction", "Action"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">{row.original.action ?? "—"}</span>
        ),
      },
      {
        id: "description",
        accessorFn: (row) => row.description,
        header: t("administration.permissions.colDescription", "Description"),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground line-clamp-2">
            {row.original.description ?? "—"}
          </span>
        ),
      },
    ],
    [t],
  );

  const table = useReactTable({
    columns,
    data: permissions,
    manualPagination: true,
    pageCount: getPageCount(permissionsResp?.metadata, pagination.limit) || 1,
    getRowId: (row) => row.id,
    state: {
      pagination: { pageIndex: pagination.page - 1, pageSize: pagination.limit },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: pagination.page - 1, pageSize: pagination.limit })
          : updater;
      setPagination({ page: next.pageIndex + 1, limit: next.pageSize });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleCreate = async () => {
    const name = form.name.trim() || buildName(form.resource, form.action);
    if (!name || !form.resource.trim() || !form.action.trim()) {
      toast.error(t("administration.permissions.formInvalid", "Name, resource, and action are required"));
      return;
    }
    try {
      await createPermission({
        name,
        resource: form.resource.trim(),
        action: form.action.trim(),
        description: form.description.trim() || `Permission: ${name}`,
      });
      toast.success(t("administration.permissions.created", "Permission created"));
      setSheetOpen(false);
      setForm(EMPTY_FORM);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t("administration.permissions.createFailed", "Failed to create permission");
      toast.error(message);
    }
  };

  const handleSeed = async () => {
    try {
      const result = await seedPermissions();
      toast.success(
        t("administration.permissions.seedDone", {
          created: result.created,
          skipped: result.skipped,
          failed: result.failed,
          defaultValue: `Synced: ${result.created} created, ${result.skipped} skipped, ${result.failed} failed`,
        }),
      );
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t("administration.permissions.seedFailed", "Failed to sync RBAC permissions");
      toast.error(message);
    }
  };

  const busy = isCreating || isSeeding;
  const previewName = form.name.trim() || buildName(form.resource, form.action);

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.administration"),
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: t("administration.permissions.title", "Permissions") },
        ]}
      />

      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("administration.permissions.title", "Permissions")}
          </ToolbarTitle>
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-sm font-medium">
            <Badge variant="info" appearance="light" className="h-6 px-2.5 gap-1.5 border-none font-semibold">
              <Shield className="size-3.5" />
              {permissionsResp?.metadata?.total ?? permissions.length}{" "}
              {t("administration.permissions.records", "permissions")}
            </Badge>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground font-normal">
              {t("administration.permissions.subtitle", "RBAC catalog for menu, routes, and actions")}
            </span>
          </div>
        </ToolbarHeading>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleSeed} disabled={busy}>
            {isSeeding ? <Loader2 className="size-4 animate-spin" /> : <Database className="size-4" />}
            {t("administration.permissions.syncCatalog", "Sync RBAC Catalog")} ({RBAC_PERMISSION_SEED.length})
          </Button>
          <Button variant="primary" onClick={() => setSheetOpen(true)} disabled={busy}>
            <Plus className="size-4" />
            {t("administration.permissions.add", "Add Permission")}
          </Button>
        </div>
      </Toolbar>

      <Card className="mt-5">
        <CardHeader>
          <CardHeading>
            <span className="text-sm font-semibold">
              {t("administration.permissions.listTitle", "Permission Registry")}
            </span>
          </CardHeading>
          <CardToolbar>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.resetPageIndex()}
              disabled={isLoading}
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </CardToolbar>
        </CardHeader>
        <DataGrid table={table} recordCount={permissionsResp?.metadata?.total ?? permissions.length}>
          <CardTable>
            <ScrollArea className="w-full">
              <DataGridContainer>
                <DataGridTable />
              </DataGridContainer>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination setFilter={setPagination} filter={pagination} />
          </CardFooter>
        </DataGrid>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={(open) => !busy && setSheetOpen(open)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t("administration.permissions.addTitle", "Create Permission")}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 px-4 pb-4">
            <div className="space-y-2">
              <Label className="text-xs">{t("administration.permissions.colResource", "Resource")} *</Label>
              <Input
                value={form.resource}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, resource: e.target.value }))
                }
                placeholder="orders"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">{t("administration.permissions.colAction", "Action")} *</Label>
              <Input
                value={form.action}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, action: e.target.value }))
                }
                placeholder="read_all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">{t("administration.permissions.colName", "Name")}</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={previewName || "orders.read_all"}
              />
              <p className="text-[11px] text-muted-foreground">
                {t("administration.permissions.nameHint", "Leave empty to auto-generate as resource.action")}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">{t("administration.permissions.colDescription", "Description")}</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder={t("administration.permissions.descriptionPlaceholder", "What this permission allows")}
                className="min-h-20 resize-none"
              />
            </div>
          </div>
          <SheetFooter className="px-4 pb-4">
            <Button variant="outline" onClick={() => setSheetOpen(false)} disabled={busy}>
              {t("common.cancel")}
            </Button>
            <Button variant="primary" onClick={handleCreate} disabled={busy}>
              {isCreating && <Loader2 className="size-4 animate-spin" />}
              {t("common.create")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
