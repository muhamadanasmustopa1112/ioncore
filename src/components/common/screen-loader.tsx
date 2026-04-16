"use client";

import { toAbsoluteUrl } from "@/lib/helpers";

export function ScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 transition-opacity duration-700 ease-in-out">
      <img
        src={toAbsoluteUrl("/media/app/logo_ion_baru.png")}
        className="h-[30px] dark:hidden"
        alt="logo"
      />
      <img
        src={toAbsoluteUrl("/media/app/logo-ion-dark.png")}
        className="h-[30px] hidden dark:block"
        alt="logo dark"
      />
      <div className="text-muted-foreground text-sm font-medium">
        Loading...
      </div>
    </div>
  );
}
