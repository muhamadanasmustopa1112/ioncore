"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeTimelineItem } from "./employee-timeline-item";

const EmployeeInterview = () => {
  return (
    <EmployeeTimelineItem icon={LogIn} className="text-foreground" line={true}>
      <div className="flex flex-col">
        <div className="text-sm text-foreground font-normal">
          I had the privilege of interviewing an industry expert for an{" "}
          <Button mode="link" asChild>
            <Link href="#">upcoming blog post</Link>
          </Button>
        </div>
        <span className="text-xs text-muted-foreground/80 font-normal">
          2 days ago, 4:07 PM
        </span>
      </div>
    </EmployeeTimelineItem>
  );
};

export { EmployeeInterview };
