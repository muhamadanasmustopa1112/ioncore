import { Eye, Funnel, MessageSquareCode, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLayout } from "./context";
import { Header } from "./header";
import { HeaderBreadcrumbs } from "./header-breadcrumbs";
import { Sidebar } from "./sidebar";
import { Toolbar, ToolbarActions, ToolbarHeading } from "./toolbar";
import { ToolbarMenu } from "./toolbar-menu";
import { ToolbarMenuMobile } from "./toolbar-menu-mobile";

export function Wrapper({ children }: { children: React.ReactNode }) {
  const { isMobile } = useLayout();

  return (
    <>
      <Header />
      {!isMobile && <Sidebar />}

      <div className="grow overflow-y-auto pt-(--header-height-mobile) transition-all duration-300 lg:ps-(--sidebar-width) lg:pt-[calc(var(--header-height)+var(--toolbar-height))] lg:in-data-[sidebar-open=false]:ps-(--sidebar-collapsed-width)">
        <Toolbar>
          <ToolbarHeading>
            {isMobile ? <ToolbarMenuMobile /> : <ToolbarMenu />}
          </ToolbarHeading>
          <ToolbarActions>
            <Button size="sm" variant="outline">
              <Funnel />
              Sort
            </Button>
            <Button size="sm" variant="outline">
              <Eye />
              View
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquareCode />
              Filter
            </Button>
            <Button size="sm" variant="outline" mode="icon">
              <Search />
            </Button>
          </ToolbarActions>
        </Toolbar>

        <main
          className="grow p-5 group-data-[theme-content-layout=centered]/layout:container group-data-[theme-content-layout=centered]/layout:mx-auto"
          role="content"
        >
          {isMobile && <HeaderBreadcrumbs />}
          {children}
        </main>
      </div>
    </>
  );
}
