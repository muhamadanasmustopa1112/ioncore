'use client';

import { Metadata } from "next";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Wrapper } from "./components/wrapper";
import { LayoutProvider } from "@/components/layouts/context/layout-context";
import { LayoutProvider as SidebarLayoutProvider } from "./components/context";
import { MAIN_NAV } from "@/config/layout-15.config";
import { DOCS_MENU, DASHBOARD_MENU, TECHNICIAN_MENU } from "@/config/menu";
import { useFilteredMenu } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";

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
  
  const rawUser = useAuthStore((s) => s.rawUser);
  
  // Tentukan menu berdasarkan pathname dan role user
  const baseMenu = useMemo(() => {
    if (pathname.startsWith('/docs')) {
      return DOCS_MENU;
    }

    // Explicit routing untuk role Technician/Field Staff
    const isRestricted = rawUser?.roles?.some((r) => {
      const rn = (r.name || "").toLowerCase();
      return rn.includes("technician") || rn.includes("leader");
    });

    if (isRestricted) {
      return TECHNICIAN_MENU;
    }

    return DASHBOARD_MENU;
  }, [pathname, rawUser]);

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
