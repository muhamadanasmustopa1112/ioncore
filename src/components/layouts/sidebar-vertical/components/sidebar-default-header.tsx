import Link from 'next/link';
import { PanelRightOpen } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { useLayout } from '../../context/layout-context';

export function SidebarDefaultHeader() {
  const { sidebarCollapse, setSidebarCollapse } = useLayout();

  return (
    <div className="group flex justify-between items-center gap-2.5 border-border h-11 lg:h-(--sidebar-header-height) shrink-0 px-2.5">
      <div className="flex items-center gap-2 overflow-hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src={toAbsoluteUrl('/media/app/logo_ion_baru.png')}
            className="h-9 in-data-[sidebar-collapsed]:hidden"
            alt="Logo Text"
          />
        </Link>
      </div>

      <Button
        variant="ghost"
        mode="icon"
        className="hidden text-sidebar-main-foreground hover:text-primary lg:group-hover:flex lg:in-data-[sidebar-collapsed]:hidden!"
        onClick={() => setSidebarCollapse(!sidebarCollapse)}
      >
        <PanelRightOpen className="size-4" />
      </Button>
    </div>
  );
}
