"use client";

import Link from "next/link";
import { UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeTimelineItem } from "./employee-timeline-item";

const EmployeeNewArticle = () => {
  return (
    <EmployeeTimelineItem
      icon={UsersRound}
      className="text-primary"
      line={true}
    >
      <div className="flex flex-col">
        <div className="text-foreground text-sm font-normal">
          Posted a new article{" "}
          <Button mode="link" asChild>
            <Link href="/public-profile/profiles/blogger">
              Top 10 Tech Trends
            </Link>
          </Button>
        </div>
        <span className="text-muted-foreground/80 text-xs font-normal">
          Today, 9:00 AM
        </span>
      </div>
    </EmployeeTimelineItem>
  );
};

export { EmployeeNewArticle };
