# ION Broadband — Agent Instructions

## Project Overview

**ION Core** is an ISP Enterprise Management System built with Next.js 15 (App Router), React 19, TypeScript (strict), shadcn/ui, Tailwind CSS 4, Zustand 5, TanStack Query 5, and React Hook Form + Zod 4. Deployed on Netlify.

Architecture: **feature-based (domain-driven)** with centralized infrastructure. Backend is microservices (12+ services) proxied through Next.js rewrites.

## Product Requirements (PRD)

All feature requirements and business rules are defined in `.opencode/PRD-Master.md`. **Before building any new feature, read the relevant PRD section first** to understand:
- Business flows and user roles
- Schema-driven behavior (Onboarding, Billing, Service, Commission, Suspension)
- Branch hierarchy rules (Regional → Area → Sub Area)
- Module-specific requirements and integration points

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm format       # Prettier format
pnpm add <pkg>    # Install new package (ALWAYS use pnpm, NEVER npm)
```

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router (routes only)
│   ├── (auth)/             # Public auth pages
│   ├── (protected)/        # Authenticated pages (all business features)
│   └── api/s3-upload/      # Only API route (S3 upload proxy)
├── components/
│   ├── ui/                 # shadcn/ui primitives (85+ components) — DO NOT EDIT
│   ├── shared/             # Shared feature patterns (DataTable, dialogs, search)
│   ├── common/             # App-wide (ContentHeader, Toolbar, PageBreadcrumb)
│   └── error/              # Error boundaries, loading, empty states
├── features/[domain]/      # Domain feature modules
│   └── [feature]/
│       ├── api/            # API functions + React Query hooks + keys
│       ├── components/     # Feature UI components
│       ├── store/          # Zustand state
│       ├── types/          # TypeScript interfaces + Zod schemas
│       ├── data/           # Mock/dummy data (temporary)
│       └── hooks/          # Custom hooks (optional)
├── config/                 # App configuration
│   ├── paths.ts            # ALL route paths (type-safe) — single source of truth
│   ├── constants.ts        # Service base paths, auth keys, device types
│   ├── menu.ts             # Navigation menu definitions
│   └── env.ts              # Zod-validated env vars
├── lib/                    # Infrastructure layer
│   ├── api-client.ts       # Axios instance with auth interceptor + token refresh
│   ├── auth.tsx             # react-query-auth (useUser, useLogin, useLogout, ProtectedRoute)
│   ├── permissions.tsx      # RBAC (useCan, <Can>, <PageGuard>, filterMenuByPermissions)
│   ├── token.ts             # generateToken + refreshToken
│   ├── crypto.ts            # AES-256-CBC encryption (server-only)
│   ├── s3-upload.ts         # Client-side S3 upload helpers
│   └── utils.ts             # cn() utility
├── hooks/                  # Global React hooks (useFcm, useMenu, useIsMobile, etc.)
├── store/                  # Global Zustand stores (auth-store, layout, notifications)
├── types/                  # Global types (BaseResponse, BaseListRequest, AuthUser)
├── i18n/                   # Internationalization (en/id)
└── middleware.ts            # Edge auth guard (cookie-based route protection)
```

### Feature Module Standard

Every feature MUST follow this structure (reference: `src/features/noc/router/`):

```
features/[domain]/[feature-name]/
├── api/
│   ├── keys.ts                    # TanStack Query keys
│   ├── get-{items}.ts            # GET list query hook (useQuery)
│   ├── get-{item}.ts             # GET detail query hook (useQuery)
│   ├── post-{item}.ts            # POST mutation hook + Zod schema
│   ├── put-{item}.ts             # PUT/PATCH mutation hook
│   └── delete-{item}.ts          # DELETE mutation hook
├── components/
│   ├── index.tsx                  # Page-level component (toolbar + list + sheet)
│   ├── form/
│   │   ├── {item}-form.tsx           # Form (forwardRef + useImperativeHandle)
│   │   └── {item}-form-sheet.tsx     # Sheet wrapper (header + body + footer)
│   └── list/
│       ├── {item}-list.tsx           # List (DataGrid + table + pagination)
│       └── table/
│           ├── columns.tsx                  # Column definitions
│           ├── data-table-actions-cell.tsx  # Row action dropdown + delete dialog
│           └── data-table-toolbar.tsx       # Column visibility toolbar
├── data/
│   └── dummy-{items}.ts          # Dummy/seed data for development
├── store/
│   └── {item}.ts                 # Zustand store (form mode, sheet state, selected item)
└── types/
    ├── index.ts                  # Barrel export
    └── {item}.ts                # Type definitions (Item, Response, Params, Request)
```

