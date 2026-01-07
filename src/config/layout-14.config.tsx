import {
  BarChart2,
  BarChart3,
  Bolt,
  Box,
  Briefcase,
  Calendar,
  ChartLine,
  ClipboardList,
  Cog,
  Columns,
  Download,
  FileChartLine,
  FileText,
  Grid,
  Handshake,
  Megaphone,
  Newspaper,
  Palette,
  PanelsTopLeft,
  PanelTop,
  Presentation,
  Settings,
  Square,
  SquareActivity,
  SquareKanban,
  StickyNote,
  User,
  UserRoundCog,
  Users,
} from "lucide-react";
import { paths } from "@/config/paths";
import { MenuConfig } from "@/config/types";

export const MENU: MenuConfig = [
  {
    title: "Dashboard",
    path: paths.dashboard.root.getHref(),
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
            title: "1 Col with Pop Up Drawer",
            path: paths.docs.oneColDrawer.root.getHref(),
            icon: PanelTop,
          },
          {
            title: "1 Col with New Page",
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

export const MENU_PAGES: MenuConfig = [
  {
    title: "Dashboard",
    path: paths.dashboard.root.getHref(),
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
            title: "1 Col with Pop Up Drawer",
            path: paths.docs.oneColDrawer.root.getHref(),
            icon: PanelTop,
          },
          {
            title: "1 Col with New Page",
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

export const MENU_SIDEBAR_MAIN: MenuConfig = [
  {
    title: "Dashboard",
    path: paths.dashboard.root.getHref(),
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
            title: "1 Col with Pop Up Drawer",
            path: paths.docs.oneColDrawer.root.getHref(),
            icon: PanelTop,
          },
          {
            title: "1 Col with New Page",
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

export const MENU_SIDEBAR_RESOURCES: MenuConfig = [
  {
    title: "Resources",
    children: [
      {
        title: "About Metronic",
        path: "#",
        icon: Download,
      },
      {
        title: "Advertise",
        path: "#",
        icon: FileChartLine,
        badge: "Pro",
      },
      {
        title: "Help",
        path: "#",
        icon: SquareActivity,
      },
      {
        title: "Blog",
        path: "#",
        icon: Newspaper,
      },
      {
        title: "Careers",
        path: "#",
        icon: Briefcase,
      },
      {
        title: "Press",
        path: "#",
        icon: Megaphone,
      },
    ],
  },
];

export const MENU_SIDEBAR_WORKSPACES: MenuConfig = [
  {
    title: "Workspaces",
    children: [
      {
        title: "Business Concepts",
        path: "#",
        icon: Briefcase,
      },
      {
        title: "KeenThemes Studio",
        path: "#",
        icon: Palette,
      },
      {
        title: "Teams",
        path: "#",
        icon: Handshake,
        badge: "Pro",
      },
      {
        title: "Reports",
        path: "#",
        icon: BarChart2,
      },
    ],
  },
];

export const MENU_TOOLBAR: MenuConfig = [
  {
    title: "List",
    path: "/layout-14",
    icon: ClipboardList,
  },
  {
    title: "Kanban",
    path: "#",
    icon: Grid,
  },
  {
    title: "Calendar",
    path: "#",
    icon: Calendar,
  },
  {
    title: "Dashboard",
    path: "#",
    icon: Bolt,
  },
];
