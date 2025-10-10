import { useLayout } from "./context";
import { HeaderLogo } from "./header-logo";
import { HeaderMenu } from "./header-menu";
import { HeaderToolbar } from "./header-toolbar";
import { Navbar } from "./navbar";

export function Header() {
  const { isMobile } = useLayout();

  return (
    <header className="bg-muted fixed start-0 end-0 top-0 z-10 h-(--header-height-mobile) shrink-0 pe-[var(--removed-body-scroll-bar-size,0px)] lg:h-(--header-height) lg:bg-transparent">
      <div className="bg-background">
        <div className="border-border/20 bg-sidebar-main text-sidebar-main-foreground border-b">
          <div className="flex h-[62px] justify-between gap-2.5 px-5 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto">
            <div className="flex items-stretch gap-5">
              <HeaderLogo />
              {!isMobile && <HeaderMenu />}
            </div>
            <HeaderToolbar />
          </div>
        </div>
        <div className="bg-sidebar-secondary text-sidebar-secondary-foreground">
          <Navbar />
        </div>
      </div>
    </header>
  );
}
