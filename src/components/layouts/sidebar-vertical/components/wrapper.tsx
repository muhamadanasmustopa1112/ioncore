import { Eye, Funnel, MessageSquareCode, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLayout } from "./context";
import { useLayout as useLayoutContext } from "@/components/layouts/context/layout-context";
import { Header } from "./header";
import { HeaderBreadcrumbs } from "./header-breadcrumbs";
import { Sidebar } from "./sidebar";
import { Toolbar, ToolbarActions, ToolbarHeading } from "./toolbar";
import { ToolbarMenu } from "./toolbar-menu";
import { ToolbarMenuMobile } from "./toolbar-menu-mobile";
import { HeaderThin } from "@/components/layouts/sidebar-vertical/components/header-thin";
import { ContentHeader } from "@/components/common/content-header";
import { ToolbarTitle } from "@/components/common/toolbar";

export function Wrapper({ children }: { children: React.ReactNode }) {
  const { sidebarCollapse } = useLayoutContext();
  const { isMobile } = useLayout();

  const rootProps = {
    className: cn(
      'flex grow h-screen flex-col',
      '[--header-height:40px]',
      '[--content-header-height:54px]',
      '[--sidebar-width:250px] [--sidebar-width-collapsed:52px] [--sidebar-header-height:54px] [--sidebar-footer-height:45px] [--sidebar-footer-collapsed-height:90px]',
    ),
    ...(sidebarCollapse === true && { 'data-sidebar-collapsed': true }),
  };

  return (
    <div {...rootProps}>
      <Header />
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        <main className="flex-1 flex flex-col mt-(--header-height) lg:mt-[calc(var(--header-height)+var(--content-header-height))] lg:ms-(--sidebar-width) lg:in-data-[sidebar-collapsed]:ms-(--sidebar-width-collapsed) transition-[margin] duration-200 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  );
}
