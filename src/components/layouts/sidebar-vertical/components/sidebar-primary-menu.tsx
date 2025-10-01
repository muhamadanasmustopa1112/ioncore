import { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/config/types";
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

type Props = {
  menu: MenuItem;
};

export function SidebarPrimaryMenu({ menu }: Props) {
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
        item: "h-8.5 px-2.5 text-sm font-normal text-sidebar-secondary-foreground hover:text-primary data-[selected=true]:bg-muted data-[selected=true]:text-foreground [&[data-selected=true]_svg]:opacity-100",
        group: "",
      }}
    >
      <AccordionMenuGroup>
        <AccordionMenuLabel>{menu?.title}</AccordionMenuLabel>
        {menu.children?.map((child, index) => {
          if (child.children) {
            return (
              <AccordionMenuSub key={index} value={child.path || "#"}>
                <AccordionMenuSubTrigger
                  className="text-sidebar-secondary-foreground"
                  value={child.path || "#"}
                >
                  {child.icon && <child.icon />}
                  <span>{child.title}</span>
                </AccordionMenuSubTrigger>
                <AccordionMenuSubContent
                  type="multiple"
                  parentValue={child.path || "#"}
                >
                  {child.children.map((child, index) => {
                    return (
                      <AccordionMenuItem key={index} value={child.path || "#"}>
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
            <AccordionMenuItem
              key={index}
              value={child.path || "#"}
              className="text-sidebar-secondary-foreground"
            >
              <Link href={child.path || "#"}>
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
    </AccordionMenu>
  );
}
