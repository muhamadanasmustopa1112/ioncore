import {
  Activity,
  ArrowLeftRight,
  BarChart2,
  BarChart3,
  BookMinus,
  Box,
  BoxIcon,
  Building2,
  ClipboardList,
  Columns,
  Database,
  FileChartLine,
  FileText,
  Gauge,
  GitBranch,
  Headset,
  KeyRound,
  LayoutGrid,
  Map,
  Network,
  Package,
  PanelsTopLeft,
  PanelTop,
  Presentation,
  RouterIcon,
  ScrollText,
  Settings,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  SquareKanban,
  SquareRoundCorner,
  StickyNote,
  User,
  UserCheck2,
  UserCog,
  UserIcon,
  Users,
  Users2,
  UserSearch,
  Clock,
  Eye,
  Fingerprint,
  GitMerge,
  ShieldOff,
  Wallet,
  Webhook,
  Wrench,
} from "lucide-react";
import { paths } from "@/config/paths";
import { MenuConfig } from "@/config/types";
// Menu untuk halaman /docs (documentation/development)
export const DOCS_MENU: MenuConfig = [
  {
    title: "Dashboard",
    path: paths.docs.root.getHref(),
    icon: BarChart3,
  },
  {
    title: "Master Data",
    path: paths.docs.masterData.root.getHref(),
    icon: Box,
    children: [
      {
        title: "Layout Experiences",
        path: paths.docs.oneColDrawer.root.getHref(),
        icon: Users,
        children: [
          {
            title: "1 Col Pop Up Drawer",
            path: paths.docs.oneColDrawer.root.getHref(),
            icon: PanelTop,
          },
          {
            title: "1 Col New Page",
            path: paths.docs.oneColNewPage.root.getHref(),
            icon: StickyNote,
          },
          {
            title: "1 Col to 2 Col Drawer",
            path: paths.docs.oneColToTwoCol.root.getHref(),
            icon: PanelsTopLeft,
          },
          {
            title: "2 Col Section",
            path: paths.docs.twoColTwoCard.root.getHref(),
            icon: Columns,
          },
        ],
      },
    ],
  },
  {
    title: "Project",
    path: paths.docs.project.root.getHref(),
    icon: Presentation,
    children: [
      {
        title: "Task Board",
        path: paths.docs.project.root.getHref(),
        icon: SquareKanban,
        children: [
          {
            title: "Kanban",
            path: paths.docs.kanban.root.getHref(),
            icon: SquareKanban,
          }
        ]
      }
    ]
  },
  {
    title: "Operasional",
    path: "#",
    icon: FileText,
    children: [
      {
        title: "test 1",
        path: paths.docs.project.root.getHref(),
        icon: SquareKanban,
      },
      {
        title: "test 2",
        path: paths.docs.project.root.getHref(),
        icon: SquareKanban,
      },
      {
        title: "test 3",
        path: paths.docs.project.root.getHref(),
        icon: SquareKanban,
      }
    ]
  },
  {
    title: "Report",
    path: "#",
    icon: FileChartLine,
  },
  {
    title: "Config",
    path: "#",
    icon: Settings,
  },
  {
    title: "IAM",
    path: "#",
    icon: User,
  },
];
// ── Item Definitions for Modular Inclusion ────────────────
const DASHBOARD_ITEM = {
  title: "Dashboard",
  path: paths.dashboard.root.getHref(),
  heading: 'General',
  icon: BarChart3,
};

const CRM_SALES_ITEM = {
  title: "CRM & Sales",
  path: paths.dashboard.crmAndSales.root.getHref(),
  heading: 'General',
  icon: UserSearch,
  children: [
    {
      title: "Overview",
      path: paths.dashboard.crmAndSales.root.getHref(),
      icon: BarChart3,
    },
    {
      title: "Customers",
      path: paths.dashboard.crmAndSales.customer.root.getHref(),
      icon: UserIcon,
    },
    {
      title: "Leads",
      path: paths.dashboard.crmAndSales.leads.root.getHref(),
      icon: Users,
    },
  ],
};

const NETWORK_ORCHESTRATION_ITEM = {
  title: "Network & Orchestration",
  path: paths.dashboard.networkAndOrchestration.root.getHref(),
  heading: 'Infrastructure',
  icon: Network,
  children: [
    {
      title: "ION Radius",
      path: paths.dashboard.networkAndOrchestration.root.getHref(),
      icon: SquareRoundCorner,
      children: [
        {
          title: "Dashboard",
          path: paths.dashboard.networkAndOrchestration.radius.dashboard.getHref(),
          icon: BarChart2,
        },
        {
          title: "Router [NAS]",
          path: paths.dashboard.networkAndOrchestration.router.getHref(),
          icon: RouterIcon,
        },
        {
          title: "Customers",
          path: paths.dashboard.networkAndOrchestration.customer.root.getHref(),
          icon: UserIcon,
          children: [
            {
              title: "PPP Users",
              path: paths.dashboard.networkAndOrchestration.customer.root.getHref(),
              icon: Users,
            },
          ],
        },
        {
          title: "Service Plan",
          path: paths.dashboard.networkAndOrchestration.servicePlan.root.getHref(),
          icon: Package,
          children: [
            {
              title: "Bandwidth",
              path: paths.dashboard.networkAndOrchestration.servicePlan.bandwidth.getHref(),
              icon: Activity,
            },
            {
              title: "Profile Group",
              path: paths.dashboard.networkAndOrchestration.servicePlan.profileGroup.getHref(),
              icon: Users2,
            },
            {
              title: "PPP Profile",
              path: paths.dashboard.networkAndOrchestration.servicePlan.pppProfile.getHref(),
              icon: UserCheck2,
            },
          ],
        },
      ],
    },
    {
      title: "ODP | POP Data",
      path: paths.dashboard.networkAndOrchestration.odpPop.root.getHref(),
      icon: BoxIcon,
      children: [
        {
          title: "Manage ODP | POP",
          path: paths.dashboard.networkAndOrchestration.odpPop.manage.getHref(),
          icon: Settings,
        },
        {
          title: "View Map",
          path: paths.dashboard.networkAndOrchestration.odpPop.map.getHref(),
          icon: Map,
        },
      ],
    },
  ],
};