**IMPORTANT:**
- Feature module = **root folder** (`features/[domain]/[feature]/`), NOT inside `components/`
- Legacy pattern: `components/[feature]/` — **DO NOT USE** for new features
- New pattern: `features/[domain]/[feature]/` — self-contained module with api/, components/, store/, data/, types/

### Route Standard

Every route MUST have `loading.tsx`. Section-level routes MUST have `not-found.tsx`.

Dynamic route params: **always use `[id]`**, never custom names like `[customerId]`.

Route paths: **always import from `@/config/paths.ts`**, never hardcode.

```
app/(protected)/[domain]/[feature]/
├── loading.tsx
├── not-found.tsx
├── page.tsx                     # List/index
├── create/
│   └── page.tsx                 # Create form
└── [id]/
    ├── loading.tsx
    ├── page.tsx                  # Detail page
    └── edit/
        └── page.tsx              # Edit form
```

### Page.tsx Template (CRITICAL)

**NEVER** put business logic in `page.tsx`. It MUST be a thin `Suspense` wrapper:

```tsx
// app/(protected)/[domain]/[feature]/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { FeatureListPage } from "@/features/[domain]/[feature]/components";

export const metadata: Metadata = {
  title: "Feature Name",
  description: "Description here.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <FeatureListPage />
    </Suspense>
  );
}
```

### List Page Component Pattern

The `{Feature}ListPage` in `components/index.tsx` handles Toolbar + Breadcrumb + List:

```tsx
// features/[domain]/[feature]/components/index.tsx
"use client";

import { useTranslation } from "react-i18next";
import { RiAddLine, RiDownloadLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { FeatureList } from "./list/feature-list";
import { useFeatureStore } from "../store/feature";
import { FeatureFormSheet } from "./form/feature-form-sheet";

export function FeatureListPage() {
  const { t } = useTranslation();
  const { openFormSheet } = useFeatureStore();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb items={[
        { title: t("menu.domain"), path: paths.dashboard.domain.root.getHref() },
        { title: t("menu.feature") },
      ]} />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{t("feature.title")}</ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
            <RiDownloadLine className="size-4" />
            {t("common.exportData", "Export Data")}
          </Button>
          <Button variant="primary" className="h-11 px-6 font-semibold shadow-md" onClick={() => openFormSheet("new")}>
            <RiAddLine className="size-5" />
            {t("feature.addNew", "Add New")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="flex-1 overflow-auto mt-4">
        <FeatureList />
      </div>
      <FeatureFormSheet />
    </div>
  );
}
```

### List Component Pattern (DataGrid + nuqs + Pagination)

The `{feature}-list.tsx` handles DataGrid, URL-persisted filters, and pagination:

