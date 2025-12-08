"use client";

import { ReactNode, useEffect, useState } from "react";
import { useStore } from "@/store/store";
import { sidebarSide } from "@/config/constants";
// import { env } from "@/config/env";
import { SidebarHorizontalLayout } from "@/components/layouts/sidebar-horizontal";
import { SidebarVerticalLayout } from "@/components/layouts/sidebar-vertical";
import { ScreenLoader } from "@/components/screen-loader";
import { ConfigSelector } from "@/components/shared/dialogs/config-selector";

export default function Layout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { layout, setLayout } = useStore();

  const sidebar =
    typeof window !== "undefined"
      ? localStorage.getItem("sidebar") || sidebarSide.vertical
      : sidebarSide.vertical;

  useEffect(() => {
    // Simulate short loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLayout(sidebar as "horizontal" | "vertical");
  }, [sidebar]);

  if (isLoading) {
    return <ScreenLoader />;
  }

  if (layout === sidebarSide.vertical) {
    return (
      <SidebarVerticalLayout>
        {children}
        {/* <ConfigSelector /> */}
      </SidebarVerticalLayout>
    );
  }

  return (
    <SidebarHorizontalLayout>
      {children}
      <ConfigSelector />
    </SidebarHorizontalLayout>
  );
}
