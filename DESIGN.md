# ION Core — Architecture & Design Document

**Product**: ION Core — ISP Enterprise Management System
**Version**: 0.4
**Last Updated**: 2026-06-02

> **Note**: For implementation details, code patterns, and step-by-step guides, see `AGENTS.md`. This document focuses on architectural decisions, rationale, and tradeoffs.

---

## Table of Contents

1. [Architectural Decisions](#architectural-decisions)
   - AD-001 to AD-011 (Core Architecture)
   - AD-012: Theme System (Dark/Light Mode)
   - AD-013: Responsive Design Strategy
   - AD-014: Language Locale (i18n) — Enhanced
   - AD-016: UI Consistency Standards
2. [Data Flow Patterns](#data-flow-patterns)
3. [Component Patterns](#component-patterns)
4. [State Architecture](#state-architecture)
5. [API Integration Patterns](#api-integration-patterns)
6. [Security Model](#security-model)
7. [Performance Strategy](#performance-strategy)
8. [Testing Strategy](#testing-strategy)
9. [Diagram Reference](#diagram-reference)

---

## Architectural Decisions

### AD-001: Feature-Based Module Organization

**Status**: Accepted
**Date**: 2026-01

**Context**: The application has 15+ business domains (NOC, CRM, administration, warehouse, etc.) each with their own API, types, state, and UI. A flat or layer-based structure would create tight coupling across domains.

**Decision**: Organize code by feature domain (`src/features/[domain]/[feature]/`) rather than by technical layer (`src/api/`, `src/components/`, `src/types/`). Each feature module is self-contained with its own `api/`, `store/`, `types/`, `components/`, and `hooks/` subdirectories.

> **Implementation details**: See AGENTS.md → Feature Module Standard for complete directory structure and code patterns.

**Consequences**:
- (+) Features can be developed, tested, and removed independently
- (+) Co-located code is easier to find and refactor
- (+) Barrel exports (`index.ts`) enforce clean public API per module
- (-) Shared code must be carefully extracted to avoid duplication
- (-) Cross-feature imports should only go through barrel exports, never deep imports

---

### AD-002: TanStack Query for Server State

**Status**: Accepted
**Date**: 2026-01

**Context**: The application fetches data from 12+ microservices. Previous patterns used Redux or Zustand for caching API responses, leading to stale data, manual cache invalidation, and loading/error state boilerplate.

**Decision**: Use TanStack Query (React Query) as the sole mechanism for server state. Zustand is reserved for client UI state only (sheet open/close, selected item, filters). Never store API data in Zustand.

> **Implementation details**: See AGENTS.md → API Layer for query key factory patterns, per-file hooks, and cache invalidation rules.

**Consequences**:
- (+) Automatic caching, background refetching, and stale-while-revalidate
- (+) Built-in loading/error states eliminate boilerplate
- (+) Cache invalidation via query keys is deterministic
- (+) Optimistic updates and pagination are built-in
- (-) Requires disciplined query key design (see AGENTS.md)
- (-) Team must learn React Query patterns; inertia toward Zustand for everything

---

### AD-003: Zustand for Client UI State Only

**Status**: Accepted
**Date**: 2026-01

**Context**: The application needs local UI state for sheet open/close, selected items, and filter selections. Previous patterns mixed server and UI state in the same store.

**Decision**: Zustand stores are created per-feature (not per-domain) and hold only ephemeral UI state: `sheetOpen`, `mode`, `selectedItem`, `filters`. Global stores exist only for `auth` and `layout`.

> **Implementation details**: See AGENTS.md → State Management for store template and naming conventions.

**Consequences**:
- (+) Stores are small, focused, and easy to test
- (+) No duplication between server cache and local state
- (-) Requires discipline to not add API data to Zustand stores
- (-) Each feature must create its own store file

---

### AD-004: Microservices via Next.js Rewrites

**Status**: Accepted
**Date**: 2026-01

**Context**: The backend consists of 12+ independently deployed microservices (user, branch, networking, order, customer, etc.), each with their own base URL. The frontend must communicate with all of them while avoiding CORS issues and simplifying deployment.

**Decision**: All API calls route through Next.js `rewrites` in `next.config.mjs`. The browser calls `/ion-[service]-service/...` and Next.js proxies to the actual backend. In proxy mode (`/api-proxy`), rewrites map `/api-proxy/{alias}` to backend services; otherwise they map directly.

**Service Map**:

| Service | Base Path | Equivalent Backend |
|---------|-----------|-------------------|
| Authorization | `/ion-user-service` | Auth & user management |
| HR | `/ion-user-service/hr` | HR & employee management |
| IAM | `/ion-user-service/iam` | Identity & access management |
| Networking | `/ion-networking-service` | NOC, RADIUS, ODP/POP |
| User | `/ion-user-service/user` | User profiles |
| Branch | `/ion-branch-service` | Branch/office hierarchy |
| Rule Schema | `/ion-rule-scheme-service` | Configurable schema system |
| Product | `/ion-product-service` | Product & service plans |
| Sales | `/ion-sales-service` | CRM & sales pipeline |
| Order | `/ion-order-service` | Order lifecycle |
| Customer | `/ion-customer-service` | Customer management |
| Technical | `/ion-technical-service` | Technician & field ops |
| Notification | `/ion-notification-service` | FCM & notification |

**Consequences**:
- (+) No CORS issues — browser talks to same origin
- (+) Backend URLs abstracted behind path prefixes
- (+) Easy to switch between proxy mode and direct mode
- (-) Next.js server must be running for API calls to work (dev proxy)
- (-) Route configuration must stay in sync with `constants.ts` and `next.config.mjs`

---

### AD-005: Cookie-Based Auth with Token Refresh

**Status**: Accepted
**Date**: 2026-01

**Context**: The application authenticates against a custom auth service (not OAuth/OIDC). Tokens must persist across browser tabs and survive page refreshes, but must also be accessible to Axios for API calls.

**Decision**: Auth tokens stored in browser cookies (`token`, `refresh_token`, `logged_in`, `session_id`, `active_branch_id`). Axios interceptor in `api-client.ts` attaches Bearer token from cookie. On 401, the interceptor queues pending requests, calls `refreshToken()` via `/token/refresh`, then retries.

**Flow**:
1. User logs in → `POST /authentication/login` → tokens set in cookies
2. Every API request → Axios interceptor reads `token` cookie, adds `Authorization: Bearer <token>`
3. On 401 → interceptor pauses requests, calls `POST /token/auth` to refresh, replays queued requests
4. On session expiry → redirect to `/signin`

**Consequences**:
- (+) Tokens survive page refresh (no localStorage session loss)
- (+) Automatic token refresh is transparent to feature code
- (+) `middleware.ts` checks `logged_in` cookie for route protection at the edge
- (-) Cookies are vulnerable to CSRF (mitigated by SameSite policy)
- (-) Token refresh race condition must be handled carefully (queued requests pattern)

---

### AD-006: Centralized Route Configuration

**Status**: Accepted
**Date**: 2026-01

**Context**: The application has 50+ routes across auth, dashboard, CRM, NOC, administration, etc. Hardcoded route strings cause maintenance headaches — renaming a route requires searching the entire codebase.

**Decision**: All route paths defined in a single `src/config/paths.ts` file (~476 lines). Each path has both a `path` string and a `getHref()` function for dynamic routes. All navigation and links must import from this file.

```typescript
// ✅ CORRECT
import { paths } from "@/config/paths";
router.push(paths.dashboard.noc.bandwidth.detail.getHref(id));

// ❌ WRONG
router.push(`/noc/bandwidth/${id}`);
```

**Consequences**:
- (+) Single source of truth for all routes
- (+) Type-safe dynamic route parameters
- (+) Easy to rename/restructure routes
- (-) File grows with each feature (mitigated by TypeScript autocompletion)
- (-) Requires discipline — no hardcoded strings anywhere

---

### AD-007: RBAC Permission System

**Status**: Accepted
**Date**: 2026-01

**Context**: The application serves multiple user roles (super admin, admin, NOC operator, technician, sales) with different access levels. Permissions must be enforced at both UI and route levels.

**Decision**: Three-layer permission system:

1. **Menu filtering** — `filterMenuByPermissions()` removes unauthorized items from navigation
2. **Component-level** — `<Can permission="customers.create">` conditionally renders UI
3. **Page-level** — `<PageGuard permission="customers.create">` redirects or shows 403

Super admin (`isSuperAdmin: true`) bypasses all checks. Permissions come from the auth service as `UserRoleAssignment[]` with branch-level context (regional/area/sub_area).

**Consequences**:
- (+) Defense in depth — menu, component, and page levels
- (+) Super admin bypass simplifies development
- (-) Permission strings must stay in sync with backend
- (-) Client-side RBAC is UI-only; backend must also enforce

---

### AD-008: Zod-First Form Validation

**Status**: Accepted
**Date**: 2026-01

**Context**: Forms are the primary data entry mechanism across the application (customer onboarding, work orders, network configuration). Validation must be consistent, type-safe, and reusable.

**Decision**: All form validation uses Zod schemas. Schemas are co-located with the POST mutation in `api/post-{item}.ts`. Form data types are derived with `z.infer<typeof schema>` — never duplicated manually. React Hook Form uses `zodResolver` for validation.

```typescript
// api/post-{item}.ts — Zod schema co-located with mutation
export const {item}Schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  // ... fields
});
export type {Item}FormData = z.infer<typeof {item}Schema>;

// components/form/{item}-form.tsx
import { {item}Schema, type {Item}FormData } from "../../api/post-{item}";

const form = useForm<{Item}FormData>({
  resolver: zodResolver({item}Schema),
  values: (data && mode !== "new") ? mapData(data) : defaults,
});
```

**Consequences**:
- (+) Single source of truth for validation rules and types
- (+) Runtime and compile-time type safety
- (+) Schemas reusable across create/edit forms and API validation
- (-) Zod v4 API differences from v3 require team familiarity
- (-) Complex conditional validation can be verbose

---

### AD-009: Next.js App Router with Route Groups

**Status**: Accepted
**Date**: 2026-01

**Context**: The application has three distinct layout contexts: public auth pages, authenticated dashboard pages, and demo/documentation pages. Each requires different layout shells, middleware behavior, and error boundaries.

**Decision**: Use Next.js App Router route groups:
- `(auth)/` — public pages with minimal layout (no sidebar), protected by middleware redirect
- `(protected)/` — authenticated pages with full sidebar/header layout, `ProtectedRoute` wrapper
- `(layouts)/` — demo pages showcasing different layout variants

Dynamic route params are always `[id]`, never `[customNameId]`. Every route has `loading.tsx`; section-level routes also have `not-found.tsx`.

**Consequences**:
- (+) Clear separation of auth contexts
- (+) Each group gets its own layout without URL impact
- (+) Consistent loading/error UX
- (-) Route group parentheses can confuse new developers
- (-) Dynamic `[id]` param requires context access pattern

---

### AD-010: shadcn/ui as Component Foundation

**Status**: Accepted
**Date**: 2026-01

**Context**: The application needs 85+ UI primitives (buttons, inputs, dialogs, sheets, tables, etc.) with consistent styling, accessibility, and customization. Building these from scratch is prohibitively expensive.

**Decision**: Use shadcn/ui (Radix UI + Tailwind CSS) as the component foundation. `src/components/ui/` contains 85+ primitives that are owned by shadcn and should NOT be manually edited. Application-specific components live in `src/components/common/` (app-wide) and `src/components/shared/` (feature-pattern).

**Consequences**:
- (+) Accessible by default (Radix primitives)
- (+) Consistent design language across 85+ components
- (+) Easy to theme via Tailwind CSS variables
- (-) Upgrading shadcn components requires CLI, not manual editing
- (-) Component API surface is large — team must learn the patterns

---

### AD-011: Internationalization with react-i18next

**Status**: Accepted
**Date**: 2026-01

**Context**: The application must support at least English and Indonesian (Bahasa Indonesia). All user-facing strings must be translatable.

**Decision**: Use `react-i18next` with browser language detection. Translation files in `src/i18n/locales/{en,id}/common.json`. All display text uses `t()` function, never hardcoded strings.

**Consequences**:
- (+) Adding languages requires only new JSON files
- (+) Consistent translation key namespace
- (-) All existing strings must be migrated to `t()` calls
- (-) Translation file size can grow large in administration features

---

### AD-012: Theme System (Dark/Light Mode)

**Status**: Accepted
**Date**: 2026-01

**Context**: Users need visual flexibility for different lighting conditions and personal preferences. Enterprise environments often require consistent theming across large-screen workstations and field devices.

**Decision**: Use `next-themes` library with class-based dark mode. `ThemeProvider` wraps the app root with `attribute="class"`, `defaultTheme="system"`, and `enableSystem` for automatic OS preference detection. Theme toggle is placed in the sidebar header toolbar.

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

**Conventions**:
- Use `dark:` Tailwind prefix for all dark mode overrides
- Prefer CSS variable-based theming (`--background`, `--foreground`, `--primary`, etc.)
- Avoid hardcoded colors — always use `hsl(var(--<token>))` or Tailwind config
- `disableTransitionOnChange` prevents flash during theme switch
- System preference is respected by default; user can override manually

**Tailwind dark mode patterns**:
```tsx
// ✅ CORRECT — use dark: prefix
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">

// ❌ WRONG — hardcoded colors
<div className="bg-white text-black">
```

**Consequences**:
- (+) Automatic system preference detection — no manual toggle required
- (+) Class-based approach works with SSR and static generation
- (+) CSS variables enable consistent theming across shadcn/ui components
- (-) Every component must be tested in both themes
- (-) Custom components need explicit `dark:` variants for all color tokens

---

### AD-013: Responsive Design Strategy

**Status**: Accepted
**Date**: 2026-01

**Context**: The application is used on desktop workstations (primary), tablets (field supervisors), and mobile devices (technicians). The sidebar layout, data tables, and forms must adapt to all screen sizes.

**Decision**: Mobile-first approach with a single breakpoint at `1024px`. Custom `useIsMobile` hook detects viewport width via `window.matchMedia`. Two sidebar layouts: vertical (desktop) and horizontal (mobile).

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

**Breakpoint strategy**:
| Screen | Width | Layout |
|--------|-------|--------|
| Desktop | ≥ 1024px | Vertical sidebar + full table |
| Mobile | < 1024px | Horizontal sidebar + responsive table |

**Responsive patterns**:
```tsx
// ✅ CORRECT — use useIsMobile for layout switching
const isMobile = useIsMobile();
{isMobile ? <MobileSidebar /> : <DesktopSidebar />}

// ✅ CORRECT — responsive Tailwind classes
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

// ✅ CORITICAL — DataGrid horizontal scroll on mobile
<ScrollArea className="w-full">
  <DataGridContainer className="w-full min-w-[640px]">
    <DataGridTable />
  </DataGridContainer>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

**Mobile considerations**:
- Data tables use horizontal scroll, never collapse columns
- Forms use full-width fields on mobile, side-by-side on desktop
- Dialogs/Sheets use full-screen on mobile, slide-over on desktop
- Touch targets minimum 44px (accessibility)

**Consequences**:
- (+) Single breakpoint simplifies layout logic
- (+) `useIsMobile` hook provides SSR-safe detection
- (+) Horizontal scroll preserves table data density on mobile
- (-) Must test both layouts on every new page
- (-) No tablet-specific breakpoint — 1024px covers both tablet and mobile

---

### AD-014: Language Locale (i18n) — Enhanced

**Status**: Accepted
**Date**: 2026-01

**Context**: The application serves Indonesian and English users. Default language is Indonesian (`id`). Language preference must persist across sessions and be switchable via header dropdown.

**Decision**: Use `react-i18next` with `i18next-browser-languagedetector`. Translation files in `src/i18n/locales/{en,id}/common.json`. `LanguageSwitcher` component in sidebar header toolbar provides dropdown with flag icons.

```tsx
// src/i18n/index.ts
i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "id",
    lng: "id",
    interpolation: { escapeValue: false },
  });
```

**Conventions**:
- All user-facing strings MUST use `t("key")` function
- Never hardcode display text — always from translation JSON
- Fallback language is `id` (Indonesian)
- Translation keys follow dot notation: `menu.dashboard`, `common.save`, `feature.title`
- Add new keys to BOTH `en.json` and `id.json` files

**Consequences**:
- (+) Language preference persists via `i18next-browser-languagedetector` (localStorage)
- (+) Adding new languages requires only new JSON locale files
- (+) `LanguageSwitcher` provides intuitive dropdown with flags
- (-) All existing strings must be migrated to `t()` calls
- (-) Translation file size grows with each feature
- (-) Must keep both locale files in sync when adding new keys

---

### AD-015: File Size Limit (300 Lines Max)

**Status**: Accepted
**Date**: 2026-05

**Context**: Large files (>500 lines) are difficult to maintain, review, and test. Finding specific logic requires excessive scrolling, and merge conflicts become more likely with longer files.

**Decision**: Every source file MUST NOT exceed 300 lines (including comments, blank lines, and imports). When a file approaches this limit, it must be refactored by extracting logical units into separate components, hooks, or utilities.

**Exceptions**: The following file types are exempt from the 300-line limit:
- Route configuration files (`paths.ts`)
- Constants/configuration files (`constants.ts`, `menu.ts`)
- Translation/i18n files (`*.json`)
- Mock/dummy data files (`data/dummy-*.ts`)
- Type definition barrel files (`types/index.ts`)

These files may exceed 300 lines but should still aim for reasonable size (max 500 lines).

**Splitting strategies**:

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

**Consequences**:
- (+) Files are easier to read, review, and maintain
- (+) Smaller files reduce merge conflict probability
- (+) Encourages single-responsibility principle
- (+) Better code organization and discoverability
- (-) More files to navigate (mitigated by clear naming conventions)
- (-) Requires discipline to split before hitting limit

---

### AD-016: UI Consistency Standards

**Status**: Accepted
**Date**: 2026-06

**Context**: Features are built by different developers at different times, leading to inconsistent padding, margin, hardcoded colors, badge styling, and form sheet scroll behavior across the application.

**Decision**: Establish mandatory UI standards for all new features and refactored code.

#### Page Container Padding

Every page-level component MUST use consistent padding:

```tsx
// ✅ CORRECT — standardized page container
<div className="relative h-full w-full overflow-hidden px-6 py-4">

// ❌ WRONG — inconsistent padding
<div className="p-4">
<div className="px-6 py-3">
<div className="p-6">
```

**Standard:** `px-6 py-4` for all page containers.

#### Toolbar Title Sizing

```tsx
// ✅ CORRECT
<ToolbarTitle className="text-2xl font-extrabold tracking-tight">

// ❌ WRONG — inconsistent sizing
<ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
```

#### No Hardcoded Colors

All colors MUST use CSS variables or Tailwind semantic tokens. NEVER use hardcoded hex values.

```tsx
// ✅ CORRECT — CSS variables
<span className="text-primary">
<span className="bg-destructive text-destructive-foreground">
<span className="text-muted-foreground">

// ✅ CORRECT — Tailwind semantic tokens with dark: prefix
<span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">

// ❌ WRONG — hardcoded hex
<span style={{ color: "#f59e0b" }}>
<Cell fill="#3b82f6" />
```

**Exception:** Recharts `fill` and `stroke` props MAY use CSS variable references:
```tsx
// ✅ CORRECT — Recharts with CSS variables
<Cell fill="var(--color-primary)" />
```

#### Badge Component Usage

All status/type badges MUST use the `<Badge>` component with semantic variants. NEVER use raw `<span>` with hardcoded Tailwind classes.

```tsx
// ✅ CORRECT — Badge component
<Badge variant="success" appearance="light">Active</Badge>
<Badge variant="destructive" appearance="light">Critical</Badge>
<Badge variant="warning" appearance="light">Pending</Badge>
<Badge variant="info" appearance="light">In Progress</Badge>
<Badge variant="secondary" appearance="light">Draft</Badge>

// ❌ WRONG — raw span with hardcoded classes
<span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full px-2 py-0.5 text-xs font-semibold">
  Active
</span>
```

**Available Badge variants:**

| Variant | Use For |
|---------|---------|
| `default` | Neutral status |
| `secondary` | Draft, inactive |
| `success` | Active, completed, online |
| `warning` | Pending, warm, near capacity |
| `destructive` | Critical, failed, offline |
| `info` | In progress, processing |
| `outline` | Subtle labels |

#### Form Sheet Scrollable Body

All form sheets MUST have scrollable body content. The `SheetBody` MUST use `overflow-hidden` with an inner `ScrollArea`.

```tsx
// ✅ CORRECT — scrollable sheet body
<SheetContent className="...flex flex-col">
  <SheetHeader className="border-b px-5 py-4 shrink-0">
    <SheetTitle>Title</SheetTitle>
  </SheetHeader>

  <SheetBody className="flex-1 p-0 overflow-hidden">
    <ScrollArea className="h-full px-6 py-5">
      {/* form content */}
    </ScrollArea>
  </SheetBody>

  <SheetFooter className="border-t p-5 shrink-0">
    {/* buttons */}
  </SheetFooter>
</SheetContent>

// ❌ WRONG — no scroll, content gets cut off
<SheetContent>
  <SheetBody className="p-6">
    {/* long form content — not scrollable */}
  </SheetBody>
</SheetContent>
```

**Key rules:**
- `SheetContent` MUST have `flex flex-col` layout
- `SheetHeader` MUST have `shrink-0`
- `SheetBody` MUST have `flex-1 overflow-hidden`
- Inner content MUST use `<ScrollArea className="h-full">`
- `SheetFooter` MUST have `shrink-0`

**Consequences**:
- (+) Consistent visual appearance across all pages
- (+) Dark mode works correctly without color overrides
- (+) Long forms are always scrollable
- (-) Existing code needs gradual migration to match standards

---

## Data Flow Patterns

### Authentication Flow

```
┌──────────┐    POST /authentication/login     ┌──────────────┐
│ Browser  │ ──────────────────────────────────► │ Auth Service │
│          │ ◄────────────────────────────────── │              │
└──────────┘    Set cookies: token,             └──────────────┘
                refresh_token,
                logged_in=1

┌──────────┐    GET /api-proxy/ion-x/...        ┌──────────────┐
│ Browser  │ ──► Axios interceptor ─────────────► │ Microservice │
│          │     adds Authorization: Bearer      │              │
│          │ ◄── on 401, refresh token ──────────│              │
└──────────┘    retry queued requests             └──────────────┘
```

### CRUD Data Flow (Feature Module)

```
┌────────────┐    useQuery / useMutation     ┌────────────┐
│  React UI  │ ◄──────────────────────────► │ React Query │
│ Component  │    select: res => res.data    │   Cache     │
└────────────┘                               └──────┬─────┘
                                                     │ api.list()
                                                     │ api.create()
                                             ┌───────▼──────┐
                                             │  apiClient   │
                                             │  (Axios)     │
                                             └───────┬──────┘
                                                     │ HTTP
                                             ┌───────▼──────┐
                                             │  Microservice │
                                             │  Backend      │
                                             └──────────────┘
```

### Form Submission Flow

```
┌──────────┐    onSubmit     ┌───────────────┐    onSuccess     ┌──────────────┐
│  User    │ ──────────────► │ React Hook    │ ───────────────► │ Invalidate  │
│  Form    │                 │ Form + Zod    │                  │ Query Keys   │
│          │                 │ Validation    │                  │ → Refetch    │
└──────────┘                 └───────┬───────┘                  └──────────────┘
                                     │ useMutation
                             ┌───────▼───────┐
                             │  api.create()  │
                             │  (Axios POST)  │
                             └───────────────┘
```

---

## Component Patterns

### List Page Pattern

Every feature list page follows this structure:

```
[Item]ListPage (components/index.tsx)
├── <PageBreadcrumb>
├── <Toolbar>
│   ├── <ToolbarHeading>
│   │   └── <ToolbarTitle>
│   └── <ToolbarActions>
│       ├── Export Data Button
│       └── Add New Button → opens form sheet
├── <[Item]List /> → DataGrid wrapper
│   └── <Card>
│       ├── <CardHeader>
│       │   ├── Collapsible filter toggle
│       │   └── DataTableToolbar (column visibility)
│       ├── <CardTable>
│       │   └── <ScrollArea>
│       │       └── <DataGridContainer>
│       │           └── <DataGridTable /> (columns + actions)
│       └── <CardFooter>
│           └── <DataGridPagination /> (server-side pagination)
└── <[Item]FormSheet /> (slide-over for create/edit/view)
```

**Key rules**:
- URL state via `nuqs` (`useQueryStates`) for pagination/search
- `useReactTable` with `manualPagination: true` for server-side pagination
- `<DataGridColumnHeader>` for sortable, pinnable, movable columns
- `<ActionsCell>` for row actions (Edit/Detail/Delete with DropdownMenu + AlertDialog)
- `<DataGrid>` context provides `table`, `recordCount`, `isLoading`, `tableLayout`
- Form uses `forwardRef` + `useImperativeHandle` to expose `submit()` and `isPending`
- Store manages `form`, `{item}SheetOpen`, `selected{Item}` (not just sheetOpen/mode)

### Detail Page Pattern

```
[Feature]Detail
├── PageBreadcrumb
├── Toolbar (back button, actions)
├── Detail header (name, status badge)
├── KPI cards (optional)
├── Sub-tabs (optional, e.g., devices, inventory)
└── Related data tables (optional)
```

### Form Pattern

All forms use React Hook Form + Zod resolver:

1. Zod schema defined in `api/post-{item}.ts` (co-located with mutation hook)
2. Type derived with `z.infer<typeof schema>` — never duplicated manually
3. Form uses `forwardRef` + `useImperativeHandle` to expose `submit()` and `isPending` to parent Sheet
4. `values` prop in `useForm` for edit-mode sync (no `useEffect` needed)
5. Form wrapped in `<Sheet>` via `{item}-form-sheet.tsx` (header + body + footer pattern)
6. Complex forms split into sections with icon headers and border separators
7. Sheet footer has Close, Cancel, and Create/Save buttons; detail mode hides submit button

```typescript
// Form component pattern (forwardRef + useImperativeHandle)
export const {Item}Form = forwardRef<{Item}FormRef, {Item}FormProps>(
  ({ onSuccess, {item}Id, readOnly, mode }, ref) => {
    const form = useForm<{Item}FormData>({
      resolver: zodResolver({item}Schema),
      values: (data && mode !== "new") ? mapData(data) : defaults,
    });

    useImperativeHandle(ref, () => ({
      submit: () => form.handleSubmit(onSubmit)(),
      isPending,
    }));
    // ...
  }
);
```

### Table Column Pattern

TanStack Table v8 columns follow this structure (reference: `noc/router`):

```typescript
// columns.tsx — uses use{Item}Columns hook pattern
export const columns: ColumnDef<{Item}>[] = [
  {
    id: "field_name",
    accessorFn: (row) => row.field_name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Field Name" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <div>{row.original.field_name}</div>,
    meta: { skeleton: <Skeleton className="h-4 w-32" /> },
    enableSorting: true,
    size: 200,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataGridColumnHeader title="Actions" column={column} className="text-foreground font-semibold" />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    meta: { skeleton: <Skeleton className="h-8 w-8 rounded-full" /> },
    enableSorting: false,
    size: 75,
  },
];
```

**DataGrid component hierarchy**:
- `<DataGrid>` — context provider (`table`, `recordCount`, `isLoading`, `tableLayout`)
- `<DataGridColumnHeader>` — sortable, pinnable, movable column headers
- `<DataGridColumnVisibility>` — column visibility toggle button
- `<DataGridTable>` — renders `<table>` with head/body + skeleton/empty states
- `<DataGridPagination>` — page size selector, page info, prev/next navigation
- `<DataGridContainer>` — border/wrapper with `data-slot="data-grid"`
- `<ActionsCell>` — DropdownMenu (Edit/Detail/Delete) + AlertDialog for delete confirmation

### Page Wrapper Pattern

Every `page.tsx` MUST be a thin `Suspense` wrapper. **NEVER** put business logic in `page.tsx`:

```
page.tsx (< 20 lines)
  ├── import { ScreenLoader } from "@/components/common/screen-loader"
  ├── import { FeatureListPage } from "@/features/[domain]/[feature]/components"
  ├── export const metadata: Metadata = { title, description }
  └── export default function Page()
        └── <Suspense fallback={<ScreenLoader />}>
              <FeatureListPage />
            </Suspense>
```

The actual page component (`FeatureListPage`) lives in `components/index.tsx` and handles:
- `<PageBreadcrumb>` — navigation breadcrumbs
- `<Toolbar>` — heading + actions (export, add new)
- `<FeatureList />` — DataGrid with filters and pagination
- `<FeatureFormSheet />` — slide-over for create/edit/view

### URL State Pattern (nuqs)

All filter/pagination state MUST use `nuqs` for URL persistence:

```tsx
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";

const [filter, setFilter] = useQueryStates({
  limit: parseAsInteger.withDefault(10),
  page: parseAsInteger.withDefault(1),
  search: parseAsString,
});
```

**Usage flow:**
1. `useQueryStates` syncs filter state with URL query params
2. `useReactTable` with `manualPagination: true` for server-side pagination
3. `DataGridPagination` receives `setFilter` + `filter` to update URL state
4. URL state persists across page refreshes and shareable links

**Filter shape:**
```typescript
interface FilterState {
  limit: number;    // Page size (default: 10)
  page: number;     // Current page (default: 1)
  search: string;   // Search query (optional)
}
```

### Skeleton Loading Strategy

Three-tier loading state system:

| Level | Component | When | Purpose |
|-------|-----------|------|---------|
| **Screen** | `<ScreenLoader />` | Route initial load | Full-page loading spinner |
| **Table** | `<DataGridTableBodyRowSkeleton>` | Data fetching | Per-row skeleton with `meta.skeleton` per cell |
| **Card** | `<Skeleton>` | Individual elements | Filters, buttons, headers |

**Screen Skeleton** — Every `page.tsx` uses `<ScreenLoader />` as Suspense fallback:
```tsx
<Suspense fallback={<ScreenLoader />}>
  <FeatureListPage />
</Suspense>
```

**Table Cell Skeletons** — Each column defines `meta.skeleton` in `columns.tsx`:
```tsx
{
  id: "name",
  accessorFn: (row) => row.name,
  header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
  cell: ({ row }) => <div>{row.original.name}</div>,
  meta: { skeleton: <Skeleton className="h-4 w-32" /> },
  enableSorting: true,
  size: 200,
}
```

**Auto-render** — DataGrid automatically renders skeleton rows when `isLoading` is true. From `data-grid-table.tsx`:
```tsx
{props.loadingMode === "skeleton" && isLoading && pagination?.pageSize ? (
  Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
    <DataGridTableBodyRowSkeleton key={rowIndex}>
      {table.getVisibleFlatColumns().map((column, colIndex) => (
        <DataGridTableBodyRowSkeletonCell column={column} key={colIndex}>
          {column.columnDef.meta?.skeleton}
        </DataGridTableBodyRowSkeletonCell>
      ))}
    </DataGridTableBodyRowSkeleton>
  ))
) : table.getRowModel().rows.length ? (
  // ... actual rows
) : (
  // ... empty state
)}
```

**Skeleton width guidelines:**

| Content | Width | Height |
|---------|-------|--------|
| Short text (status, badge) | `w-16` to `w-24` | `h-4` to `h-5` |
| Medium text (name, code) | `w-28` to `w-36` | `h-4` |
| Long text (description) | `w-40` to `w-48` | `h-4` |
| Actions button | `w-8` | `h-8` |
| Badge/pill | `w-16` to `w-20` | `h-5` + `rounded-full` |

---

## State Architecture

### Decision Matrix

| What | Where | Tool | Example |
|------|-------|------|---------|
| API data (lists, details) | TanStack Query cache | `useQuery`, `useMutation` | Customer list, order detail |
| Form field values | React Hook Form | `useForm`, `register` | Create customer form |
| Sheet open/close mode | Zustand per-feature store | `use{Item}Store` | `form`, `{item}SheetOpen`, `selected{Item}` |
| Active sidebar item | Zustand global store | `useLayoutStore` | `layout`, `menu` |
| Auth user & tokens | Zustand global store | `useAuthStore` | `user`, `isAuthenticated` |
| URL search params | nuqs | `useQueryState` | Page number, active tab |
| Theme (dark/light) | `next-themes` via `ThemeProvider` | `useTheme` | Dark mode, system preference (AD-012) |
| Locale (language) | `react-i18next` via `i18n` | `useTranslation` | Indonesian/English, LanguageSwitcher (AD-014) |
| Responsive layout | `useIsMobile` hook (1024px breakpoint) | `useIsMobile` | Mobile sidebar, horizontal scroll (AD-013) |

### Zustand Store Template

```typescript
// store/{item}.ts
import { create } from "zustand";
import { Item } from "../types";

interface ItemState {
  form: "new" | "edit" | "details" | null;
  itemSheetOpen: boolean;
  selectedItem: Item | null;
  openItemFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeItemFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setItemFormSheetOpen: (open: boolean) => void;
  setSelectedItem: (item: Item | null) => void;
}

const useItemStore = create<ItemState>((set) => ({
  form: "new",
  itemSheetOpen: false,
  selectedItem: null,
  setForm: (form) => set((state) => ({ ...state, form })),
  setItemFormSheetOpen: (open) => set((state) => ({ ...state, itemSheetOpen: open })),
  openItemFormSheet: (form) => set((state) => ({ ...state, itemSheetOpen: true, form })),
  closeItemFormSheet: () => set((state) => ({ ...state, itemSheetOpen: false, form: null })),
  setSelectedItem: (item) => set((state) => ({ ...state, selectedItem: item })),
}));

export { useItemStore };
```

### Global Stores (Only 3)

| Store | File | State |
|-------|------|-------|
| Auth | `store/auth-store.ts` | `user`, `rawUser`, `tokens`, `isAuthenticated`, `loginAs`, `logout` |
| Layout | `store/store.ts` | `layout` (horizontal/vertical), active `menu` |
| Notifications | `store/notification-store.ts` | `registeredFcmToken`, `registeredFcmUserId` (persisted) |

---

## API Integration Patterns

### Axios Client Configuration

`src/lib/api-client.ts` provides a pre-configured Axios instance:
- Base URL from environment
- Bearer token from cookie
- Automatic token refresh on 401
- Request queueing during refresh
- Redirect to `/signin` on session expiry

### Query Key Hierarchy

```
["FEATURE"]                           ← invalidate all
["FEATURE", "LIST", params]          ← invalidate list
["FEATURE", "DETAIL", id]            ← invalidate detail
["FEATURE", "ACTIVE"]                ← invalidate active items
```

**Invalidation rule**: After any mutation (create/update/delete), invalidate `FEATURE_KEYS.all()` to refresh all related queries.

### Pagination Pattern

The backend returns multiple pagination metadata shapes. `src/lib/pagination.ts` handles all variants:

```typescript
// Backend may return any of:
{ total, per_page } | { total_records, size } | { limit, ... }
// pagination.ts normalizes all to: { total, perPage, pageCount }
```

### Error Handling

- **Global**: `QueryClient` default options show toast on error (unless `suppressGlobalError` meta is set)
- **Local**: Each mutation has `onError` callback for specific error messages
- **API errors**: `getApiError()` from `src/lib/helpers.ts` extracts message from Axios error response

---

## Security Model

### Layers

```
┌──────────────────────────────────────────────────────────┐
│  middleware.ts (Edge)                                     │
│  • Checks `logged_in` cookie                              │
│  • Redirects unauthenticated to /signin                    │
│  • Public paths whitelist                                  │
├──────────────────────────────────────────────────────────┤
│  <ProtectedRoute> (Component)                             │
│  • Verifies auth store has valid user                      │
│  • Renders <PageGuard> for permission checks               │
├──────────────────────────────────────────────────────────┤
│  <PageGuard> / <Can> (Component)                          │
│  • Checks `useCan(permission)`                            │
│  • Redirects to 403 or hides element                      │
├──────────────────────────────────────────────────────────┤
│  filterMenuByPermissions() (Menu)                          │
│  • Removes unauthorized menu items                          │
│  • Super admin sees all                                    │
└──────────────────────────────────────────────────────────┘
```

### Token Lifecycle

```
Login ──► POST /authentication/login
          Set-Cookie: token, refresh_token, logged_in=1

Request ──► Axios adds Authorization: Bearer <token>
            On 401:
              1. Pause all pending requests
              2. POST /token/auth (refresh)
              3. Update token cookie
              4. Replay paused requests with new token
              5. On failure → redirect /signin

Logout ──► Clear all cookies ──► Redirect /signin
```

### Input Validation

- All forms validated with Zod schemas (runtime)
- TypeScript strict mode for compile-time safety
- Environment variables validated via Zod in `src/config/env.ts`
- Search inputs sanitized before API calls

---

## Performance Strategy

### Code Splitting & Lazy Loading

| Component Type | Strategy |
|---------------|----------|
| Maps (Leaflet) | `next/dynamic` + `ssr: false` |
| Charts (Recharts/ApexCharts) | `next/dynamic` + `ssr: false` |
| Dialogs/Sheets | Lazy open (render on open, not on mount) |
| Heavy libraries | `next/dynamic` with loading skeleton |

### React Query Caching

| Data Type | staleTime | gcTime | Refetch |
|-----------|----------|--------|---------|
| Static/reference (products, branches) | 30 min | 60 min | On window focus |
| User data (profile, permissions) | 5 min | 30 min | On window focus |
| Realtime (NOC dashboard, RADIUS) | 30 sec | 5 min | Poll every 30s |

### Image Optimization

- Use `next/image` for all images
- Remote patterns allow `s3.ionlabs.dev` and `*.s3.ionlabs.dev`
- Proper `width`/`height` or `fill` props required

### Bundle Optimization

- Tree-shake unused shadcn/ui components via barrel exports
- Avoid importing entire icon libraries — import specific icons
- Use `nuqs` for URL state instead of custom parsing

---

## Testing Strategy

### Current State

No automated test framework is currently configured. When tests are added:

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Utility functions, store logic, Zod schemas |
| Component | React Testing Library + Vitest | Component rendering, form submission |
| Integration | MSW + React Testing Library | API hooks, query/mutation flows |
| E2E | Playwright | Critical user flows (login, CRUD operations) |

### Testing Priorities

1. **Zod validation schemas** — unit test all form schemas
2. **API query hooks** — integration test with MSW mocking
3. **Permission logic** — unit test `useCan`, `filterMenuByPermissions`
4. **Auth flow** — E2E test login → token refresh → logout
5. **Core CRUD flows** — E2E test each major feature (customer, order, work order)

---

## Diagram Reference

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                      │
│  ┌────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ Pages  │  │ React Query   │  │ Zustand Stores     │  │
│  │ (App   │  │ (Server Cache)│  │ (UI State Only)    │  │
│  │ Router)│  └───────┬────────┘  └────────────────────┘  │
│  └────────┘          │                                    │
│                       ▼                                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │              apiClient (Axios)                      │  │
│  │   • Auth interceptor (Bearer token + refresh)      │  │
│  │   • Proxy mode detection (/api-proxy)              │  │
│  └────────────────────┬───────────────────────────────┘  │
└────────────────────────┼─────────────────────────────────┘
                         │
            ┌────────────▼────────────┐
            │   Next.js Rewrites      │
            │   (next.config.mjs)     │
            └────────────┬────────────┘
                         │
     ┌───────────────────┼───────────────────┐
     │                   │                     │
┌────▼─────┐  ┌─────────▼─────────┐  ┌───────▼────────┐
│ ion-user │  │ ion-networking    │  │ ion-branch /   │
│ service  │  │ service           │  │ ion-product /  │
│          │  │                   │  │ ion-sales /    │
│ Auth     │  │ NOC, RADIUS      │  │ ion-order /    │
│ HR       │  │ ODP/POP          │  │ ion-customer / │
│ IAM      │  │ Bandwidth        │  │ ion-technical  │
└──────────┘  └───────────────────┘  └────────────────┘
```

### Feature Module Data Flow

```
┌──────────────────────────────────────────────────┐
│ Feature Module                                   │
│                                                  │
│  ┌──────────┐   useQuery    ┌────────────────┐  │
│  │ Component │ ◄──────────── │ get-{items}.ts  │  │
│  │ (List/   │   useMutation │ get-{item}.ts    │  │
│  │  Detail) │               │ post-{item}.ts   │  │
│  └────┬─────┘               │ put-{item}.ts   │  │
│       │                     │ delete-{item}.ts │  │
│  ┌────▼─────┐               └───────┬────────┘  │
│  │ Store    │                       │           │
│  │ (Zustand)│               ┌───────▼────────┐  │
│  │ UI state │               │ keys.ts         │  │
│  │ form     │               │ (Query keys)    │  │
│  │ sheetOpen│               └────────────────┘  │
│  │ selected │                                    │
│  └──────────┘                                    │
│                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────────┐ │
│  │ types/   │   │ data/   │   │ form/        │ │
│  │ {item}.ts│   │ dummy-  │   │ {item}-form  │ │
│  │ index.ts │   │ {items} │   │ {item}-sheet │ │
│  └──────────┘   └──────────┘   └──────────────┘ │
└──────────────────────────────────────────────────┘
```