```tsx
// features/[domain]/[feature]/components/list/feature-list.tsx
"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, RowSelectionState, useReactTable } from "@tanstack/react-table";
import { Filter, Search, X } from "lucide-react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardHeading, CardTable } from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFeatures } from "../../api/get-features";
import { useFeatureColumns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { FeatureItem } from "../../types";

export function FeatureList() {
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useFeatureColumns();

  const params = useMemo(() => ({
    draw: 1,
    start: (filter.page - 1) * filter.limit,
    length: filter.limit,
    search: filter.search || "",
  }), [filter]);

  const { data: featureData, isLoading, isFetching } = useFeatures({ params });

  const data = useMemo(() => featureData?.data ?? [], [featureData]);
  const metadata = useMemo(() => featureData?.metadata, [featureData]);

  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));

  const table = useReactTable({
    columns,
    data,
    pageCount: metadata?.total_page ?? 0,
    getRowId: (row: FeatureItem) => String(row.id),
    state: {
      pagination: { pageIndex: filter.page - 1, pageSize: filter.limit },
      columnOrder,
      rowSelection,
    },
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  return (
    <DataGrid table={table} recordCount={metadata?.total_data || 0} tableLayout={{
      columnsPinnable: true, columnsMovable: true, columnsVisibility: true, columnsResizable: true, cellBorder: true,
    }} isLoading={isLoading || isFetching}>
      <Card className="mt-[10px]">
        <CardHeader>
          <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
            <CardHeading className="py-4">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline"><Filter />{t("common.filter")}</Button>
                </CollapsibleTrigger>
                <div className="relative">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input placeholder={t("feature.searchPlaceholder")} value={filter.search || ""} onChange={(e) => setFilter({ ...filter, search: e.target.value })} className="w-40 ps-9" />
                  {filter.search && (
                    <Button mode="icon" variant="ghost" className="absolute end-1.5 top-1/2 h-6 w-6 -translate-y-1/2" onClick={() => setFilter({ ...filter, search: "" })}><X /></Button>
                  )}
                </div>
              </div>
              <CollapsibleContent>
                <div className="flex items-center gap-2 py-[5px] text-sm text-muted-foreground">{t("feature.noFilters", "No advanced filters defined yet.")}</div>
              </CollapsibleContent>
            </CardHeading>
          </Collapsible>
          <DataTableToolbar />
        </CardHeader>
        <CardTable>
          <ScrollArea><DataGridContainer className="w-full"><DataGridTable /></DataGridContainer><ScrollBar orientation="horizontal" /></ScrollArea>
        </CardTable>
        <CardFooter><DataGridPagination setFilter={setFilter} filter={filter} /></CardFooter>
      </Card>
    </DataGrid>
  );
}
```

### Table Columns Pattern (with Skeleton)

Each column MUST define `meta.skeleton` for loading states:

```tsx
// features/[domain]/[feature]/components/list/table/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ActionsCell } from "./data-table-actions-cell";
import type { FeatureItem } from "../../../types";

export const useFeatureColumns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "name",
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("feature.name")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div className="font-medium text-foreground">{row.original.name}</div>,
      meta: { skeleton: <Skeleton className="h-4 w-32" /> },
      enableSorting: true,
      size: 200,
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.status")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <div>{row.original.status}</div>,
      meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
      enableSorting: true,
      size: 100,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("common.actions")} column={column} className="text-foreground font-semibold" />
      ),
      cell: ({ row }) => <ActionsCell row={row} />,
      meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
      enableSorting: false,
      size: 75,
    },
  ] as ColumnDef<FeatureItem>[];
};
```

**Skeleton width guidelines:**

| Content | Width | Height |
|---------|-------|--------|
| Short text (status, badge) | `w-16` to `w-24` | `h-4` to `h-5` |
| Medium text (name, code) | `w-28` to `w-36` | `h-4` |
| Long text (description) | `w-40` to `w-48` | `h-4` |
| Actions button | `w-8` | `h-8` |
| Badge/pill | `w-16` to `w-20` | `h-5` + `rounded-full` |

### Table Actions Pattern

Row actions use `data-table-actions-cell.tsx` with DropdownMenu + AlertDialog:

```tsx
// features/[domain]/[feature]/components/list/table/data-table-actions-cell.tsx
import { useState } from "react";
import { RiDeleteBin7Line, RiEditLine, RiEyeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FeatureItem } from "../../../types";
import { useFeatureStore } from "../../../store/feature";
import { useDeleteFeature } from "../../../api/delete-feature";

export function ActionsCell({ row }: { row: Row<FeatureItem> }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { openFormSheet, setSelectedItem } = useFeatureStore();
  const { mutate: deleteFeature, isPending: isDeleting } = useDeleteFeature({
    mutationConfig: { onSuccess: () => setShowDeleteDialog(false) },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost"><EllipsisVertical /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedItem(row.original); openFormSheet("edit"); }}>
            <RiEditLine /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedItem(row.original); openFormSheet("details"); }}>
            <RiEyeLine /> Detail
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => setShowDeleteDialog(true)}>
            <RiDeleteBin7Line /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete "{row.original.name}". This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteFeature({ id: String(row.original.id) })} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

### Data Table Toolbar Pattern

Column visibility toggle:

```tsx
// features/[domain]/[feature]/components/list/table/data-table-toolbar.tsx
"use client";

