import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Loader2,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { auth } from "@/config/constants";
import { paths } from "@/config/paths";
import { clearAllCookies, getCookie } from "@/lib/cookies";
import { toAbsoluteUrl } from "@/lib/helpers";
import { useAuthStore } from "@/store/auth-store";
import {
  useLogout,
  useMyProfile,
  useSetActiveBranch,
} from "@/features/user-service/api/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input, InputWrapper } from "@/components/ui/input";
import { useLayout } from "./context";
import { Badge } from "@/components/ui/badge";
import { ConfigSelector } from "@/components/shared/dialogs/config-selector";

export function HeaderToolbar() {
  const { isMobile } = useLayout();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const { user, rawUser, setProfile, logout: clearAuth } = useAuthStore();
  const { mutate: setActiveBranch } = useSetActiveBranch();

  const shouldFetchProfile = !user;
  const { data: meResponse } = useMyProfile(shouldFetchProfile);

  useEffect(() => {
    if (meResponse?.data && !rawUser) {
      setProfile(meResponse.data);
    }
  }, [meResponse, rawUser, setProfile]);

  const { mutate: logoutApi, isPending } = useLogout();

  const handleLogout = () => {
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

  const handleInputChange = () => { };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const displayName = user?.fullName || "—";
  const displayRole = useMemo(() => {
    if (!user) return "";
    return (user.primaryRole || "USER").toUpperCase();
  }, [user]);
  const displayBranch = user?.primaryBranch || "";
  const initials = user?.avatarInitials || "U";

  return (
    <nav className="flex items-center justify-between gap-4 lg:w-full px-4 h-full">
      {/* Left Section: Search Bar */}
      <div className="flex-grow max-w-xl">
        {!isMobile && (
          <InputWrapper className="bg-muted/30 border-none shadow-none rounded-lg h-10 px-4">
            <Search className="size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Global search for customers, tickets, nodes..."
              className="placeholder:text-muted-foreground/60"
              onChange={handleInputChange}
            />
          </InputWrapper>
        )}
      </div>

      {/* Right Section: Actions & User */}
      <div className="flex items-center gap-3">
        {/* Branch Selector */}
        {!isMobile && displayBranch && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 bg-muted/40 hover:bg-muted/60 transition-colors h-10 px-4 rounded-lg hidden md:flex font-medium text-muted-foreground">
                {displayBranch}
                <ChevronDown className="size-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {rawUser?.branches?.length ? (
                rawUser.branches.map((b) => (
                  <DropdownMenuItem
                    key={b.id}
                    className={b.id === rawUser.active_branch_id ? "font-semibold" : ""}
                    onClick={() => setActiveBranch({ branch_id: b.id })}
                  >
                    {b.name || b.code || b.id}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="font-semibold">{displayBranch}</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Notif / Messages */}
        <div className="flex items-center gap-1">
          <Button mode="icon" variant="ghost" className="relative size-10 rounded-lg text-muted-foreground hover:text-primary">
            <Bell className="size-5" />
            <Badge className="absolute top-1.5 right-1.5 size-4 p-0 flex items-center justify-center bg-destructive text-white border-white border-2 text-[10px] font-bold">
              4
            </Badge>
          </Button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <ConfigSelector buttonMode="icon" buttonVariant="ghost" buttonClassName="size-10 rounded-lg" />
        </div>

        {/* Separator */}
        {!isMobile && <div className="h-6 w-px bg-border/60 mx-1" />}

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-12 p-1 px-2 rounded-xl hover:bg-muted/40 transition-all group">
              <div className="hidden sm:flex flex-col items-end text-right leading-none gap-1.5">
                <span className="text-[13px] font-semibold text-foreground transition-colors group-hover:text-primary">
                  {displayName}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                  {displayRole}
                </span>
              </div>
              <Avatar className="size-9 rounded-lg border-2 border-primary/10 group-hover:border-primary/30 transition-all overflow-hidden bg-muted">
                <AvatarImage
                  src={toAbsoluteUrl("/media/avatars/300-2.png")}
                  alt={displayName}
                />
                <AvatarFallback>{initials}</AvatarFallback>
                <AvatarIndicator className="-end-0.5 -top-0.5">
                  <AvatarStatus variant="online" className="size-2.5 border-2 border-background" />
                </AvatarIndicator>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64"
            side="bottom"
            align="end"
            sideOffset={11}
          >
            {/* User Information Section */}
            <div className="flex items-center gap-3 px-3 py-3 bg-muted/20">
              <Avatar className="size-10 rounded-lg">
                <AvatarImage
                  src={toAbsoluteUrl("/media/avatars/300-2.png")}
                  alt={displayName}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-foreground w-full truncate overflow-hidden text-sm font-bold text-ellipsis">
                  {displayName}
                </span>
                <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-tight">
                  {displayRole}
                </span>
                {rawUser?.email && (
                  <span className="text-muted-foreground/70 text-[11px] truncate w-full">
                    {rawUser.email}
                  </span>
                )}
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="py-2.5">
              <Link href="/profile" className="flex items-center gap-2 w-full">
                <User className="size-4 opacity-70" />
                <span className="font-medium">My Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="py-2.5">
              <Settings className="size-4 opacity-70" />
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={toggleTheme} className="py-2.5">
              {theme === "light" ? (
                <Moon className="size-4 opacity-70" />
              ) : (
                <Sun className="size-4 opacity-70" />
              )}
              <span className="font-medium">{theme === "light" ? "Dark mode" : "Light mode"}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10">
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              <span className="font-bold">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
