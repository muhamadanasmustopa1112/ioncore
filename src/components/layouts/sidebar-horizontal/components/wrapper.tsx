import { useLayout } from "./context";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function Wrapper({ children }: { children: React.ReactNode }) {
  const { isMobile } = useLayout();

  return (
    <>
      <Header />

      <div className="flex flex-col lg:flex-row grow pt-(--header-height)">
        <div className="flex grow bg-background border border-input mt-0">
          {!isMobile && <Sidebar />}
          <div className="grow lg:overflow-y-auto p-5">
            <main className="lg:grow" role="content">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
