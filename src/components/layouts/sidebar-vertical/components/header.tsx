import { useLayout } from "./context";
import { HeaderBreadcrumbs } from "./header-breadcrumbs";
import { HeaderLogo } from "./header-logo";
import { HeaderToolbar } from "./header-toolbar";

export function Header() {
  const { isMobile } = useLayout();

  return (
    <header className="bg-white border-border supports-backdrop-filter:bg-white fixed start-0 end-0 top-0 z-10 flex h-(--header-height-mobile) shrink-0 items-stretch border-b pe-[var(--removed-body-scroll-bar-size,0px)] lg:h-(--header-height)">
      <div className="@container flex grow items-stretch justify-between gap-2.5 lg:gap-0 pe-5">
        <div className="flex items-stretch gap-x-6">
          <HeaderLogo />
          {!isMobile && <HeaderBreadcrumbs />}
        </div>
        <HeaderToolbar />
      </div>
    </header>
  );
}
