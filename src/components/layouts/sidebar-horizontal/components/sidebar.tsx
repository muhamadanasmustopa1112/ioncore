import { SidebarMenu } from "./sidebar-menu";
import { SidebarSearch } from "./sidebar-search";

export function Sidebar() {
  return (
    <div className="border-border flex w-(--sidebar-width) shrink-0 flex-col items-stretch border-e">
      <SidebarSearch />
      <SidebarMenu />
    </div>
  );
}
