"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmployeeTimelineItemProps {
  icon: LucideIcon;
  line: boolean;
  children: ReactNode;
  removeSpace?: boolean;
  className?: string;
}

export function EmployeeTimelineItem({
  line,
  icon: Icon,
  children,
  removeSpace,
  className,
}: EmployeeTimelineItemProps) {
  return (
    <div className="relative flex items-start">
      {line && (
        <div className="border-s-input absolute start-0 top-10.5 bottom-0 h-[calc(100%-28px)] w-10 translate-x-1/2 border-s-2 rtl:-translate-x-1/2"></div>
      )}
      <div className="bg-background border-border flex size-10 shrink-0 items-center justify-center rounded-md border">
        <div className="bg-accent/70 flex size-[34px] items-center justify-center rounded-md">
          <Icon size={18} className={className || ""} />
        </div>
      </div>
      <div
        className={`ps-2.5 ${!removeSpace ? "mb-5 pt-0.5" : ""} grow text-base`}
      >
        {children}
      </div>
    </div>
  );
}
