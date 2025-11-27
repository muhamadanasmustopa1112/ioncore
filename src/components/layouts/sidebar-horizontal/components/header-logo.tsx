import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLayout } from "./context";
import { HeaderMenuMobile } from "./header-menu-mobile";
import { HeaderSecondaryMenuMobile } from "./header-secondary-menu-mobile";
import { SidebarMenu } from "./sidebar-menu";

export function HeaderLogo() {
  const pathname = usePathname();
  const { isMobile } = useLayout();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Close sheet when route changes
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  return (
    <div className="flex items-center gap-2.5">
      <Link href="/layout-18" className="flex items-center gap-2">
        <div className="flex items-center rounded-[6px] border border-[rgba(255,255,255,0.30)] bg-[#007421] bg-[radial-gradient(97.49%_97.49%_at_50%_2.51%,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_100%)] p-[5px] shadow-[0_0_0_1px_#009229]">
          <img
            src={toAbsoluteUrl("/media/app/logo-33.svg")}
            alt="image"
            className="min-w-[18px]"
          />
        </div>
        <span className="text-mono hidden text-xl font-medium lg:block">
          App Name
        </span>
      </Link>
      {isMobile && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" mode="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[225px] gap-0 p-0"
            side="left"
            close={false}
          >
            <SheetHeader className="space-y-0 p-0" />
            <SheetBody className="flex grow flex-col p-0">
              <HeaderMenuMobile />
              <HeaderSecondaryMenuMobile />
              <SidebarMenu />
            </SheetBody>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
