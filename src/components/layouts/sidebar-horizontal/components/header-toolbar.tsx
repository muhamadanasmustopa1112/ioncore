"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellDot,
  Clock,
  Download,
  ExternalLink,
  Gift,
  HelpCircle,
  Keyboard,
  Loader2,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
  VolumeX,
} from "lucide-react";
import { useTheme } from "next-themes";
import { auth } from "@/config/constants";
import { paths } from "@/config/paths";
import { useAuthStore } from "@/store/auth-store";
import { useLogout, useMyProfile } from "@/features/user-service/api/auth";
import { clearAllCookies, getCookie } from "@/lib/cookies";
import { toAbsoluteUrl } from "@/lib/helpers";
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
import { ConfigSelector } from "@/components/shared/dialogs/config-selector";

export function HeaderToolbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const { user, rawUser, setProfile, logout: clearAuth } = useAuthStore();

  const { data: meResponse } = useMyProfile(!user);

  useEffect(() => {
    if (meResponse?.data && !rawUser) {
      setProfile(meResponse.data);
    }
  }, [meResponse, rawUser, setProfile]);

  const { mutate: logoutApi, isPending } = useLogout();

  const logout = () => {
    const refreshToken = getCookie(auth.refresh_token) || "";
    const finish = () => {
      clearAuth();
      clearAllCookies();
      router.push(paths.auth.signin.getHref());
    };
    logoutApi(
      { refresh_token: refreshToken },
      { onSuccess: finish, onError: finish },
    );
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="flex items-center gap-2.5">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-main-foreground hover:text-foreground"
        >
          <BellDot className="opacity-100" />
        </Button>
        <ConfigSelector
          buttonVariant="ghost"
          buttonSize="icon"
          buttonClassName="text-sidebar-main-foreground hover:text-foreground"
          buttonMode="icon"
        />
        {/* <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-main-foreground hover:text-foreground"
        >
          <Settings className="opacity-100" />
        </Button> */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
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
          className="w-64"
          side="bottom"
          align="end"
          sideOffset={11}
        >
          {/* User Information Section */}
          <div className="flex items-center gap-3 p-3">
            <Avatar>
              <AvatarImage
                src={toAbsoluteUrl("/media/avatars/300-2.png")}
                alt="@reui"
              />
              <AvatarFallback>S</AvatarFallback>
              <AvatarIndicator className="-end-1.5 -top-1.5">
                <AvatarStatus variant="online" className="size-2.5" />
              </AvatarIndicator>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-semibold">
                {user?.fullName || "—"}
              </span>
              <span className="text-muted-foreground text-xs">Online</span>
            </div>
          </div>

          <DropdownMenuItem className="border-border hover:bg-muted cursor-pointer rounded-md border py-1">
            <Clock />
            <span>Set status</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Notification and Settings Section */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <VolumeX />
              <span>Mute notifications</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuItem>For 30 minutes</DropdownMenuItem>
              <DropdownMenuItem>For 1 hour</DropdownMenuItem>
              <DropdownMenuItem>For 4 hours</DropdownMenuItem>
              <DropdownMenuItem>Until tomorrow</DropdownMenuItem>
              <DropdownMenuItem>Until next week</DropdownMenuItem>
              <DropdownMenuItem>Custom date and time</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem>
            <User />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Bell />
            <span>Notification settings</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Theme Toggle */}
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
            <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Business-Focused Application Section */}
          <DropdownMenuItem>
            <Keyboard />
            <span>Keyboard shortcuts</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Gift />
            <span>Referrals</span>
            <Badge variant="info" appearance="light" className="ms-auto">
              New
            </Badge>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Download />
            <span>Download apps</span>
            <ExternalLink className="ms-auto size-3" />
          </DropdownMenuItem>

          <DropdownMenuItem>
            <HelpCircle />
            <span>Help</span>
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
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
