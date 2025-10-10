import { Header } from "./header";

export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <div className="flex grow flex-col pt-(--header-height) lg:flex-row">
        <div className="bg-background border-input mt-0 flex grow border">
          <div className="grow p-5 lg:overflow-y-auto">
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
