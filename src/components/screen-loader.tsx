"use client";

import { toAbsoluteUrl } from "@/lib/helpers";

export function ScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 transition-opacity duration-700 ease-in-out bg-background">
      <img
        className="h-[30px] max-w-none dark:hidden"
        src={toAbsoluteUrl("/media/app/logo_ion_baru.png")}
        alt="logo"
      />
      <img
        className="h-[30px] max-w-none hidden dark:block"
        src={toAbsoluteUrl("/media/app/logo-ion-dark.png")}
        alt="logo"
      />
      <div className="text-muted-foreground text-sm font-medium">
        Loading...
      </div>
    </div>
  );
}
