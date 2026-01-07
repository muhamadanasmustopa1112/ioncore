import {
  BarChart3,
  Box,
  Columns,
  Dot,
  FileChartLine,
  FileText,
  PanelsTopLeft,
  PanelTop,
  Presentation,
  Settings,
  ShieldUser,
  SquareKanban,
  StickyNote,
  User,
  Users,
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
    title: "My Dashboard",
    path: paths.dashboard.root.getHref(),
    heading: 'Dashboard',
    icon: BarChart3,
  },
  {
    title: "Users",
    path: paths.dashboard.user.root.getHref(),
    heading: 'Master',
    icon: Users,
    children: [
      {
        title: "Role",
        path: paths.dashboard.role.root.getHref(),
        icon: Dot,
      },
      {
        title: "Employees",
        path: paths.dashboard.employees.root.getHref(),
        icon: Dot,
        children: [
          {
            title: "Department",
            path: paths.dashboard.department.root.getHref(),
          },
          {
            title: "Division",
            path: paths.dashboard.division.root.getHref(),
          },
          {
            title: "Position",
            path: paths.dashboard.position.root.getHref(),
          },
          {
            title: "Employee",
            path: paths.dashboard.employee.root.getHref(),
          },
        ],
      },
    ],
  },
  {
    title: "Access Management",
    path: paths.dashboard.accessManagement.root.getHref(),
    heading: 'Master',
    icon: ShieldUser,
  },
];

// Export default untuk backward compatibility
export const MENU = DOCS_MENU;