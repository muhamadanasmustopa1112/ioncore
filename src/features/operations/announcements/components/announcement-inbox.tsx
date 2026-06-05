"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Bell, CheckCircle, Circle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Announcement, AnnouncementPriority } from "../types";
import { useAnnouncements } from "../api/get-announcements";
import { useAcknowledgeAnnouncement } from "../api/post-acknowledge";

const priorityBadgeClass: Record<AnnouncementPriority, string> = {
  normal: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const priorityLabel: Record<AnnouncementPriority, string> = {
  normal: "Normal",
  urgent: "Urgent",
};

type InboxFilter = "all" | "unread" | "pending" | "acknowledged";

export function AnnouncementInbox() {
  const { t } = useTranslation();
  const [inboxFilter, setInboxFilter] = useState<InboxFilter>("all");
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());

  const { data: responseData } = useAnnouncements({ params: { draw: 1, start: 0, length: 100 } });
  const announcements = responseData?.data ?? [];
  const { mutate: acknowledgeAnnouncement } = useAcknowledgeAnnouncement();

  const inboxItems = useMemo(() => {
    return announcements.map((ann) => {
      const summary = ann.acknowledgment_summary;
      const isAcked = acknowledgedIds.has(ann.id) || summary.acknowledged_count === summary.total_recipients;
      const isRead = ann.read_receipt_summary.opened_count > 0;
      return { ...ann, isAcknowledged: isAcked, isRead };
    });
  }, [acknowledgedIds, announcements]);

  const filteredItems = useMemo(() => {
    switch (inboxFilter) {
      case "unread":
        return inboxItems.filter((i) => !i.isRead);
      case "pending":
        return inboxItems.filter((i) => !i.isAcknowledged);
      case "acknowledged":
        return inboxItems.filter((i) => i.isAcknowledged);
      default:
        return inboxItems;
    }
  }, [inboxItems, inboxFilter]);

  const handleAcknowledge = (id: string) => {
    acknowledgeAnnouncement(id, {
      onSuccess: () => {
        setAcknowledgedIds((prev) => new Set(prev).add(id));
      },
    });
  };

  return (
    <div className="mt-4 space-y-4">
      <Tabs value={inboxFilter} onValueChange={(v) => setInboxFilter(v as InboxFilter)}>
        <TabsList variant="default" size="sm">
          <TabsTrigger value="all">
            <Bell className="size-3.5" />
            {t("announcements.filterAll", "All")}
          </TabsTrigger>
          <TabsTrigger value="unread">
            <Circle className="size-3.5" />
            {t("announcements.filterUnread", "Unread")}
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Clock className="size-3.5" />
            {t("announcements.filterPending", "Pending Acknowledgment")}
          </TabsTrigger>
          <TabsTrigger value="acknowledged">
            <CheckCircle className="size-3.5" />
            {t("announcements.filterAcknowledged", "Acknowledged")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-3 pr-4">
          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Bell className="mb-3 size-10 opacity-40" />
                <p>{t("announcements.noInboxItems", "No announcements match this filter.")}</p>
              </CardContent>
            </Card>
          )}
          {filteredItems.map((item) => {
            const ackPct = item.acknowledgment_summary.total_recipients > 0
              ? Math.round((item.acknowledgment_summary.acknowledged_count / item.acknowledgment_summary.total_recipients) * 100)
              : 0;

            return (
              <Card key={item.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold leading-tight">
                        {item.title}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {item.body}
                      </p>
                    </div>
                    <Badge className={priorityBadgeClass[item.priority]}>
                      {priorityLabel[item.priority]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span>
                      {t("announcements.received", "Received")}:{" "}
                      {format(new Date(item.created_at), "dd MMM yyyy, HH:mm")}
                    </span>
                    <span className="flex items-center gap-1">
                      {t("announcements.ackProgress", "Acknowledgment")}:{" "}
                      <Progress value={ackPct} className="h-1.5 w-16 inline-block" />
                      {ackPct}%
                    </span>
                  </div>
                  {!item.isAcknowledged && (
                    <Button
                      size="sm"
                      variant={item.priority === "urgent" ? "destructive" : "primary"}
                      className="mt-3"
                      onClick={() => handleAcknowledge(item.id)}
                    >
                      <CheckCircle className="size-4" />
                      {t("announcements.acknowledge", "Acknowledge")}
                    </Button>
                  )}
                  {item.isAcknowledged && (
                    <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                      <CheckCircle className="size-4" />
                      {t("announcements.acknowledged", "Acknowledged")}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
