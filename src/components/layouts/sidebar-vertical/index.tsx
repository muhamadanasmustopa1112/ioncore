import { Metadata } from "next";
import { Wrapper } from "./components/wrapper";
import { LayoutProvider } from "@/components/layouts/context/layout-context";
import { LayoutProvider as SidebarLayoutProvider } from "./components/context";
import { MAIN_NAV } from "@/config/layout-15.config";
import { MENU } from "@/config/menu";

// Generate metadata for the layout
export async function generateMetadata(): Promise<Metadata> {
  // You can access route params here if needed
  // const { params } = props;

  return {
    title: "Dashboard",
    description: "",
  };
}

export function SidebarVerticalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      sidebarNavItems={MENU}
    >
      <SidebarLayoutProvider>
        <Wrapper>{children}</Wrapper>
      </SidebarLayoutProvider>
    </LayoutProvider>
  );
}
