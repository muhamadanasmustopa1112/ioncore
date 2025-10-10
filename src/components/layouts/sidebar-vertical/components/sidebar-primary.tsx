import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUsers } from "@/features/auth/api";
import { useStore } from "@/store/store";
import {
  BarChart3,
  Bell,
  Building2,
  CheckSquare,
  Clock,
  Download,
  ExternalLink,
  FolderCode,
  Loader2,
  LogOut,
  Mails,
  NotepadText,
  ScrollText,
  Settings,
  Shield,
  ShieldUser,
  Target,
  User,
  UserCircle,
  Users,
  Zap,
} from "lucide-react";
import { MENU } from "@/config/layout-14.config";
import { paths } from "@/config/paths";
import { useLogout } from "@/lib/auth";
import { clearAllCookies } from "@/lib/cookies";
import { toAbsoluteUrl } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SidebarPrimary() {
  const pathname = usePathname();
  const router = useRouter();
  const { menu, setMenu } = useStore();

  const { data: userData } = useUsers();

  const { mutate: logout, isPending } = useLogout({
    onSuccess: () => {
      handleLogout();
    },
    onError: () => {
      handleLogout();
    },
  });

  const handleLogout = () => {
    clearAllCookies();
    router.push(paths.auth.signin.getHref());
  };

  useEffect(() => {
    MENU.forEach((item) => {
      if (
        item.path === pathname ||
        (item.path && pathname.includes(item.path))
      ) {
        setMenu(item);
      }
    });
  }, [pathname]);

  const user = useMemo(() => userData?.response?.data, [userData]);

  return (
    <div className="border-input/20 bg-sidebar-main flex shrink-0 flex-col items-center justify-center gap-5 border-e px-2.5 py-2.5 lg:w-(--sidebar-collapsed-width)">
      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-13rem)] w-full grow lg:h-[calc(100vh-5.5rem)]">
        <div className="flex shrink-0 grow flex-col items-center gap-1">
          {MENU.map((item, index) => {
            if (!item.icon) return null;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    mode="icon"
                    {...(item.path === menu.path
                      ? { "data-state": "open" }
                      : {})}
                    className={cn(
                      "size-9 shrink-0 rounded-md",
                      "data-[state=open]:bg-primary data-[state=open]:text-primary-foreground",
                      "hover:text-sidebar-main-foreground/60 hover:bg-white/20",
                    )}
                  >
                    <Link href={item.path || "#"}>
                      <item.icon className="text-sidebar-main-foreground size-4.5!" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex shrink-0 flex-col items-center gap-2.5">
        <Button
          variant="ghost"
          mode="icon"
          className="text-sidebar-main-foreground hover:text-foreground"
        >
          <Mails className="opacity-100" />
        </Button>

        <Button
          variant="ghost"
          mode="icon"
          className="text-sidebar-main-foreground hover:text-foreground"
        >
          <NotepadText className="opacity-100" />
        </Button>

        <Button
          variant="ghost"
          mode="icon"
          className="text-sidebar-main-foreground hover:text-foreground"
        >
          <Settings className="opacity-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="mb-2.5 cursor-pointer">
            <Avatar className="size-7">
              <AvatarImage
                src={toAbsoluteUrl("/media/avatars/300-2.png")}
                alt="@reui"
              />
              <AvatarFallback>CH</AvatarFallback>
              <AvatarIndicator className="-end-2 -top-2">
                <AvatarStatus variant="online" className="size-2.5" />
              </AvatarIndicator>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mb-4 w-64"
            side="right"
            align="start"
            sideOffset={11}
          >
            {/* User Information Section */}
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar>
                <AvatarImage
                  src={toAbsoluteUrl("/media/avatars/300-2.png")}
                  alt="@reui"
                />
                <AvatarFallback>CH</AvatarFallback>
                <AvatarIndicator className="-end-1.5 -top-1.5">
                  <AvatarStatus variant="online" className="size-2.5" />
                </AvatarIndicator>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-foreground text-sm font-semibold">
                  {user?.username}
                </span>
                <span className="text-muted-foreground text-xs">
                  Senior Developer
                </span>
                <Badge
                  variant="success"
                  appearance="outline"
                  size="sm"
                  className="mt-1"
                >
                  Pro Plan
                </Badge>
              </div>
            </div>

            <DropdownMenuItem className="border-border hover:bg-muted cursor-pointer rounded-md border py-1">
              <Clock />
              <span>Set availability</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Core Actions */}
            <DropdownMenuItem>
              <Target />
              <span>My Projects</span>
              <Badge
                variant="info"
                size="sm"
                appearance="outline"
                className="ms-auto"
              >
                3
              </Badge>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Users />
              <span>Team Management</span>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Building2 />
              <span>Organization</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Settings */}
            <DropdownMenuItem>
              <User />
              <span>Profile Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings />
              <span>Preferences</span>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Shield />
              <span>Security</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Developer Tools */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Zap />
                <span>Developer Tools</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                <DropdownMenuItem>API Documentation</DropdownMenuItem>
                <DropdownMenuItem>Code Repository</DropdownMenuItem>
                <DropdownMenuItem>Testing Suite</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem>
              <Download />
              <span>Download SDK</span>
              <ExternalLink className="ms-auto size-3" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Action Items */}
            <DropdownMenuItem onClick={logout}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut />
              )}
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
