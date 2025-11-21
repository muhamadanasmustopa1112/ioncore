import { Fragment, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU, MENU_SIDEBAR_MAIN } from "@/config/layout-14.config";
import { MenuItem } from "@/config/types";
import { useMenu } from "@/hooks/use-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface ToolbarHeadingProps {
  title?: string | ReactNode;
  description?: string | ReactNode;
}

function Toolbar({ children }: { children?: ReactNode }) {
  return (
    <div className="bg-background border-border start-[calc(var(--sidebar-width))] end-0 top-(--header-height) z-10 flex min-h-(--toolbar-height) shrink-0 flex-wrap items-center justify-between gap-2.5 border-b px-5 py-2.5 transition-all duration-300 lg:fixed lg:py-0 lg:in-data-[sidebar-open=false]:start-[calc(var(--sidebar-collapsed-width))]">
      {children}
    </div>
  );
}

function ToolbarActions({ children }: { children?: ReactNode }) {
  return <div className="flex items-center gap-2.5">{children}</div>;
}

function ToolbarBreadcrumbs() {
  const pathname = usePathname();
  const { getBreadcrumb } = useMenu(pathname);
  const items: MenuItem[] = getBreadcrumb(MENU);

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={index}>
              {index !== items.length - 1 && (
                <BreadcrumbSeparator className="text-muted-foreground text-xs">
                  /
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                {!isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.path || "#"}>{item.title}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function ToolbarHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col flex-wrap gap-1 md:flex-row md:items-center lg:gap-5">
      {children}
    </div>
  );
}

function ToolbarPageTitle({ children }: { children?: string }) {
  const pathname = usePathname();
  const { getCurrentItem } = useMenu(pathname);
  const item = getCurrentItem(MENU_SIDEBAR_MAIN);

  return (
    <h1 className="text-foreground text-base leading-none font-medium">
      {children ? children : item?.title || "Untitled"}
    </h1>
  );
}

function ToolbarDescription({ children }: { children: ReactNode }) {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm font-normal">
      {children}
    </div>
  );
}

export {
  Toolbar,
  ToolbarActions,
  ToolbarBreadcrumbs,
  ToolbarHeading,
  ToolbarPageTitle,
  ToolbarDescription,
};
