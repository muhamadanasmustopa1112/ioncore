import { ReactNode } from "react";
import Link from "next/link";
import {
  BetweenHorizontalStart,
  Coffee,
  CreditCard,
  FileText,
  Globe,
  IdCard,
  Moon,
  Settings,
  Shield,
  SquareCode,
  UserCircle,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

const I18N_LANGUAGES = [
  {
    label: "Bahasa Indonesia",
    code: "id",
    direction: "ltr",
    flag: toAbsoluteUrl("/media/flags/indonesia.svg"),
  },
  {
    label: "English",
    code: "en",
    direction: "ltr",
    flag: toAbsoluteUrl("/media/flags/united-states.svg"),
  },
];

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { t, i18n: i18nInstance } = useTranslation();
  const currentLanguage = I18N_LANGUAGES.find((lang) => lang.code === i18nInstance.language) || I18N_LANGUAGES[0];
  const { theme, setTheme } = useTheme();

  const handleLanguageChange = (code: string) => {
    i18nInstance.changeLanguage(code);
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <img
              className="size-9 rounded-full border-2 border-green-500"
              src={toAbsoluteUrl("/media/avatars/300-2.png")}
              alt="User avatar"
            />
            <div className="flex flex-col">
              <Link
                href="#"
                className="text-mono hover:text-primary text-sm font-semibold"
              >
                Sean
              </Link>
              <a
                href={`mailto:sean@kt.com`}
                className="text-muted-foreground hover:text-primary text-xs"
              >
                sean@kt.com
              </a>
            </div>
          </div>
          <Badge variant="primary" appearance="light" size="sm">
            Pro
          </Badge>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center gap-2">
            <IdCard />
            Public Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center gap-2">
            <UserCircle />
            My Profile
          </Link>
        </DropdownMenuItem>

        {/* My Account Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Settings />
            My Account
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuItem asChild>
              <Link href="#" className="flex items-center gap-2">
                <Coffee />
                Get Started
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="#" className="flex items-center gap-2">
                <FileText />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="#" className="flex items-center gap-2">
                <CreditCard />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="#" className="flex items-center gap-2">
                <Shield />
                Security
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="#" className="flex items-center gap-2">
                <Users />
                Members & Roles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="#" className="flex items-center gap-2">
                <BetweenHorizontalStart />
                Integrations
              </Link>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem asChild>
          <Link
            href="https://devs.keenthemes.com"
            className="flex items-center gap-2"
          >
            <SquareCode />
            Dev Forum
          </Link>
        </DropdownMenuItem>

        {/* Language Submenu with Radio Group */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:[&_[data-slot=badge]]:border-input data-[state=open]:[&_[data-slot=badge]]:border-input flex items-center gap-2 [&_[data-slot=dropdown-menu-sub-trigger-indicator]]:hidden">
            <Globe />
            <span className="relative flex grow items-center justify-between gap-2">
              Language
              <Badge
                variant="outline"
                className="absolute end-0 top-1/2 -translate-y-1/2"
              >
                {currentLanguage.label}
                <img
                  src={currentLanguage.flag}
                  className="h-3.5 w-3.5 rounded-full"
                  alt={currentLanguage.label}
                />
              </Badge>
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuRadioGroup value={currentLanguage.code} onValueChange={handleLanguageChange}>
              {I18N_LANGUAGES.map((item) => (
                <DropdownMenuRadioItem
                  key={item.code}
                  value={item.code}
                  className="flex items-center gap-2"
                >
                  <img
                    src={item.flag}
                    className="h-4 w-4 rounded-full"
                    alt={item.label}
                  />
                  <span>{item.label}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Footer */}
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(event) => event.preventDefault()}
        >
          <Moon />
          <div className="flex grow items-center justify-between gap-2">
            Dark Mode
            <Switch
              size="sm"
              checked={theme === "dark"}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </DropdownMenuItem>
        <div className="mt-1 p-2">
          <Button variant="outline" size="sm" className="w-full">
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