import { useTranslation } from "react-i18next";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardToolbar } from "@/components/ui/card";
import { useDataGrid } from "@/components/ui/data-grid";
import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";

export const DataTableToolbar = () => {
  const { t } = useTranslation();
  const { table } = useDataGrid();

  return (
    <CardToolbar>
      <DataGridColumnVisibility table={table} trigger={
        <Button variant="outline"><Settings2 />{t("common.chartLabels.view")}</Button>
      } />
    </CardToolbar>
  );
};
```

### Theme System (Dark/Light Mode)

Use `next-themes` with class-based dark mode. `ThemeProvider` wraps the app root.

```tsx
// src/components/layouts/context/theme-provider.tsx
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

**Tailwind patterns:**
```tsx
// ✅ CORRECT — use dark: prefix
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">

// ❌ WRONG — hardcoded colors
<div className="bg-white text-black">
```

**Conventions:**
- Use `dark:` Tailwind prefix for all dark mode overrides
- Prefer CSS variable-based theming (`--background`, `--foreground`, `--primary`)
- Avoid hardcoded colors — use `hsl(var(--<token>))` or Tailwind config
- `disableTransitionOnChange` prevents flash during theme switch

### Responsive Design Strategy

Mobile-first approach with a single breakpoint at `1024px`. Custom `useIsMobile` hook detects viewport width.

```tsx
// src/hooks/use-mobile.tsx
const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

**Breakpoint strategy:**

| Screen | Width | Layout |
|--------|-------|--------|
| Desktop | ≥ 1024px | Vertical sidebar + full table |
| Mobile | < 1024px | Horizontal sidebar + responsive table |

**Responsive patterns:**
```tsx
// ✅ CORRECT — use useIsMobile for layout switching
const isMobile = useIsMobile();
{isMobile ? <MobileSidebar /> : <DesktopSidebar />}

// ✅ CORRECT — responsive Tailwind classes
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

// ✅ CRITICAL — DataGrid horizontal scroll on mobile
<ScrollArea className="w-full">
  <DataGridContainer className="w-full min-w-[640px]">
    <DataGridTable />
  </DataGridContainer>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

**Mobile considerations:**
- Data tables use horizontal scroll, never collapse columns
- Forms use full-width fields on mobile, side-by-side on desktop
- Dialogs/Sheets use full-screen on mobile, slide-over on desktop
- Touch targets minimum 44px (accessibility)

### File Size Limit (AD-015)

Every source file MUST NOT exceed **300 lines** (including comments, blank lines, and imports).

**Exceptions:**
- Route configuration files (`paths.ts`)
- Constants/configuration files (`constants.ts`, `menu.ts`)
- Translation/i18n files (`*.json`)
- Mock/dummy data files (`data/dummy-*.ts`)
- Type definition barrel files (`types/index.ts`)

These files may exceed 300 lines but should still aim for reasonable size (max 500 lines).

**Splitting strategies:**

| File Type | Extraction Pattern | Example |
|-----------|-------------------|---------|
| Large component | Extract sub-components | `feature-list.tsx` → `feature-list-header.tsx`, `feature-list-body.tsx` |
| Complex form | Extract form sections | `feature-form.tsx` → `feature-form-basic.tsx`, `feature-form-advanced.tsx` |
| Table with many columns | Extract column groups | `columns.tsx` → `basic-columns.tsx`, `detail-columns.tsx` |
| Store with many actions | Split by domain | `store.ts` → `store-ui.ts`, `store-filters.ts` |
| Large utility file | Group by concern | `utils.ts` → `format-utils.ts`, `validation-utils.ts` |

**Enforcement:**
- Run `wc -l` on PR diff — flag files >300 lines
- Code review checklist: verify file size before merge
- ESLint rule (future): `max-lines: ["error", 300]`

## Critical Rules

### TypeScript

