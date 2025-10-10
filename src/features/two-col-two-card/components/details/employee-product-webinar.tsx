"use client";

import Link from "next/link";
import { CalendarClock, SquareDashedBottomCode } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmployeeTimelineItem } from "./employee-timeline-item";

const EmployeeActivitiesProductWebinar = () => {
  return (
    <EmployeeTimelineItem
      icon={CalendarClock}
      className="text-yellow-500"
      line={true}
    >
      <div className="flex flex-col pb-2.5">
        <span className="text-foreground text-sm font-normal">
          Jenny attended a webinar on new product features.
        </span>
        <span className="text-muted-foreground/80 text-xs font-normal">
          3 days ago, 11:45 AM
        </span>
      </div>
      <Card className="p-4 shadow-none">
        <div className="flex flex-wrap gap-2.5">
          <SquareDashedBottomCode size={20} className="text-violet-500" />
          <div className="flex grow flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground hover:text-primary mb-1 cursor-pointer text-base leading-4 font-medium">
                  Leadership Development Series: Part 1
                </span>
                <span className="text-muted-foreground/80 text-xs font-normal">
                  The first installment of a leadership development series.
                </span>
              </div>
              <Button mode="link" underlined="dashed">
                <Link href="/account/members/teams">View</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-7.5">
              <div className="flex items-center gap-1.5">
                <span className="text-2sm text-muted-foreground/80 font-normal">
                  Code:
                </span>
                <span className="text-2sm text-primary medium">
                  #leaderdev-1
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-2sm text-muted-foreground/80 font-normal">
                  Progress:
                </span>
                <Progress
                  value={80}
                  indicatorClassName="bg-green-500 min-w-[120px] rounded-full"
                  className="h-1"
                />
              </div>
              <div className="max-w-auto flex shrink-0 items-center gap-1.5 lg:min-w-24">
                <span className="text-2sm text-muted-foreground/80 font-normal">
                  Guests:
                </span>
                <AvatarGroup>
                  <Avatar className="size-7">
                    <AvatarImage src="/media/avatars/300-4.png" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-7">
                    <AvatarImage src="/media/avatars/300-1.png" />
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-7">
                    <AvatarFallback className="text-foreground ring-background bg-background text-2sm">
                      K
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="size-7">
                    <AvatarImage src="/media/avatars/300-2.png" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                </AvatarGroup>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </EmployeeTimelineItem>
  );
};

export { EmployeeActivitiesProductWebinar };
