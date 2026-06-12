'use client';

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Wrapper } from "./components/wrapper";
import { LayoutProvider } from "@/components/layouts/context/layout-context";
import { LayoutProvider as SidebarLayoutProvider } from "./components/context";
import { DOCS_MENU, DASHBOARD_MENU } from "@/config/menu";
import { useFilteredMenu } from "@/lib/permissions";

// Generate metadata for the layout
// export async function generateMetadata(): Promise<Metadata> {
//   // You can access route params here if needed
//   // const { params } = props;

//   return {
//     title: "Dashboard",
//     description: "",
//   };
// }

export function SidebarVerticalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const baseMenu = useMemo(() => {
    if (pathname.startsWith("/docs")) {
      return DOCS_MENU;
    }
    return DASHBOARD_MENU;
  }, [pathname]);

  const currentMenu = useFilteredMenu(baseMenu);

  return (
    <LayoutProvider
      // style={
      //   {
      //     "--sidebar-width": "300px",
      //     "--sidebar-collapsed-width": "60px",
      //     "--sidebar-header-height": "54px",
      //     "--header-height": "60px",
      //     "--header-height-mobile": "60px",
      //   } as React.CSSProperties
      // }
      sidebarNavItems={currentMenu}
    >
      <SidebarLayoutProvider>
        <Wrapper>{children}</Wrapper>
      </SidebarLayoutProvider>
    </LayoutProvider>
  );
}