- **ZERO `any`** — use proper interfaces or `unknown`
- **ZERO `as` casts** — use type guards or proper typing
- **ZERO `// eslint-disable @typescript-eslint/no-explicit-any`**
- Use `z.infer<typeof schema>` for form data types
- Use `Record<string, unknown>` instead of `object` or `{}`
- Use generics `T extends BaseType` for reusable functions

### State Management

| State Type | Tool | When |
|-----------|------|------|
| Server state | TanStack Query (useQuery/useMutation) | API data, lists, details |
| Client UI state | Zustand (per-feature store) | Sheet open/close, selected item, filters |
| Form state | React Hook Form | All form fields |
| Global state | Zustand global stores | Layout, auth only |

**Never** use `useEffect` + `fetch` for API calls. Always use React Query hooks.

### API Layer

```typescript
// api/keys.ts — Query key factory
export const FEATURE_KEYS = {
  all: () => ["FEATURE"],
  root: () => ["FEATURE"],
  list: (args?) => [...FEATURE_KEYS.all(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [...FEATURE_KEYS.all(), "DETAIL", id],
  create: () => [...FEATURE_KEYS.all(), "CREATE"],
  update: (id: string) => [...FEATURE_KEYS.all(), "UPDATE", id],
  delete: (id: string) => [...FEATURE_KEYS.all(), "DELETE", id],
};

// api/get-{items}.ts — GET list query hook
// Use queryOptions() for SSR compatibility, useQuery in hook
export const get{Items}QueryOptions = (params: ItemParams) => {
  return queryOptions({
    queryKey: ITEM_KEYS.list(params),
    queryFn: () => get{Items}(params),
  });
};

// api/post-{item}.ts — POST mutation hook + Zod schema
// Use getQueryClient() (not useQueryClient()) for SSR compatibility
// Spread ...restConfig FIRST in useMutation
// Use exact: false, refetchType: "active" for invalidation
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ITEM_KEYS.all(),
    exact: false,
    refetchType: "active",
  });
};
```

### Auth & Permissions

- Route protection: `middleware.ts` (cookie-based) + `<ProtectedRoute>` component
- RBAC: `<Can>`, `<PageGuard>`, `useCan()`, `filterMenuByPermissions`
- Super admin bypasses all permission checks
- Auth tokens: cookies (`token`, `refresh_token`, `logged_in`), auto-refresh via `generateToken`

### Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Files | kebab-case | `bandwidth-list.tsx` |
| Stores | camelCase + `.ts` | `router.ts` |
| API files | verb-resource pattern | `get-routers.ts`, `post-router.ts` |
| Query key files | `keys.ts` | `keys.ts` |
| Query keys | SCREAMING_SNAKE + `_KEYS` | `BANDWIDTH_KEYS` |
| Entity types | PascalCase + `Item` | `BandwidthItem` |
| Response types | PascalCase + `Response` | `BandwidthListResponse` |
| Params types | PascalCase + `Params` | `BandwidthParams` |
| Request types | PascalCase + `Request` | `CreateBandwidthRequest` |
| Form data types | PascalCase + `FormData` | `BandwidthFormData` |

### Backend Services (Microservices)

API calls proxy through Next.js rewrites. Service base paths defined in `src/config/constants.ts`:

| Service | Base Path |
|---------|-----------|
| Authorization | `/ion-user-service` |
| HR | `/ion-user-service/hr` |
| IAM | `/ion-user-service/iam` |
| Networking | `/ion-networking-service` |
| User | `/ion-user-service/user` |
| Branch | `/ion-branch-service` |
| Rule Schema | `/ion-rule-scheme-service` |
| Product | `/ion-product-service` |
| Sales | `/ion-sales-service` |
| Order | `/ion-order-service` |
| Customer | `/ion-customer-service` |
| Technical | `/ion-technical-service` |
| Notification | `/ion-notification-service` |

### Performance

- Use `next/dynamic` for Leaflet, charts, heavy components
- Use `next/image` for all images
- Set `staleTime` per query type (static: 30min, realtime: 30s)
- Lazy load dialogs and sheets
- Use `ssr: false` for client-only components

### Security

- Validate ALL forms with Zod schemas
- NEVER hardcode secrets or API keys
- NEVER bypass TypeScript with `any` or `as`
- Sanitize user inputs in search fields
- Use `httpOnly` cookies for token storage
- All env vars validated via Zod in `src/config/env.ts`

