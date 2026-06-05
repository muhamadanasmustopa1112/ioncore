"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Download, Users, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAnnouncementStore } from "../store/announcement";

export function AcknowledgmentTracker() {
  const { t } = useTranslation();
  const { trackerOpen, trackerAnnouncement: announcement, closeTracker } = useAnnouncementStore();

  const stats = useMemo(() => {
    if (!announcement) return null;
    const { total_recipients, acknowledged_count, pending_count, pending_users } = announcement.acknowledgment_summary;
    const pct = total_recipients > 0 ? Math.round((acknowledged_count / total_recipients) * 100) : 0;
    return { total_recipients, acknowledged_count, pending_count, pending_users, pct };
  }, [announcement]);

  if (!trackerOpen || !announcement || !stats) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={closeTracker} />
      <Card className="relative z-10 w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <CardHeader className="border-border border-b">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                {t("announcements.ackTracking", "Acknowledgment Tracking")}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {announcement.title}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={closeTracker}>
              {t("common.close", "Close")}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Users className="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total_recipients}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("announcements.totalRecipients", "Total Recipients")}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                    <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.acknowledged_count}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("announcements.acknowledged", "Acknowledged")}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
                    <Clock className="size-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {stats.pending_count}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("announcements.pending", "Pending")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("announcements.ackProgress", "Acknowledgment Progress")}
                </span>
                <span className="text-sm font-bold">{stats.pct}%</span>
              </div>
              <Progress value={stats.pct} className="h-3" />
            </div>

            <Separator />

            {/* Pending Users */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" />
                <h4 className="text-sm font-semibold">
                  {t("announcements.pendingUsers", "Pending Users")} ({stats.pending_count})
                </h4>
              </div>
              <ScrollArea className="max-h-[200px]">
                {stats.pending_users.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    {t("announcements.allAcknowledged", "All recipients have acknowledged.")}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {stats.pending_users.map((userName, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {userName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{userName}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </CardContent>

        <div className="border-border border-t p-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => toast.info("Export coming soon")}>
            <Download className="size-4" />
            {t("announcements.exportReport", "Export Report")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
