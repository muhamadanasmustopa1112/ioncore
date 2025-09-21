import { Header } from "./header";

export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <div className="flex flex-col lg:flex-row grow pt-(--header-height)">
        <div className="flex grow bg-background border border-input mt-0">
          <div className="grow lg:overflow-y-auto p-5">
            <main
              className="lg:grow xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto"
              role="content"
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
