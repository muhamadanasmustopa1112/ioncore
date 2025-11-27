import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Coffee,
  MessageSquareCode,
  Pin,
  Search,
} from "lucide-react";
import {
  MENU_PAGES,
  MENU_SIDEBAR_MAIN,
  MENU_SIDEBAR_RESOURCES,
} from "@/config/layout-14.config";
import { cn } from "@/lib/utils";
import { useMenu } from "@/hooks/use-menu";
import { Button } from "@/components/ui/button";
import { Input, InputWrapper } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useLayout } from "./context";
import { MENU } from "@/config/menu";
import { Menu, MenuContent, MenuGroup, MenuItem, MenuSubmenuRoot, MenuSubmenuTrigger, MenuTrigger } from "@/components/ui/base-menu";

export function Navbar() {
  const pathname = usePathname();
  const { isActive } = useMenu(pathname);
  const { isMobile } = useLayout();

  const handleInputChange = () => {};

  return (
    <div
      className={cn(
        "flex h-[46px] w-full items-stretch gap-5 px-5 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto",
        isMobile ? "justify-end" : "justify-between",
      )}
    >
      {!isMobile && (
        <ScrollArea>
          <nav className="flex h-[46px] list-none items-stretch overflow-x-auto">
            {MENU.map((menu, index) => {
              const active = isActive(menu.path);
              return (
                <Fragment key={index}>
                  {
                    menu.children ? (
                      <Menu>
                        <MenuTrigger>
                          <Button
                            variant="ghost"
                            className={cn(
                              "text-sidebar-main-foreground hover:text-primary inline-flex h-full items-center gap-2 rounded-none border-b border-transparent py-2.5 text-sm font-normal whitespace-nowrap lg:py-0",
                              "[&_svg]:text-sidebar-main-foreground hover:[&_svg]:text-primary",
                              active &&
                                "bg-accent text-primary border-primary [&_svg]:text-primary",
                            )}
                          >
                            {menu.icon && (
                              <menu.icon className="size-4" />
                            )}
                            <span>{menu.title}</span>
                            <ChevronDown className="size-4" />
                          </Button>
                        </MenuTrigger>
                        <MenuContent className="bg-sidebar-secondary">
                          {
                            menu.children.map((child, index) => (
                              <MenuGroup key={child.title}>
                                {
                                  child.children ? (
                                    <MenuSubmenuRoot>
                                      <MenuSubmenuTrigger className="text-sidebar-main-foreground hover:text-primary hover:bg-accent [&_svg]:text-sidebar-main-foreground hover:[&_svg]:text-primary">
                                        {child.icon && (
                                          <child.icon className="size-4" />
                                        )}
                                        <span>{child.title}</span>
                                      </MenuSubmenuTrigger>
                                      <MenuContent sideOffset={10} alignOffset={-8} className="bg-sidebar-secondary">
                                        {
                                          child.children.map((grandchild, index) => (
                                            <MenuItem key={grandchild.title} className="text-sidebar-main-foreground hover:text-primary hover:bg-accent [&_svg]:text-sidebar-main-foreground hover:[&_svg]:text-primary">
                                              <Link href={grandchild.path || "#"}>
                                                <span>{grandchild.title}</span>
                                              </Link>
                                            </MenuItem>
                                          ))
                                        }
                                      </MenuContent>
                                    </MenuSubmenuRoot>
                                  ) : (
                                    <MenuItem className="text-sidebar-main-foreground hover:text-primary hover:bg-accent [&_svg]:text-sidebar-main-foreground hover:[&_svg]:text-primary p-0">
                                      <Link
                                        href={child.path || "#"}
                                        className={cn(
                                          "px-2 py-1.5 inline-flex w-full h-full items-center gap-2 border-b border-transparent py-2.5 text-sm font-normal whitespace-nowrap",
                                          active &&
                                            "text-primary border-primary [&_svg]:text-primary",
                                        )}
                                        key={index}
                                      >
                                        {child.icon && (
                                          <child.icon className="size-4" />
                                        )}
                                        <span>{child.title}</span>
                                      </Link>
                                    </MenuItem>
                                  )
                                }
                                
                              </MenuGroup>
                            ))
                          }
                        </MenuContent>
                      </Menu>
                    ) : (
                      <Link
                        href={menu.path || "#"}
                        className={cn(
                          "px-3 text-sidebar-main-foreground hover:text-primary hover:bg-accent inline-flex items-center gap-2 border-b border-transparent py-2.5 text-sm font-normal whitespace-nowrap lg:py-0",
                          "[&_svg]:text-sidebar-main-foreground hover:[&_svg]:text-primary",
                          active &&
                            "text-primary border-primary [&_svg]:text-primary",
                        )}
                        key={index}
                      >
                        {menu.icon && (
                          <menu.icon className="size-4" />
                        )}
                        <span>{menu.title}</span>
                      </Link>
                    )
                  }
                </Fragment>
              );
            })}
          </nav>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      <div className="flex items-center gap-2.5">
        <Button mode="icon" variant="outline" size="sm">
          <Coffee />
        </Button>
        <Button mode="icon" variant="outline" size="sm">
          <MessageSquareCode />
        </Button>
        <Button mode="icon" variant="outline" size="sm">
          <Pin />
        </Button>

        <InputWrapper className="w-full lg:w-40" variant="sm">
          <Search />
          <Input
            type="search"
            placeholder="Search Account"
            onChange={handleInputChange}
          />
        </InputWrapper>
      </div>
    </div>
  );
}
