import { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarSide } from "@/config/constants";
import { MENU_PAGES, MENU_SIDEBAR_MAIN } from "@/config/layout-14.config";
import { paths } from "@/config/paths";
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
} from "@/components/ui/accordion-menu";
import { Badge } from "@/components/ui/badge";

export function SidebarPrimaryMenu() {
  const pathname = usePathname();

  // Memoize matchPath to prevent unnecessary re-renders
  const matchPath = useCallback(
    (path: string): boolean =>
      path === pathname ||
      (path.length > 1 && pathname.startsWith(path) && path !== "/layout-14"),
    [pathname],
  );

  return (
    <AccordionMenu
      selectedValue={pathname}
      matchPath={matchPath}
      type="multiple"
      className="space-y-7.5 px-2.5"
      classNames={{
        label: "text-xs font-normal text-muted-foreground mb-2",
        item: "h-8.5 px-2.5 text-sm font-normal text-foreground hover:text-primary data-[selected=true]:bg-muted data-[selected=true]:text-foreground [&[data-selected=true]_svg]:opacity-100",
        group: "",
      }}
    >
      {MENU_PAGES.map((item, index) => {
        return (
          <AccordionMenuGroup key={index}>
            <AccordionMenuLabel>{item.title}</AccordionMenuLabel>
            {item.children?.map((child, index) => {
              let onClick = undefined;
              if (child.title === "Switch to Horizontal Sidebar") {
                onClick = () => {
                  localStorage.setItem("sidebar", sidebarSide.horizontal);
                  window.location.reload();
                };
              }
              if (child.children) {
                return (
                  <AccordionMenuSub key={index} value={child.path || "#"}>
                    <AccordionMenuSubTrigger value={child.path || "#"}>
                      {child.icon && <child.icon />}
                      <span>{child.title}</span>
                    </AccordionMenuSubTrigger>
                    <AccordionMenuSubContent
                      type="multiple"
                      parentValue={child.path || "#"}
                    >
                      {child.children.map((child, index) => {
                        return (
                          <AccordionMenuItem
                            key={index}
                            value={child.path || "#"}
                          >
                            <Link href={child.path || "#"}>
                              <span>{child.title}</span>
                            </Link>
                          </AccordionMenuItem>
                        );
                      })}
                    </AccordionMenuSubContent>
                  </AccordionMenuSub>
                );
              }
              return (
                <AccordionMenuItem key={index} value={child.path || "#"}>
                  <Link href={child.path || "#"} onClick={onClick}>
                    {child.icon && <child.icon />}
                    <span>{child.title}</span>
                    {child.badge == "Beta" && (
                      <Badge size="sm" variant="destructive" appearance="light">
                        {child.badge}
                      </Badge>
                    )}
                  </Link>
                </AccordionMenuItem>
              );
            })}
          </AccordionMenuGroup>
        );
      })}
    </AccordionMenu>
  );
}
