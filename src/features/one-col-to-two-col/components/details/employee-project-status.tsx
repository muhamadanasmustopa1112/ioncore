"use client";

import { Rocket } from "lucide-react";
import { EmployeeTimelineItem } from "./employee-timeline-item";

const EmployeeActivitiesProjectStatus = () => {
  return (
    <EmployeeTimelineItem
      icon={Rocket}
      className="text-indigo-500"
      line={false}
    >
      <div className="flex flex-col">
        <div className="text-foreground text-sm font-normal">
          Completed phase one of client project ahead of schedule.
        </div>
        <span className="text-muted-foreground/80 text-xs font-normal">
          6 days ago, 10:45 AM
        </span>
      </div>
    </EmployeeTimelineItem>
  );
};

export { EmployeeActivitiesProjectStatus };
