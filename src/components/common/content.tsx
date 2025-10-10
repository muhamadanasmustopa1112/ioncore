"use client";

import { LoaderCircleIcon } from "lucide-react";

export function ContentLoader() {
  return (
    <div className="relative top-1/2 flex -translate-x-1/2 flex-col items-center justify-center self-center">
      <div className="flex items-center gap-2.5">
        <LoaderCircleIcon className="text-muted-foreground animate-spin opacity-50" />
        <span className="text-muted-foreground text-sm font-medium">
          Loading...
        </span>
      </div>
    </div>
  );
}
