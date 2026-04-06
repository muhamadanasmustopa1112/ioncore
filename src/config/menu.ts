import {
  Activity,
  BarChart2,
  BarChart3,
  BookMinus,
  Box,
  BoxIcon,
  Columns,
  FileChartLine,
  FileText,
  Headset,
  Map,
  Network,
  Package,
  PanelsTopLeft,
  PanelTop,
  Presentation,
  RouterIcon,
  Settings,
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
        path: paths.dashboard.accessManagement.root.getHref(),
        icon: SquareRoundCorner,
        children: [
          {
            title: "Dashboard",
            path: paths.dashboard.accessManagement.root.getHref(),
            icon: BarChart2,
          },
          {
            title: "Router [NAS]",
            path: paths.dashboard.accessManagement.root.getHref(),
            icon: RouterIcon,
          },
          {
            title: "Customers",
            path: paths.dashboard.division.root.getHref(),
            icon: UserIcon,
            children: [
              {
                title: "PPP Users",
                path: paths.dashboard.accessManagement.root.getHref(),
                icon: Users,
              },
            ],
          },
          {
            title: "Service Plan",
            path: paths.dashboard.accessManagement.root.getHref(),
            icon: Package,
            children: [
              {
                title: "Bandwidth",
                path: paths.dashboard.accessManagement.root.getHref(),
                icon: Activity,
              },
              {
                title: "Profile Group",
                path: paths.dashboard.accessManagement.root.getHref(),
                icon: Users2,
              },
              {
                title: "PPP Profile",
                path: paths.dashboard.accessManagement.root.getHref(),
                icon: UserCheck2,
              },
            ],
          },
        ],
      },
      {
        title: "ODP | POP Data",
        path: paths.dashboard.odpPop.root.getHref(),
        icon: BoxIcon,
        children: [
          {
            title: "Manage ODP | POP",
            path: paths.dashboard.accessManagement.root.getHref(),
            icon: Settings,
          },
          {
            title: "View Map",
            path: paths.dashboard.accessManagement.root.getHref(),
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
    title: "Administration",
    path: "#",
    heading: 'System',
    icon: Settings,
  },
];
// Export default untuk backward compatibility
export const MENU = DOCS_MENU;