## Code Review Checklist

### TypeScript & Type Safety
- [ ] ZERO `any` types — use proper interfaces or `unknown`
- [ ] ZERO `as` casts — use type guards or proper typing
- [ ] No `// eslint-disable` comments
- [ ] Use `z.infer<typeof schema>` for form data types
- [ ] Use `Record<string, unknown>` instead of `object` or `{}`
- [ ] Generics used properly (`T extends BaseType`)

### Feature Structure
- [ ] Follows feature module standard directory structure
- [ ] Barrel exports (`index.ts`) in each subfolder
- [ ] API keys: `api/keys.ts` with proper SCREAMING_SNAKE naming
- [ ] Zustand store for client UI state
- [ ] React Hook Form for form state (never use controlled inputs directly)
- [ ] TanStack Query for server state (never `useEffect` + `fetch`)

### API Layer
- [ ] Uses `queryOptions()` for SSR compatibility
- [ ] Uses `getQueryClient()` not `useQueryClient()` for SSR
- [ ] Mutation `onSuccess` uses `exact: false, refetchType: "active"`
- [ ] Query key factory follows standard pattern
- [ ] Proper `staleTime` set per query type

### Naming Conventions
- [ ] Files use kebab-case: `bandwidth-list.tsx`
- [ ] Stores use camelCase + `.ts`: `router.ts`
- [ ] API files use verb-resource: `get-routers.ts`
- [ ] Entity types use PascalCase + `Item`: `BandwidthItem`
- [ ] Query keys use SCREAMING_SNAKE + `_KEYS`

### i18n & Routes
- [ ] All user-facing strings use `t()` function
- [ ] Route paths imported from `@/config/paths.ts` (no hardcode)
- [ ] Dynamic routes use `[id]` not custom names

## Error Handling Standards

### Error Boundaries
- [ ] Error boundaries wrap feature-level components
- [ ] `<ErrorBoundary>` from `@/components/error`
- [ ] Custom fallback UI for each feature
- [ ] Error logged appropriately (not just swallowed)

### API Error Handling
- [ ] API calls wrapped with proper try/catch
- [ ] Axios interceptor handles token refresh
- [ ] User-friendly error messages via toast notifications
- [ ] Loading state managed during API calls
- [ ] `isError` and `error` handled in components

### Loading & Empty States
- [ ] `loading.tsx` in every route directory
- [ ] Skeleton loaders for async content
- [ ] Empty state component for lists with no data
- [ ] Disabled states for form submissions in progress

### User Feedback
- [ ] Toast notifications for success/error actions
- [ ] Form validation errors displayed inline
- [ ] Optimistic updates where appropriate
- [ ] Undo support for destructive actions

## Accessibility Standards

### Keyboard Navigation
- [ ] Tab order follows logical flow
- [ ] Focus visible on all interactive elements
- [ ] ` Escape` closes modals/sheets/dropdowns
- [ ] Arrow keys navigate menus and lists
- [ ] `Enter`/`Space` activates buttons

### ARIA Attributes
- [ ] `aria-label` on icon-only buttons
- [ ] `aria-expanded` on collapsible elements
- [ ] `aria-selected` on tabs/selections
- [ ] `aria-disabled` for disabled state
- [ ] `aria-live` for dynamic content updates
- [ ] Form inputs have associated labels

### Screen Reader Support
- [ ] Semantic HTML elements (`<button>`, `<nav>`, `<main>`)
- [ ] Heading hierarchy (h1 → h2 → h3)
- [ ] Tables have proper headers with `scope`
- [ ] Images have alt text (or `alt=""` for decorative)
- [ ] Skip links for main content

### Color & Visual
- [ ] Color contrast minimum 4.5:1 for text
- [ ] 3:1 for large text and UI components
- [ ] Error states not conveyed by color alone
- [ ] Focus indicators visible

## Code Quality Metrics

