import { SidebarPrimary } from "./sidebar-primary";
import { SidebarSecondary } from "./sidebar-secondary";

export function Sidebar() {
  return (
    <aside className="bg-sidebar-secondary fixed start-0 top-[calc(var(--header-height)-1px)] z-20 flex w-(--sidebar-width) flex-shrink-0 items-stretch overflow-hidden transition-all duration-300 in-data-[sidebar-open=false]:w-(--sidebar-collapsed-width)">
      <SidebarPrimary />
      <SidebarSecondary />
    </aside>
  );
}
