'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Ellipsis, Pin, PinOff, Plus, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuIndicator,
  AccordionMenuItem,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
} from '@/components/ui/accordion-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLayout } from '@/components/layouts/context/layout-context';
import { MenuItem, type NavItem } from '@/config/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Menu, MenuContent, MenuGroup, MenuItem as MenuItemUI, MenuSubmenuRoot, MenuSubmenuTrigger, MenuTrigger } from '@/components/ui/base-menu';

function TasksDropdownMenu({ trigger }: { trigger: React.ReactNode }) {
  const { pinSidebarNavItem, sidebarCollapse } = useLayout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          {sidebarCollapse ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{trigger}</span>
              </TooltipTrigger>
              <TooltipContent align="center" side="right" sideOffset={28}>
                Tasks
              </TooltipContent>
            </Tooltip>
          ) : (
            trigger
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align={sidebarCollapse ? 'start' : 'start'}
        side={sidebarCollapse ? 'right' : 'bottom'}
        sideOffset={sidebarCollapse ? 20 : 10}
        alignOffset={sidebarCollapse ? -7 : 5}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Plus />
            <span>Add Task</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Recent</DropdownMenuLabel>
          <DropdownMenuItem>
            <StickyNote />
            <span>Recent 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <StickyNote />
            <span>Recent 2</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => pinSidebarNavItem('tasks')}>
          <PinOff />
          <span>Unpin from sidebar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MoreDropdownMenu({ item }: { item: MenuItem }) {
  const {
    isSidebarNavItemPinned,
    unpinSidebarNavItem,
    pinSidebarNavItem,
    sidebarCollapse,
    getSidebarNavItems,
  } = useLayout();

  // Memoize the pinnable nav items to prevent unnecessary re-computations
  const pinnableNavItems = useMemo(() => {
    const navItems = getSidebarNavItems().find((menu) => item == menu)?.children;
    return navItems;
  }, [getSidebarNavItems]);

  const handlePin = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (isSidebarNavItemPinned(id)) {
      unpinSidebarNavItem(id);
    } else {
      pinSidebarNavItem(id);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{item.icon && <item.icon />}</span>
          </TooltipTrigger>
          <TooltipContent align="center" side="right" sideOffset={28}>
            {item.title}
          </TooltipContent>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent className='bg-sidebar-main text-sidebar-main-foreground' side='right' sideOffset={22}>
        {pinnableNavItems?.map((selectedMenuItem) => (
            <div key={selectedMenuItem.title}>
              {
                selectedMenuItem.children ? (
                  <Popover>
                    <PopoverTrigger className='flex items-center justify-between gap-2.5 w-full'>
                      <div className='flex items-center gap-2.5'>
                        {selectedMenuItem.icon && <selectedMenuItem.icon />}
                        <span>{selectedMenuItem.title}</span>
                      </div>
                      <ChevronRight className='size-4 shrink-0 transition-transform duration-200' />
                    </PopoverTrigger>
                    <PopoverContent className='bg-sidebar-main text-sidebar-main-foreground' side='right' sideOffset={22}>
                      {selectedMenuItem.children.map((child) => (
                        <div className='py-1.5' key={child.title}>
                          <NavItem item={child} />
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className='py-1.5' key={selectedMenuItem.title}>
                    <NavItem item={selectedMenuItem} />
                  </div>
                )
              }
            </div>
          ))}
      </PopoverContent>
    </Popover>
  );
}

function NavItem({ item }: { item: MenuItem }) {
  const trigger = (
    <Button
      variant="ghost"
      className="size-6 hover:bg-input in-data-[state=open]:bg-input"
      size="icon"
    >
      <Ellipsis className="size-3.5" />
    </Button>
  );

  let mainContent: React.ReactNode = null;
  if (item.children) {
    if (item.title === 'more') {
      mainContent = <MoreDropdownMenu item={item} />;
    } else {
      // Add other dropdowns if needed
      mainContent = null;
    }
  } else if (item.path) {
    mainContent = (
      <Link
        href={item.path}
        className="flex items-center grow gap-2.5"
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
      </Link>
    );
  } else {
    mainContent = (
      <div className="flex items-center grow gap-2.5">
        {item.icon && <item.icon />}
        <span>{item.title}</span>
      </div>
    );
  }

  return (
    <>
      {mainContent}
      {/* {(item.more || item.new) && (
        <div className="opacity-0 flex items-center gap-1 group-hover:opacity-100 [&:has([data-state=open])]:opacity-100">
          {item.more && (
            <>
              {item.id === 'tasks' && <TasksDropdownMenu trigger={trigger} />}
            </>
          )}
          {item.new && (
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="size-6 hover:bg-input"
                  size="icon"
                >
                  <Link href={item.new.path}>
                    <Plus className="size-3.5 opacity-100" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent align="center" side="right" sideOffset={28}>
                {item.new.tooltip}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )} */}
      {item.badge && (
        <Badge
          size="xs"
          variant="primary"
          className="text-[11px] group-hover:hidden group-has-[[data-state=open]]:hidden me-1"
        >
          {item.badge}
        </Badge>
      )}
    </>
  );
}

function NavItemCollapsed({ item }: { item: MenuItem }) {
  // Dropdown case (e.g. tasks)
  if (item.children && item.title === 'tasks') {
    return <TasksDropdownMenu trigger={item.icon && <item.icon />} />;
  }

  // More case
  if (item.children) {
    return <MoreDropdownMenu item={item} />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {item.path ? (
          <Link href={item.path}>{item.icon && <item.icon />}</Link>
        ) : (
          <span>{item.icon && <item.icon />}</span>
        )}
      </TooltipTrigger>
      <TooltipContent align="center" side="right" sideOffset={28}>
        {item.title}
      </TooltipContent>
    </Tooltip>
  );
}

function RecursiveNavContent({
  items,
  parentValue,
  level = 0,
}: {
  items: MenuItem[];
  parentValue: string;
  level?: number;
}) {
  const { sidebarCollapse } = useLayout();

  return (
    <AccordionMenuGroup>
      {items.map((item) => {
        const value = item.path || item.title;

        if (sidebarCollapse) {
          return (
            <AccordionMenuItem
              key={item.title}
              asChild
              value={value}
              className='text-sidebar-main-foreground hover:text-primary'
            >
              <div>
                <NavItemCollapsed item={item} />
              </div>
            </AccordionMenuItem>
          );
        }

        if (item.children) {
          return (
            <AccordionMenuSub key={item.title} value={value}>
              <AccordionMenuSubTrigger className='text-sidebar-main-foreground hover:text-primary'>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <AccordionMenuIndicator />
              </AccordionMenuSubTrigger>
              <AccordionMenuSubContent
                type="multiple"
                parentValue={value}
                className={cn(level === 0 ? 'ps-5' : 'ps-3 border-s border-border/40 ms-2')}
              >
                <RecursiveNavContent
                  items={item.children}
                  parentValue={value}
                  level={level + 1}
                />
              </AccordionMenuSubContent>
            </AccordionMenuSub>
          );
        }

        return (
          <AccordionMenuItem
            key={item.title}
            asChild
            value={value}
            className='text-sidebar-main-foreground hover:text-primary'
          >
            <div>
              <NavItem item={item} />
            </div>
          </AccordionMenuItem>
        );
      })}
    </AccordionMenuGroup>
  );
}

const MENU_KEY_MAP: Record<string, string> = {
  'Dashboard': 'menu.dashboard',
  'CRM & Sales': 'menu.crmAndSales',
  'Overview': 'menu.overview',
  'Customers': 'menu.customers',
  'Leads': 'menu.leads',
  'Network & Orchestration': 'menu.networkOrchestration',
  'ODP & POP Map': 'menu.odpPopMap',
  'ODP & POP': 'menu.odpPop',
  'RADIUS': 'menu.radius',
  'Technician & Field': 'menu.technicianField',
  'Work Orders': 'menu.workOrders',
  'Orders': 'menu.orders',
  'Administration': 'menu.administration',
  'Branch': 'menu.branch',
  'Users': 'menu.users',
  'Warehouse': 'menu.warehouse',
  'Schema': 'menu.schema',
  'General': 'common.general',
  'Infrastructure': 'common.infrastructure',
  'Strategic': 'common.strategic',
  'Admin': 'common.admin',
  // Network & Orchestration sub-items
  'ION Radius': 'menu.ionRadius',
  'Router [NAS]': 'menu.routerNas',
  'PPP Users': 'menu.pppUsers',
  'Service Plan': 'menu.servicePlan',
  'Bandwidth': 'menu.bandwidth',
  'Profile Group': 'menu.profileGroup',
  'PPP Profile': 'menu.pppProfile',
  'ODP | POP Data': 'menu.odpPopData',
  'Manage ODP | POP': 'menu.manageOdpPop',
  'View Map': 'menu.viewMap',
  // Technician sub-items
  'Team Pairing': 'menu.teamPairing',
  'NOC Queue': 'menu.nocQueue',
  // Administration sub-items
  'Hierarchy': 'menu.hierarchy',
  'Capability': 'menu.capability',
  'Coverage': 'menu.coverage',
  'Policy': 'menu.policy',
  'Users & Roles': 'menu.usersAndRoles',
  'User Management': 'menu.userManagement',
  'Role Management': 'menu.roleManagement',
  'Schema Builder': 'menu.schemaBuilder',
  'Customer Types': 'menu.customerTypes',
  'Products': 'menu.products',
  'Audit Log': 'menu.auditLog',
  'Access Policies': 'menu.accessPolicies',
};

function translateMenuItem(item: MenuItem, t: (key: string) => string): MenuItem {
  const key = MENU_KEY_MAP[item.title] || item.title;
  const translatedTitle = t(key) !== key ? t(key) : item.title;

  return {
    ...item,
    title: translatedTitle,
    heading: item.heading ? (MENU_KEY_MAP[item.heading] ? t(MENU_KEY_MAP[item.heading]) : item.heading) : undefined,
    children: item.children?.map(child => translateMenuItem(child, t)),
  };
}

export function SidebarDefaultNav() {
  const pathname = usePathname();
  const { getSidebarNavItems, sidebarCollapse } = useLayout();
  const { t } = useTranslation();

  // Memoize the filtered nav items to prevent unnecessary re-computations
  const filteredNavItems = useMemo(() => {
    const navItems = getSidebarNavItems();
    return navItems.map(item => translateMenuItem(item, t));
  }, [getSidebarNavItems, t]);

  const groupedNavItems = useMemo(() => {
    const groups = new Map<string, typeof filteredNavItems>();
    filteredNavItems.forEach((item) => {
      const key = item.heading || "__no_heading__";
      if (!groups.has(key)) groups.set(key, [] as typeof filteredNavItems);
      groups.get(key)!.push(item);
    });

    return Array.from(groups.entries()).map(([heading, items]) => ({
      heading: heading === "__no_heading__" ? null : heading,
      items,
    }));
  }, [filteredNavItems]);

  const matchPath = (path: string) => path === pathname;

  return (
    <div className="px-(--sidebar-space-x)">
      <AccordionMenu
        type="multiple"
        matchPath={matchPath}
        classNames={{
          root: 'grow space-y-4 shrink-0',
          item: 'group py-0 h-8 [&:has([data-state=open])]:bg-accent justify-between cursor-pointer',
          subTrigger: 'h-8 py-0 px-3 gap-2.5 [&_svg:not([class*=size-])]:size-5',
        }}
      >
        {groupedNavItems.map((group, gIndex) => (
          <div key={group.heading ?? gIndex}>
            {!sidebarCollapse && group.heading && (
              <h1 className='text-[10px] px-3 text-muted-foreground/50 font-bold uppercase tracking-wider mb-2 mt-4'>{group.heading}</h1>
            )}
            <RecursiveNavContent items={group.items} parentValue="root" />
          </div>
        ))}
      </AccordionMenu>
    </div>
  );
}