### ESLint & Prettier
- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm format` applied (Prettier)
- [ ] No ESLint-disable comments without justification
- [ ] import order follows project convention

### Component Guidelines
- [ ] Function components preferred (no class components)
- [ ] Max component size: ~200 lines (split if larger)
- [ ] Props interface defined explicitly (no inline types)
- [ ] Custom hooks for reusable logic
- [ ] Memoize expensive computations (`useMemo`)
- [ ] Memoize callbacks passed to children (`useCallback`)

### Function Guidelines
- [ ] Single responsibility principle
- [ ] Max function length: ~50 lines
- [ ] Early returns for guard clauses
- [ ] Named exports for utilities
- [ ] Type-safe argument handling

## Security Review Checklist

### Input Validation
- [ ] All forms validated with Zod schemas
- [ ] User inputs sanitized in search fields
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] Query parameters validated before use

### Authentication & Authorization
- [ ] Protected routes use `<ProtectedRoute>` or middleware
- [ ] `<Can>` / `<PageGuard>` used for feature-level access
- [ ] Super admin bypass logic understood
- [ ] Permissions checked on API calls (not just UI hiding)

### Data Handling
- [ ] No secrets/API keys in code
- [ ] Tokens stored in httpOnly cookies
- [ ] Sensitive data not logged
- [ ] Environment variables validated via Zod
- [ ] S3 uploads use signed URLs (not public)

### API Security
- [ ] POST/PUT/DELETE require proper auth
- [ ] User can only access own data check
- [ ] Rate limiting understood
- [ ] CORS configured correctly

## Performance Review Checklist

### Bundle Optimization
- [ ] `next/dynamic` for heavy components (Leaflet, charts)
- [ ] `next/image` for all images
- [ ] No large dependencies in initial bundle
- [ ] Dynamic imports for routes

### React Performance
- [ ] List items use proper keys
- [ ] `React.memo()` for pure components
- [ ] `useMemo` for expensive computations
- [ ] `useCallback` for callback props
- [ ] Virtualization for large lists (>100 items)

### Data Fetching
- [ ] `staleTime` set appropriately (static: 30min, realtime: 30s)
- [ ] Parallel queries where possible
- [ ] Optimistic updates for better UX
- [ ] Pagination for large datasets

### Rendering
- [ ] SSR enabled where SEO needed
- [ ] `ssr: false` for client-only components
- [ ] Server components used by default
- [ ] Client components explicitly marked

### Caching
- [ ] TanStack Query caching utilized
- [ ] HTTP cache headers configured
- [ ] Static assets cached at CDN level

## Feature Creation Checklist

- [ ] Read relevant PRD section from `.opencode/PRD-Master.md`
- [ ] Review coding patterns in `.opencode/SKILLS.md`
- [ ] Add route path to `src/config/paths.ts`
- [ ] Add menu item to `src/config/menu.ts` with `permission` field
- [ ] Create feature directory: `src/features/[domain]/[feature]/`
- [ ] Define types in `types/{item}.ts` (Item, Response, Params, Request)
- [ ] Add Zod schema in API file (`post-{item}.ts`)
- [ ] Create barrel exports (`index.ts` in each subfolder)
- [ ] Create API keys: `api/keys.ts`
- [ ] Create API functions + query hooks: `api/get-{items}.ts`, `api/get-{item}.ts`
- [ ] Create mutation hooks: `api/post-{item}.ts`, `api/put-{item}.ts`, `api/delete-{item}.ts`
- [ ] Create Zustand store: `store/{item}.ts`
- [ ] Create form components: `components/form/{item}-form.tsx`, `components/form/{item}-form-sheet.tsx`
- [ ] Create table columns: `components/list/table/columns.tsx`
- [ ] Create actions cell: `components/list/table/data-table-actions-cell.tsx`
- [ ] Create toolbar: `components/list/table/data-table-toolbar.tsx`
- [ ] Create list component: `components/list/{item}-list.tsx`
- [ ] Create page component: `components/index.tsx`
- [ ] Add `loading.tsx` in route directory
- [ ] Add `not-found.tsx` at section level
- [ ] Add route page: `app/(protected)/[domain]/[feature]/page.tsx`
- [ ] No `any` type
- [ ] All strings use i18n `t()` function
- [ ] No hardcoded route strings
- [ ] Test responsive layout (mobile + desktop)
- [ ] Test dark/light theme
- [ ] Verify file size < 300 lines (AD-015)