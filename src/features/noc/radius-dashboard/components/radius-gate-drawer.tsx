"use client";

import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RiAlarmWarningLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiRefreshLine,
  RiCloseCircleLine,
} from "@remixicon/react";
import { GATE_ALERTS, RETRY_QUEUE } from "../data/mock-radius-data";
import { GateAlert, RetryQueueItem } from "../types/radius-dashboard";

export function RadiusGateDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const expiredCount = GATE_ALERTS.filter((a) => a.status === "EXPIRED").length;
  const retryCount = RETRY_QUEUE.length;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col bg-slate-50 dark:bg-slate-950">
        <SheetHeader className="p-6 border-b bg-background shrink-0">
          <SheetTitle className="flex items-center gap-2 text-xl font-black text-on-surface">
            <RiAlarmWarningLine className="size-6 text-amber-500" />
            {t("radius.gateAlertsTitle")}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {t("radius.gateAlertsDesc")}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8 pb-8">
            {/* Expiry Alerts Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <RiAlarmWarningLine className="size-4" />
                  {t("radius.expiryAlerts")}
                </h3>
                <Badge variant="destructive" className="font-mono text-xs">
                  {expiredCount} {t("radius.active")}
                </Badge>
              </div>

              {GATE_ALERTS.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic bg-white dark:bg-slate-900 rounded-xl border border-dashed">
                  {t("radius.noActiveAlerts")}
                </div>
              ) : (
                <div className="space-y-3">
                  {GATE_ALERTS.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              )}
            </section>

            {/* Retry Queue Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <RiRefreshLine className="size-4" />
                  {t("radius.provisioningRetryQueue")}
                </h3>
                <Badge variant={retryCount > 0 ? "warning" : "secondary"} appearance="light" className="font-mono text-xs">
                  {retryCount} {t("radius.queued")}
                </Badge>
              </div>

              {RETRY_QUEUE.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic bg-white dark:bg-slate-900 rounded-xl border border-dashed">
                  {t("radius.retryQueueClear")}
                </div>
              ) : (
                <div className="space-y-3">
                  {RETRY_QUEUE.map((item) => (
                    <RetryCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function AlertCard({ alert }: { alert: GateAlert }) {
  const { t } = useTranslation();
  const isExpired = alert.status === "EXPIRED";

  return (
    <Card className={`border shadow-sm rounded-xl overflow-hidden ${isExpired ? 'bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30' : 'bg-slate-50/50 dark:bg-slate-900/50'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-primary">{alert.workOrderNumber}</span>
              <Badge variant={isExpired ? "destructive" : "secondary"} size="sm" className="text-[10px] uppercase">
                {alert.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">{t("radius.tech")}: <span className="font-semibold text-slate-700 dark:text-slate-300">{alert.technicianName}</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">{t("radius.time")}</p>
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">{alert.expiredAt}</p>
          </div>
        </div>
        <div className={`mt-3 p-2.5 rounded-lg text-xs flex items-start gap-2 ${isExpired ? 'bg-white dark:bg-black/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50' : 'bg-white dark:bg-black/20 text-slate-600 dark:text-slate-400'}`}>
          {isExpired ? <RiAlarmWarningLine className="size-4 shrink-0 mt-0.5" /> : <RiCloseCircleLine className="size-4 shrink-0 mt-0.5" />}
          <p>{alert.message}</p>
        </div>
        {isExpired && (
          <div className="mt-4 flex gap-2">
            <Button variant="primary" size="sm" className="w-full text-[10px] h-8">
              {t("radius.verifyBast")}
            </Button>
            <Button variant="outline" size="sm" className="w-full text-[10px] h-8 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950">
              {t("radius.revokeForcefully")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RetryCard({ item }: { item: RetryQueueItem }) {
  const { t } = useTranslation();
  return (
    <Card className="border shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-primary">{item.workOrderNumber}</span>
              <Badge variant="warning" appearance="light" size="sm" className="text-[10px] uppercase">
                {item.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">{t("radius.tech")}: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.technicianName}</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">{t("radius.attempt")}</p>
            <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-500">{item.attempts} / 5</p>
          </div>
        </div>
        <div className="mt-3 p-2.5 rounded-lg text-xs flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
          <RiTimeLine className="size-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">{t("radius.awaitingRetry")}</p>
            <p>{item.errorMessage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
