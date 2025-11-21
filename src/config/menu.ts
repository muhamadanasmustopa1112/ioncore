import {
  BarChart3,
  Box,
  Columns,
  FileChartLine,
  FileText,
  PanelsTopLeft,
  PanelTop,
  Presentation,
  Settings,
  SquareKanban,
  StickyNote,
  User,
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
    path: paths.dashboard.masterData.root.getHref(),
    icon: Box,
    children: [
      {
        title: "Layout Experiences",
        path: paths.dashboard.oneColDrawer.root.getHref(),
        icon: Users,
        children: [
          {
            title: "1 Col Pop Up Drawer",
            path: paths.dashboard.oneColDrawer.root.getHref(),
            icon: PanelTop,
          },
          {
            title: "1 Col New Page",
            path: paths.dashboard.oneColNewPage.root.getHref(),
            icon: StickyNote,
          },
          {
            title: "1 Col to 2 Col Drawer",
            path: paths.dashboard.oneColToTwoCol.root.getHref(),
            icon: PanelsTopLeft,
          },
          {
            title: "2 Col Section",
            path: paths.dashboard.twoColTwoCard.root.getHref(),
            icon: Columns,
          },
        ],
      },
    ],
  },
  {
    title: "Project",
    path: paths.dashboard.project.root.getHref(),
    icon: Presentation,
    children: [
      {
        title: "Task Board",
        path: paths.dashboard.project.root.getHref(),
        icon: SquareKanban,
        children: [
          {
            title: "Kanban",
            path: paths.dashboard.kanban.root.getHref(),
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
        path: paths.dashboard.project.root.getHref(),
        icon: SquareKanban,
      },
      {
        title: "test 2",
        path: paths.dashboard.project.root.getHref(),
        icon: SquareKanban,
      },
      {
        title: "test 3",
        path: paths.dashboard.project.root.getHref(),
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