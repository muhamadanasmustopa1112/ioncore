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
  Settings,
  Square,
  SquareActivity,
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
    children: [
      {
        children: [
          {
            title: "Dashboard",
            path: paths.dashboard.root.getHref(),
            icon: BarChart3,
          },
        ],
      },
    ],
  },
  {
    title: "Master Data",
    path: paths.dashboard.masterData.root.getHref(),
    icon: Box,
    children: [
      {
        children: [
          {
            title: "Blank Page MD",
            path: paths.dashboard.masterData.root.getHref(),
            icon: FileText,
          },
        ],
      },
      {
        title: "Pages",
        path: paths.dashboard.oneColDrawer.root.getHref(),
        icon: Users,
        children: [
          {
            title: "1 Col Drawer",
            path: paths.dashboard.oneColDrawer.root.getHref(),
            icon: Square,
          },
          {
            title: "1 Col New Page",
            path: "#",
            icon: StickyNote,
          },
          {
            title: "1 Col to 2 Col",
            path: "#",
            icon: Columns,
          },
          {
            title: "2 Col 2 Card",
            path: "#",
            icon: Columns,
          },
        ],
      },
    ],
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
    children: [
      {
        title: "Pages",
        path: "#",
        icon: Bolt,
        children: [
          {
            title: "1 Column",
            path: paths.dashboard.employee.list.getHref(),
            icon: Bolt,
          },
          {
            title: "2 Column",
            path: paths.dashboard.employee.twoColumnCard.getHref(),
            icon: Bolt,
          },
        ],
      },
    ],
  },
];

export const MENU_SIDEBAR_MAIN: MenuConfig = [
  {
    children: [
      {
        title: "Home",
        path: "#",
        icon: Bolt,
      },
      {
        title: "Updates",
        path: "/layout-14",
        icon: Users,
      },
      {
        title: "Inbox",
        path: "#",
        icon: UserRoundCog,
      },
      {
        title: "Clients",
        path: "#",
        icon: Cog,
        badge: "Beta",
      },
      {
        title: "My Tasks",
        path: "#",
        icon: ChartLine,
      },
    ],
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
