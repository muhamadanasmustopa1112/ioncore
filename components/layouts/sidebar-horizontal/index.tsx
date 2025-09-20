import { Metadata } from "next";
import { LayoutProvider } from "./components/context";
import { Wrapper } from "./components/wrapper";

// Generate metadata for the layout
export async function generateMetadata(): Promise<Metadata> {
  // You can access route params here if needed
  // const { params } = props;

  return {
    title: "Dashboard",
    description: "",
  };
}

export function SidebarHorizontalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider
      bodyClassName="bg-muted lg:overflow-hidden"
      style={
        {
          "--sidebar-width": "260px",
          "--sidebar-width-mobile": "260px",
          "--header-height": "108px",
          "--header-height-mobile": "108px",
        } as React.CSSProperties
      }
    >
      <Wrapper>{children}</Wrapper>
    </LayoutProvider>
  );
}
