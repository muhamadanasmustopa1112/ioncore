import { ContentHeader } from "@/components/common/content-header";
import { useLayout } from "./context";
import { HeaderToolbar } from "./header-toolbar";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { SidebarContent } from "./sidebar-content";

export function Header() {
  const { isMobile } = useLayout();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header>
      <ContentHeader>
        <div className="flex grow items-center h-full border-b border-border/50">
          {isMobile && (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" mode="icon" className="shrink-0 mx-1">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                className="p-0 gap-0 w-(--sidebar-width)"
                side="left"
                close={false}
              >
                <SheetHeader className="p-0 space-y-0">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>
                <SheetBody className="bg-sidebar-main text-sidebar-main-foreground flex flex-col grow p-0 [--sidebar-space-x:calc(var(--spacing)*2.5)]">
                  <SidebarContent />
                </SheetBody>
              </SheetContent>
            </Sheet>
          )}
          <div className="flex-1 min-w-0 h-full">
            <HeaderToolbar />
          </div>
        </div>
      </ContentHeader>
    </header>
  );
}
