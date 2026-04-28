import { SidebarDefaultFavorites } from './sidebar-default-favorites';
import { SidebarDefaultNav } from './sidebar-default-nav';

export function SidebarDefaultContent() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="py-3.5 space-y-3.5">
        <SidebarDefaultNav />
        {/* <SidebarDefaultFavorites /> */}
      </div>
    </div>
  );
}
