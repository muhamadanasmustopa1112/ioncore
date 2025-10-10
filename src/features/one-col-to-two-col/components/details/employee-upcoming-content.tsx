"use client";

import Link from "next/link";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeTimelineItem } from "./employee-timeline-item";

const EmployeeActivitiesUpcomingContent = () => {
  return (
    <EmployeeTimelineItem icon={Share2} className="text-violet-500" line={true}>
      <div className="flex flex-col">
        <div className="text-sm text-foreground">
          I couldn't resist sharing a sneak peek of our{" "}
          <Button mode="link" asChild>
            <Link href="/public-profile/profiles/blogger">
              upcoming content
            </Link>
          </Button>
        </div>
        <span className="text-xs text-secondary-foreground">
          5 days ago, 4:07 PM
        </span>
      </div>
    </EmployeeTimelineItem>
  );
};

export { EmployeeActivitiesUpcomingContent };
