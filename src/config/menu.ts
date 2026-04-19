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
  Wallet,
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
// Menu untuk halaman dashboard (production/main app)
export const DASHBOARD_MENU: MenuConfig = [
  {
    title: "Dashboard",
    path: paths.dashboard.root.getHref(),
    heading: 'General',
    icon: BarChart3,
  },
  {
    title: "CRM & Sales",
    path: paths.dashboard.crmAndSales.root.getHref(),
    heading: 'General',
    icon: UserSearch,
  },
  {
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
  },
  {
    title: "Technician & Field",
    path: paths.dashboard.technician.root.getHref(),
    heading: 'Infrastructure',
    icon: UserCog,
  },
  {
    title: "Warehouse & Asset",
    path: "#",
    heading: 'Infrastructure',
    icon: BookMinus,
  },
  {
    title: "Billing & Finance",
    path: "#",
    heading: 'Finance & Support',
    icon: Wallet,
  },
  {
    title: "Customer Service",
    path: "#",
    heading: 'Finance & Support',
    icon: Headset,
  },
  {
    title: "Operations",
    path: paths.dashboard.operations.root.getHref(),
    heading: 'Strategic',
    icon: Activity,
    children: [
      {
        title: "Work Orders",
        path: paths.dashboard.operations.workOrders.root.getHref(),
        icon: Wrench,
      },
    ],
  },
  {
    title: "Enterprise System",
    path: "#",
    heading: 'Strategic',
    icon: Network,
  },
  {
    title: "Intelligence Center",
    path: "#",
    heading: 'Strategic',
    icon: Activity,
  },
  {
    title: "War Room",
    path: "#",
    heading: 'Strategic',
    icon: Activity,
  },
  {
    title: "Branch",
    path: paths.dashboard.administration.branch.root.getHref(),
    heading: 'Administration',
    icon: Building2,
    children: [
      {
        title: "Hierarchy",
        path: paths.dashboard.administration.branch.root.getHref(),
        icon: Building2,
      },
      {
        title: "Capability",
        path: paths.dashboard.administration.branch.capability.getHref(),
        icon: Settings,
      },
      {
        title: "Coverage",
        path: paths.dashboard.administration.branch.coverage.getHref(),
        icon: Map,
      },
      {
        title: "Policy",
        path: paths.dashboard.administration.branch.policy.getHref(),
        icon: ShieldCheck,
      },
      {
        title: "Cross-branch Rules",
        path: paths.dashboard.administration.branch.crossBranchRules.getHref(),
        icon: ArrowLeftRight,
      },
      {
        title: "Resource Mapping",
        path: paths.dashboard.administration.branch.resourceMapping.getHref(),
        icon: Users2,
      },
      {
        title: "Access Scope",
        path: paths.dashboard.administration.branch.accessScope.getHref(),
        icon: KeyRound,
      },
      {
        title: "Performance",
        path: paths.dashboard.administration.branch.performance.getHref(),
        icon: Gauge,
      },
    ],
  },
  {
    title: "Users & Roles",
    path: paths.dashboard.administration.users.root.getHref(),
    heading: 'Administration',
    icon: UserCog,
    children: [
      {
        title: "User Management",
        path: paths.dashboard.administration.users.root.getHref(),
        icon: UserIcon,
      },
      {
        title: "Role Management",
        path: paths.dashboard.administration.roles.root.getHref(),
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "Schema Builder",
    path: paths.dashboard.administration.schema.root.getHref(),
    heading: 'Administration',
    icon: FileText,
  },
  {
    title: "Checklist",
    path: paths.dashboard.administration.checklist.root.getHref(),
    heading: 'Administration',
    icon: ClipboardList,
    children: [
      {
        title: "Templates",
        path: paths.dashboard.administration.checklist.templates.getHref(),
        icon: ClipboardList,
      },
      {
        title: "Override & Exception",
        path: paths.dashboard.administration.checklist.overrides.getHref(),
        icon: ShieldAlert,
      },
      {
        title: "Versioning & Publish",
        path: paths.dashboard.administration.checklist.versioning.getHref(),
        icon: GitBranch,
      },
      {
        title: "Binding Matrix",
        path: paths.dashboard.administration.checklist.binding.getHref(),
        icon: LayoutGrid,
      },
    ],
  },
  {
    title: "Platform Config",
    path: paths.dashboard.administration.platformConfig.getHref(),
    heading: 'Administration',
    icon: SlidersHorizontal,
  },
  {
    title: "Master Data",
    path: paths.dashboard.administration.masterData.getHref(),
    heading: 'Administration',
    icon: Database,
  },
  {
    title: "Audit Log",
    path: paths.dashboard.administration.auditLog.getHref(),
    heading: 'Administration',
    icon: ScrollText,
  },
];
// Export default untuk backward compatibility
export const MENU = DOCS_MENU;