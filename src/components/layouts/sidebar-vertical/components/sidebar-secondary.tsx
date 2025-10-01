"use client";

import { Fragment } from "react";
import { useStore } from "@/store/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarPrimaryMenu } from "./sidebar-primary-menu";
import { SidebarSearch } from "./sidebar-search";

export function SidebarSecondary() {
  const { menu } = useStore();
  return (
    <ScrollArea className="grow shrink-0 h-[calc(100vh-1rem)] lg:h-[calc(100vh-4rem)] mt-0 mb-2.5 bg-sidebar-secondary">
      <SidebarSearch />
      {menu.children?.map((item, index) => {
        return (
          <Fragment key={index}>
            <SidebarPrimaryMenu menu={item} />
            <Separator className="my-2.5 bg-border/20" />
          </Fragment>
        );
      })}
    </ScrollArea>
  );
}
