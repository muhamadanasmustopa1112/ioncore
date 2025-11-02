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
    <ScrollArea className="bg-sidebar-secondary border-e mt-0 mb-2.5 h-[calc(100vh-1rem)] shrink-0 grow lg:h-[calc(100vh-4rem)]">
      {/* <SidebarSearch /> */}
      {menu.children?.map((item, index) => {
        return (
          <Fragment key={index}>
            <SidebarPrimaryMenu menu={item} />
            <Separator className="bg-border/20 my-2.5" />
          </Fragment>
        );
      })}
    </ScrollArea>
  );
}
