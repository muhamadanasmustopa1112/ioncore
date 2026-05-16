"use client";

import { Bell, CheckCheck, Loader2, MailOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "../api/get-notifications";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function NotificationPopover() {
  const { data, isLoading } = useNotifications();
  const notifications = data?.data || [];
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button mode="icon" variant="ghost" className="relative size-10 rounded-lg text-muted-foreground hover:text-primary">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge className="absolute top-1.5 right-1.5 size-4 p-0 flex items-center justify-center bg-destructive text-white border-white border-2 text-[10px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 shadow-2xl rounded-xl border-border/60">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 px-2 text-primary hover:bg-primary/5">
              <CheckCheck className="size-3" /> Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[380px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              <span className="text-xs">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground/60">
              <MailOpen className="size-8 opacity-20" />
              <span className="text-xs">No notifications yet</span>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "px-4 py-3 flex gap-3 hover:bg-muted/40 transition-colors cursor-pointer border-b border-border/30 last:border-0",
                    !notif.is_read && "bg-primary/[0.03]"
                  )}
                >
                  <div className={cn(
                    "size-2 rounded-full mt-1.5 shrink-0",
                    !notif.is_read ? "bg-primary" : "bg-transparent"
                  )} />
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <span className={cn(
                      "text-[13px] leading-tight",
                      !notif.is_read ? "font-bold text-foreground" : "font-medium text-muted-foreground"
                    )}>
                      {notif.title}
                    </span>
                    <p className="text-[12px] text-muted-foreground/80 line-clamp-2 leading-normal">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t border-border/50">
          <Button variant="ghost" className="w-full h-8 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