const TECHNICIAN_FIELD_ITEM = {
  title: "Technician & Field",
  path: paths.dashboard.technician.root.getHref(),
  heading: 'Infrastructure',
  icon: UserCog,
  children: [
    {
      title: "Dashboard",
      path: paths.dashboard.technician.dashboard.getHref(),
      icon: Gauge,
    },
    {
      title: "Work Orders",
      path: paths.dashboard.technician.root.getHref(),
      icon: ClipboardList,
    },
    {
      title: "Team Pairing",
      path: paths.dashboard.technician.teamPairing.getHref(),
      icon: UserCheck2,
    },
    {
      title: "NOC Queue",
      path: paths.dashboard.technician.nocQueue.getHref(),
      icon: ShieldCheck,
    },
  ],
};

const ORDERS_ITEM = {
  title: "Orders",
  path: paths.dashboard.operations.orders.root.getHref(),
  heading: 'Strategic',
  icon: Package,
};

const WAREHOUSE_ITEM = {
  title: "Warehouse",
  path: paths.dashboard.warehouse.root.getHref(),
  heading: 'Strategic',
  icon: Box,
};

const ADMINISTRATION_ITEMS = [
  {
    title: "Branch",
    path: paths.dashboard.administration.branch.root.getHref(),
    heading: 'Administration',
    icon: Building2,
    permission: ["master.read", "master.manage"],
    children: [
      {
        title: "Hierarchy",
        path: paths.dashboard.administration.branch.root.getHref(),
        icon: Building2,
        permission: "master.read",
      },
      {
        title: "Capability",
        path: paths.dashboard.administration.branch.capability.getHref(),
        icon: Settings,
        permission: "master.manage",
      },
      {
        title: "Coverage",
        path: paths.dashboard.administration.branch.coverage.getHref(),
        icon: Map,
        permission: "master.manage",
      },
      {
        title: "Policy",
        path: paths.dashboard.administration.branch.policy.getHref(),
        icon: ShieldCheck,
        permission: "master.manage",
      },
    ],
  },
  {
    title: "Users & Roles",
    path: paths.dashboard.administration.users.root.getHref(),
    heading: 'Administration',
    icon: UserCog,
    permission: ["user.manage", "role.manage"],
    children: [
      {
        title: "User Management",
        path: paths.dashboard.administration.users.root.getHref(),
        icon: UserIcon,
        permission: "user.manage",
      },
      {
        title: "Role Management",
        path: paths.dashboard.administration.roles.root.getHref(),
        icon: ShieldCheck,
        permission: "role.manage",
      },
    ],
  },
  {
    title: "Schema Builder",
    path: paths.dashboard.administration.schema.root.getHref(),
    heading: 'Administration',
    icon: FileText,
    permission: "master.manage",
  },
  {
    title: "Customer Types",
    path: paths.dashboard.administration.customerTypes.getHref(),
    heading: 'Administration',
    icon: Users2,
    permission: "master.manage",
  },
  {
    title: "Products",
    path: paths.dashboard.administration.products.root.getHref(),
    heading: 'Administration',
    icon: Package,
    permission: "master.manage",
  },
  {
    title: "Audit Log",
    path: paths.dashboard.administration.auditLog.getHref(),
    heading: 'Administration',
    icon: ScrollText,
    permission: "audit.read",
  },
  {
    title: "Access Policies",
    path: paths.dashboard.administration.accessPolicies.getHref(),
    heading: 'Administration',
    icon: ShieldCheck,
    permission: "access.read",
  },
];

// Menu untuk halaman dashboard (production/main app)
export const DASHBOARD_MENU: MenuConfig = [
  DASHBOARD_ITEM,
  CRM_SALES_ITEM,
  NETWORK_ORCHESTRATION_ITEM,
  TECHNICIAN_FIELD_ITEM,
  WAREHOUSE_ITEM,
  ORDERS_ITEM,
  ...ADMINISTRATION_ITEMS,
];

// Menu khusus untuk technician role
export const TECHNICIAN_MENU: MenuConfig = [
  // DASHBOARD_ITEM,
  TECHNICIAN_FIELD_ITEM,
];

// Export default untuk backward compatibility
export const MENU = DOCS_MENU;