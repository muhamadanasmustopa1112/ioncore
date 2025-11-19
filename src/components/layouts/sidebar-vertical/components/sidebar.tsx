import { cn } from "@/lib/utils";
import { SidebarPrimary } from "./sidebar-primary";
import { SidebarSecondary } from "./sidebar-secondary";
import { SidebarContent } from "@/components/layouts/sidebar-vertical/components/sidebar-content";

export function Sidebar() {
  return (
    // <aside className="bg-sidebar-secondary fixed start-0 top-[calc(var(--header-height)-1px)] z-20 flex w-(--sidebar-width) flex-shrink-0 items-stretch overflow-hidden transition-all duration-300 in-data-[sidebar-open=false]:w-(--sidebar-collapsed-width)">
    //   <SidebarPrimary />
    //   <SidebarSecondary />
    // </aside>
    <aside
      className={cn(
        'flex flex-col fixed z-[10] start-0 top-[var(--header-height)] bottom-0 w-(--sidebar-width) in-data-[sidebar-collapsed]:w-(--sidebar-width-collapsed) bg-background border-e border-border',
        '[--sidebar-space-x:calc(var(--spacing)*2.5)]',
        'transition-[width] duration-200 ease-in-out',
      )}
    >
      <SidebarContent />
    </aside>
  );
}
