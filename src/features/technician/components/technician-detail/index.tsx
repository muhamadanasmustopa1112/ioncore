"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { paths } from "@/config/paths";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkOrder } from "../../api/technician-queries";
import {
  PairingModal,
  NOCApprovalModal,
  RescheduleModal,
  CrossAreaModal,
  CancelModal,
} from "./modals";
import { LeftInfoSections } from "./sections/left";
import { DocsSections } from "./sections/docs";
import { RightSections } from "./sections/right";
import {
  STATE_VARIANT,
  STATE_LABEL,
  TYPE_LABEL,
  PRIORITY_VARIANT,
  humanize,
  fmtDate,
} from "./shared";

export function TechnicianWorkOrderDetail({ id }: { id: string }) {
  const { data: wo, isLoading, isError, error } = useWorkOrder(id);

  const [showPairing, setShowPairing] = useState(false);
  const [showNOC, setShowNOC] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCrossArea, setShowCrossArea] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !wo) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="size-10 text-rose-500" />
        <p className="text-sm text-slate-600">
          Failed to load work order: {(error as Error)?.message ?? "unknown error"}
        </p>
        <Link
          href={paths.dashboard.technician.root.getHref()}
          className="text-xs text-primary font-bold uppercase tracking-widest hover:underline"
        >
          Back to list
        </Link>
      </div>
    );
  }

  const isDone = wo.state === "completed" || wo.state === "cancelled";
  const hasTeam = wo.assigned_team && wo.assigned_team.length > 0;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root.getHref()}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.technician.root.getHref()}>Technician &amp; Field</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate max-w-[120px] sm:max-w-none">
              {wo.number || id}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <Card className="mb-4 lg:mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{wo.number}</span>
                {wo.type && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      {TYPE_LABEL[wo.type] ?? humanize(wo.type)}
                    </span>
                  </>
                )}
                {wo.priority && (
                  <Badge variant={PRIORITY_VARIANT[wo.priority] ?? "primary"} appearance="light" size="sm" className="uppercase">
                    {wo.priority}
                  </Badge>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface line-clamp-2 mb-1">{wo.title || "—"}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500">
                <span>Scheduled: <span className="font-semibold text-slate-700 dark:text-slate-300">{fmtDate(wo.requested_installation)}</span></span>
                {wo.requested_at && (
                  <span>Requested: <span className="font-semibold text-slate-700 dark:text-slate-300">{fmtDate(wo.requested_at)}</span></span>
                )}
              </div>
            </div>

            {/* State + Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {wo.state && (
                <Badge variant={STATE_VARIANT[wo.state] ?? "primary"} appearance="light" size="lg" className="uppercase tracking-widest font-bold">
                  {STATE_LABEL[wo.state] ?? humanize(wo.state)}
                </Badge>
              )}
              {!isDone && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setShowPairing(true)} className="text-[10px] uppercase font-bold">
                    {hasTeam ? "Reassign" : "Assign"} Pairing
                  </Button>
                  {!hasTeam && (
                    <Button variant="outline" size="sm" onClick={() => setShowCrossArea(true)} className="text-[10px] uppercase font-bold">
                      Cross-Area
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setShowReschedule(true)} className="text-[10px] uppercase font-bold">
                    Reschedule
                  </Button>
                  {wo.state === "pending_noc_verification" && (
                    <Button variant="primary" size="sm" onClick={() => setShowNOC(true)} className="text-[10px] uppercase font-bold">
                      NOC Verify
                    </Button>
                  )}
                  <Button variant="destructive" appearance="ghost" size="sm" onClick={() => setShowCancel(true)} className="text-[10px] uppercase font-bold">
                    Cancel WO
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-column layout */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-4 lg:space-y-6">
          <LeftInfoSections wo={wo} />
          <DocsSections wo={wo} />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-4 lg:space-y-6">
          <RightSections wo={wo} />
        </div>
      </div>

      {/* Modals */}
      {showPairing && (
        <PairingModal
          workOrderId={wo.id}
          workOrderNumber={wo.number}
          currentTeam={wo.assigned_team ?? []}
          onClose={() => setShowPairing(false)}
        />
      )}
      {showNOC && (
        <NOCApprovalModal
          workOrderId={wo.id}
          workOrderNumber={wo.number}
          onClose={() => setShowNOC(false)}
        />
      )}
      {showReschedule && (
        <RescheduleModal
          workOrderId={wo.id}
          workOrderNumber={wo.number}
          currentSchedule={wo.requested_installation}
          currentPriority={wo.priority}
          onClose={() => setShowReschedule(false)}
        />
      )}
      {showCrossArea && (
        <CrossAreaModal
          workOrderId={wo.id}
          workOrderNumber={wo.number}
          onClose={() => setShowCrossArea(false)}
        />
      )}
      {showCancel && (
        <CancelModal
          workOrderId={wo.id}
          workOrderNumber={wo.number}
          onClose={() => setShowCancel(false)}
        />
      )}
    </div>
  );
}
