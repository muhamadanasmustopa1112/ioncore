import { useLayout } from "./context";
import { HeaderBreadcrumbs } from "./header-breadcrumbs";
import { HeaderLogo } from "./header-logo";
import { HeaderToolbar } from "./header-toolbar";

export function Header() {
  const { isMobile } = useLayout();

  return (
    <header className="bg-background/95 border-border/20 supports-backdrop-filter:bg-background/60 fixed start-0 end-0 top-0 z-10 flex h-(--header-height-mobile) shrink-0 items-stretch border-b pe-[var(--removed-body-scroll-bar-size,0px)] backdrop-blur-sm lg:h-(--header-height)">
      <div className="@container flex grow items-stretch justify-between gap-2.5 pe-5">
        <div className="flex items-stretch gap-x-6">
          <HeaderLogo />
          {!isMobile && <HeaderBreadcrumbs />}
        </div>
        <HeaderToolbar />
      </div>
    </header>
  );
}
