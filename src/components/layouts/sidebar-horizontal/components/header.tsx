import { useLayout } from "./context";
import { HeaderLogo } from "./header-logo";
import { HeaderMenu } from "./header-menu";
import { HeaderToolbar } from "./header-toolbar";
import { Navbar } from "./navbar";

export function Header() {
  const { isMobile } = useLayout();

  return (
    <header className="fixed z-10 top-0 start-0 end-0 shrink-0 bg-muted lg:bg-transparent h-(--header-height-mobile) lg:h-(--header-height) pe-[var(--removed-body-scroll-bar-size,0px)]">
      <div className="bg-background">
        <div className="border-b border-border/20 bg-sidebar-main text-sidebar-main-foreground">
          <div className="flex justify-between gap-2.5 h-[62px] px-5 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto">
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
