"use client";

import { ReactNode, useEffect, useState } from "react";
import { SidebarHorizontalLayout } from "@/components/layouts/sidebar-horizontal";
import { ScreenLoader } from "@/components/screen-loader";

export default function Layout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate short loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ScreenLoader />;
  }

  return <SidebarHorizontalLayout>{children}</SidebarHorizontalLayout>;
}
