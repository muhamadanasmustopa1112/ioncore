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

export function Navbar() {
  const pathname = usePathname();
  const { isActive } = useMenu(pathname);
  const { isMobile } = useLayout();

  const handleInputChange = () => {};

  return (
    <div
      className={cn(
        "flex items-stretch w-full h-[46px] px-5 gap-5 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto",
        isMobile ? "justify-end" : "justify-between",
      )}
    >
      {!isMobile && (
        <ScrollArea>
          <nav className="list-none flex items-stretch overflow-x-auto gap-7.5 h-[46px]">
            {[
              ...MENU_PAGES,
              ...MENU_SIDEBAR_MAIN,
              ...MENU_SIDEBAR_RESOURCES,
            ].map((menu, index) => {
              return (
                <Fragment key={index}>
                  {menu.children?.map((item, index) => {
                    const active = isActive(item.path);
                    if (item.children) {
                      return (
                        <Fragment key={index}>
                          <li className="flex items-stretch">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "h-full rounded-none gap-2 inline-flex items-center border-b border-transparent text-sm font-normal whitespace-nowrap text-sidebar-main-foreground hover:text-primary py-2.5 lg:py-0",
                                    "[&_svg]:text-sidebar-main-foreground",
                                    active &&
                                      "text-primary border-primary [&_svg]:text-primary",
                                  )}
                                >
                                  {item.icon && (
                                    <item.icon className="size-4" />
                                  )}
                                  <span>{item.title}</span>
                                  <ChevronDown className="size-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-80"
                                side="bottom"
                                align="start"
                              >
                                <div className="grid gap-4">
                                  {item.children.map((child, index) => {
                                    return (
                                      <Link
                                        href={child.path || "#"}
                                        className={cn(
                                          "gap-2 inline-flex items-center border-b border-transparent text-sm font-normal whitespace-nowrap text-secondary-foreground hover:text-primary py-2.5 lg:py-0",
                                          "[&_svg]:text-muted-foreground",
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
                                    );
                                  })}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </li>
                        </Fragment>
                      );
                    }
                    return (
                      <li key={index} className="flex items-stretch">
                        <Link
                          href={item.path || "#"}
                          className={cn(
                            "gap-2 inline-flex items-center border-b border-transparent text-sm font-normal whitespace-nowrap text-sidebar-main-foreground hover:text-primary py-2.5 lg:py-0",
                            "[&_svg]:text-sidebar-main-foreground",
                            active &&
                              "text-primary border-primary [&_svg]:text-primary",
                          )}
                        >
                          {item.icon && (
                            <item.icon className="size-4 text-sidebar-main-foreground" />
                          )}
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
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
