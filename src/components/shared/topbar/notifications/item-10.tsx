import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AvatarGroup } from "@/components/shared/common/avatar-group";

export default function Item10() {
  return (
    <div className="flex grow gap-2 px-5">
      <Avatar>
        <AvatarImage src="/media/avatars/300-15.png" alt="avatar" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-1.5 -bottom-1.5">
          <AvatarStatus variant="online" className="size-2.5" />
        </AvatarIndicator>
      </Avatar>

      <div className="flex grow flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="mb-px text-sm font-medium">
            <Link
              href="#"
              className="hover:text-primary text-mono font-semibold"
            >
              Nova Hawthorne
            </Link>
            <span className="text-secondary-foreground">
              {" "}
              sent you an meeting invation{" "}
            </span>
          </div>
          <span className="text-muted-foreground flex items-center text-xs font-medium">
            2 days ago
            <span className="bg-mono/30 mx-1.5 size-1 rounded-full"></span>
            Dev Team
          </span>
        </div>

        <Card className="bg-muted/70 rounded-lg p-2.5 shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="border-warning-transparent rounded-lg border">
                <div className="border-b-warning-transparent flex items-center justify-center rounded-t-lg border-b bg-yellow-400/10">
                  <span className="fw-medium p-1.5 text-xs text-yellow-400">
                    Apr
                  </span>
                </div>
                <div className="flex size-9 items-center justify-center">
                  <span className="fw-semibold text-mono text-md tracking-tight">
                    12
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Link
                  href="#"
                  className="hover:text-primary text-secondary-foreground text-xs font-medium"
                >
                  Peparation For Release
                </Link>
                <span className="text-secondary-foreground text-xs font-medium">
                  9:00 PM - 10:00 PM
                </span>
              </div>
            </div>

            <AvatarGroup
              size="size-6"
              group={[
                { path: "/media/avatars/300-1.png" },
                { path: "/media/avatars/300-2.png" },
                { path: "/media/avatars/300-3.png" },
                {
                  fallback: "+3",
                  variant: "text-white size-6 ring-background bg-green-500",
                },
              ]}
            />
          </div>
        </Card>

        <div className="flex flex-wrap gap-2.5">
          <Button size="sm" variant="outline">
            Decline
          </Button>
          <Button size="sm" variant="mono">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
