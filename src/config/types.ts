import { type LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
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
  /**
   * Permission name(s) required to see this item, e.g. "user.manage".
   * Array = user must hold at least ONE (unless requireAll=true).
   * Omitted = visible to all authenticated users.
   */
  permission?: string | string[];
  requireAll?: boolean;
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

