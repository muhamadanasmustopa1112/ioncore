import { type LucideIcon } from "lucide-react";

export interface MenuItem {
  title?: string;
  icon?: LucideIcon;
  path?: string;
  rootPath?: string;
  childrenIndex?: number;
  heading?: string;
  children?: MenuConfig;
  disabled?: boolean;
  collapse?: boolean;
  collapseTitle?: string;
  expandTitle?: string;
  badge?: string;
  separator?: boolean;
}

export type MenuConfig = MenuItem[];

export interface NavItem {
  id: string;
  title?: string;
  icon?: LucideIcon;
  path?: string;
  badge?: string;
  pinnable?: boolean;
  pinned?: boolean;
  soon?: boolean;
  new?: {
    tooltip: string;
    path: string;
  };
  more?: true;
  dropdown?: true;
}

export type NavConfig = NavItem[];

