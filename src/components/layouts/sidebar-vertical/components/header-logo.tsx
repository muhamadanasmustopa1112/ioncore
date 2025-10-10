import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Check,
  ChevronsUpDown,
  Gem,
  Hexagon,
  Layers2,
  Menu,
  PanelRight,
  Zap,
} from "lucide-react";
import { toAbsoluteUrl } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLayout } from "./context";
import { SidebarPrimary } from "./sidebar-primary";
import { SidebarSecondary } from "./sidebar-secondary";

interface Team {
  icon: React.ElementType;
  name: string;
  color: string;
  members: number;
}

export function HeaderLogo() {
  const pathname = usePathname();
  const { isMobile, sidebarToggle } = useLayout();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const teams: Team[] = [
    {
      icon: Zap,
      name: "Thunder AI",
      color: "bg-teal-600 text-white",
      members: 8,
    },
    {
      icon: Gem,
      name: "Clarity AI",
      color: "bg-fuchsia-600 text-white",
      members: 6,
    },
    {
      icon: Hexagon,
      name: "Lightning AI",
      color: "bg-yellow-600 text-white",
      members: 12,
    },
    {
      icon: Layers2,
      name: "Bold AI",
      color: "bg-blue-600 text-white",
      members: 4,
    },
  ];

  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);

  // Close sheet when route changes
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  return (
    <div className="border-border/20 bg-sidebar-secondary flex items-center gap-2 border-e lg:w-(--sidebar-width)">
      {/* Brand */}
      <div className="flex w-full items-center">
        {/* Logo */}
        <div className="border-border/20 bg-sidebar-main flex h-(--header-height) w-(--sidebar-collapsed-width) shrink-0 items-center justify-center border-e">
          <Link href="/layout-14">
            <img
              src={toAbsoluteUrl("/media/app/mini-logo-gray.svg")}
              className="min-h-[30px] dark:hidden"
              alt="Thunder AI Logo"
            />
            <img
              src={toAbsoluteUrl("/media/app/mini-logo-gray-dark.svg")}
              className="hidden min-h-[30px] dark:block"
              alt="Thunder AI Logo"
            />
          </Link>
        </div>

        {/* Mobile sidebar toggle */}
        {isMobile && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" mode="icon" size="sm" className="ms-5.5">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[280px] gap-0 p-0 lg:w-(--sidebar-width)"
              side="left"
              close={false}
            >
              <SheetHeader className="space-y-0 p-0" />
              <SheetBody className="flex grow p-0">
                <SidebarPrimary />
                <SidebarSecondary />
              </SheetBody>
            </SheetContent>
          </Sheet>
        )}

        {/* Sidebar header */}
        <div className="flex w-full grow items-center justify-between gap-2.5 px-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sidebar-secondary-foreground hover:text-foreground -ms-1.5 inline-flex px-1.5"
              >
                <div
                  className={cn(
                    "flex size-6 items-center justify-center rounded-md",
                    selectedTeam.color,
                  )}
                >
                  <selectedTeam.icon className="size-4" />
                </div>

                <span className="text-mono hidden text-sm font-medium lg:block">
                  {selectedTeam.name}
                </span>
                <ChevronsUpDown className="opacity-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              side="bottom"
              align="end"
              sideOffset={10}
              alignOffset={-80}
            >
              {teams.map((team) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setSelectedTeam(team)}
                  data-active={selectedTeam.name === team.name}
                >
                  <div
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md",
                      team.color,
                    )}
                  >
                    <team.icon className="size-4" />
                  </div>
                  <span className="text-mono text-sm font-medium">
                    {team.name}
                  </span>
                  {selectedTeam.name === team.name && (
                    <Check className="text-primary ms-auto size-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sidebar toggle */}
          <Button
            mode="icon"
            variant="ghost"
            onClick={sidebarToggle}
            className="text-muted-foreground hover:text-foreground hidden lg:inline-flex"
          >
            <PanelRight className="-rotate-180 opacity-100 in-data-[sidebar-open=false]:rotate-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}
