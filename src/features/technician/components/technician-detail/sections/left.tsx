"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Settings,
  Activity,
  Map as MapIcon,
  Truck,
  Network,
  ShieldCheck,
  Smartphone,
  Wifi,
  Zap,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { WorkOrderDetailResponse } from "../../../types/technician-api";
import { SectionCard, Field, SpecCell, Empty, fmtDate, humanize } from "../shared";
import { TechnicianCard, JourneyRow } from "../shared-widgets";
import { RadiusCredentialsPanel } from "../radius-credentials-panel";
import { useRequestTemporaryRadius } from "../../../api/warehouse";

export function LeftInfoSections({ wo }: { wo: WorkOrderDetailResponse }) {
  const { t } = useTranslation();
  const { mutate, isPending } = useRequestTemporaryRadius();
  const [forceReserved, setForceReserved] = useState(false);

  const isReserved = wo.inventory_reservation_status === "reserved" || forceReserved;
  const isStateValid = wo.state === "dispatched" || forceReserved;
  const hasFailedOrExpired =
    wo.temporary_provisioning_status === "TEMPORARY_FAILURE" ||
    wo.temporary_provisioning_status === "FAILED" ||
    wo.temporary_provisioning_status === "EXPIRED";
  const isGatePassed = (isStateValid && isReserved) || hasFailedOrExpired;

  return (
    <>
      {/* Customer & Site */}
      <SectionCard icon={User} title={t("workOrder.detail.customerSite")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Field label={t("workOrder.detail.customer")} value={wo.customer_name} />
          <Field label={t("workOrder.detail.phone")} value={wo.customer_phone} />
          {wo.customer_email && <Field label={t("workOrder.detail.email")} value={wo.customer_email} className="sm:col-span-2" />}
          <Field label={t("workOrder.detail.siteName")} value={wo.site_name} />
          <Field label={t("workOrder.detail.package")} value={wo.package_name} />
          <Field label={t("workOrder.detail.serviceType")} value={wo.service_type} capitalize />
          <Field label={t("workOrder.detail.productType")} value={wo.product_type} capitalize />
          <Field label={t("workOrder.detail.address")} value={wo.site_address} className="sm:col-span-2" />
        </div>
      </SectionCard>

      {/* Routing */}
      {wo.routing && (
        <SectionCard icon={Network} title={t("workOrder.detail.routing")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Field label={t("workOrder.detail.branch")} value={wo.branch.name} />
            <Field label={t("workOrder.detail.area")} value={wo.area_name || wo.routing.resolved_area_id} />
            <Field label={t("workOrder.detail.subArea")} value={wo.sub_area_name || wo.routing.resolved_sub_area_id} />
            <Field label={t("workOrder.detail.routedTo")} value={wo.routing.routed_to_role} />
            {wo.routing.escalated_at && (
              <Field label={t("workOrder.detail.escalated")} value={fmtDate(wo.routing.escalated_at)} />
            )}
          </div>
        </SectionCard>
      )}

      {/* Assigned Team */}
      <SectionCard icon={Settings} title={t("workOrder.detail.assignedTeam")}>
        {wo.assigned_team && wo.assigned_team.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            {wo.assigned_team.map((t) => (
              <TechnicianCard key={t.technician_id} t={t} />
            ))}
          </div>
        ) : (
          <Empty>{t("workOrder.detail.noTechniciansAssigned")}</Empty>
        )}
      </SectionCard>

      {/* Location */}
      {wo.latitude && wo.longitude && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> {t("workOrder.detail.location")}
              </CardTitle>
              <Link
                href={wo.navigation_url || `https://maps.google.com/maps?q=${wo.latitude},${wo.longitude}`}
                target="_blank"
                className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline"
              >
                {t("workOrder.detail.openInGoogleMaps")}
              </Link>
            </div>
          </CardHeader>
          <div className="h-64 sm:h-80 bg-slate-100 dark:bg-slate-800 relative">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${wo.latitude},${wo.longitude}&hl=en&z=15&output=embed`}
              className="grayscale dark:invert-[0.9] dark:hue-rotate-180"
            />
          </div>
          <CardContent className="pt-4 text-xs text-slate-500">
            <span className="font-mono">{wo.latitude}, {wo.longitude}</span>
          </CardContent>
        </Card>
      )}

      {/* Infrastructure / ONT */}
      {wo.ont_configuration && (
        <SectionCard icon={Activity} title={t("workOrder.detail.infrastructureConfiguration")}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SpecCell label={t("workOrder.detail.model")} value={wo.ont_configuration.model} />
            <SpecCell label={t("workOrder.detail.serialNumber")} value={wo.ont_configuration.serial_number} />
            <SpecCell label={t("workOrder.detail.vlan")} value={wo.ont_configuration.vlan_id} />
            <SpecCell label={t("workOrder.detail.ipAddress")} value={wo.ont_configuration.ip_address} />
            <SpecCell label={t("workOrder.detail.authStatus")} value={wo.ont_configuration.authentication_status} />
            <SpecCell
              label={t("workOrder.detail.bandwidth")}
              value={
                wo.ont_configuration.expected_bandwidth_down_mbps && wo.ont_configuration.expected_bandwidth_up_mbps
                  ? `↓${wo.ont_configuration.expected_bandwidth_down_mbps} / ↑${wo.ont_configuration.expected_bandwidth_up_mbps} Mbps`
                  : undefined
              }
            />
          </div>
          <RadiusCredentialsPanel
            workOrderId={wo.id}
            maskedUsername={wo.ont_configuration.radius_username}
            maskedPassword={wo.ont_configuration.radius_password}
          />
        </SectionCard>
      )}

      {/* Required Skills */}
      {Array.isArray(wo.required_skills) && wo.required_skills.length > 0 && (
        <SectionCard icon={ShieldCheck} title={t("workOrder.detail.requiredSkills")}>
          <div className="flex flex-wrap gap-2">
            {wo.required_skills.map((s) => (
              <Badge key={s} variant="info" appearance="light" className="capitalize">
                {humanize(s)}
              </Badge>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Warehouse Dispatch */}
      {wo.warehouse_dispatch && (
        <SectionCard icon={Truck} title={t("workOrder.detail.warehouseDispatch")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Field label={t("workOrder.detail.dispatchedAt")} value={fmtDate(wo.warehouse_dispatch.dispatched_at)} />
            <Field label={t("workOrder.detail.dispatchedBy")} value={wo.warehouse_dispatch.dispatched_by_name} />
            <Field label={t("workOrder.detail.warehouseBranch")} value={wo.warehouse_dispatch.warehouse_branch.name} />
            {wo.warehouse_dispatch.note && (
              <Field label={t("workOrder.detail.note")} value={wo.warehouse_dispatch.note} className="sm:col-span-2" />
            )}
          </div>
          {wo.warehouse_dispatch.devices && wo.warehouse_dispatch.devices.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{t("workOrder.detail.devices")}</p>
              <div className="space-y-2">
                {wo.warehouse_dispatch.devices.map((d, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 min-w-0">
                      <Smartphone className="size-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{d.device_serial}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{d.device_type}</p>
                      </div>
                    </div>
                    {d.picked_up ? (
                      <Badge variant="success" appearance="light" size="sm">{t("workOrder.detail.pickedUp")}</Badge>
                    ) : (
                      <Badge variant="warning" appearance="light" size="sm">{t("workOrder.detail.pending")}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Cable Consumption */}
      {wo.cable_consumption && (
        <SectionCard icon={Activity} title={t("workOrder.detail.cableConsumption")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t("workOrder.detail.usedMeters")} value={`${wo.cable_consumption.cable_used_meters} m`} />
            <Field label={t("workOrder.detail.remnantMeters")} value={`${wo.cable_consumption.remnant_meters} m`} />
            <Field label={t("workOrder.detail.remnantReturned")} value={wo.cable_consumption.remnant_returned ? t("workOrder.detail.yes") : t("workOrder.detail.no")} />
            <Field label={t("workOrder.detail.recordedAt")} value={fmtDate(wo.cable_consumption.recorded_at)} />
            <Field label={t("workOrder.detail.recordedBy")} value={wo.cable_consumption.recorded_by_user.name} />
            <Field label={t("workOrder.detail.recordedRole")} value={wo.cable_consumption.recorded_role} capitalize />
            {wo.cable_consumption.note && (
              <Field label={t("workOrder.detail.note")} value={wo.cable_consumption.note} className="sm:col-span-2" />
            )}
          </div>
        </SectionCard>
      )}

      {/* Execution Journey */}
      {wo.execution && (
        <SectionCard icon={MapIcon} title={t("workOrder.detail.executionJourney")}>
          <div className="space-y-3">
            <JourneyRow
              label={t("workOrder.detail.acceptances")}
              done={!!wo.execution.acceptances && wo.execution.acceptances.length > 0}
              detail={
                wo.execution.acceptances && wo.execution.acceptances.length > 0
                  ? t("workOrder.detail.techniciansAccepted", { count: wo.execution.acceptances.length })
                  : t("workOrder.detail.awaitingAcceptance")
              }
            />
            <JourneyRow
              label={t("workOrder.detail.journeyStarted")}
              done={!!wo.execution.journey_started}
              detail={wo.execution.journey_started ? fmtDate(wo.execution.journey_started.recorded_at) : t("workOrder.detail.notStarted")}
            />
            <JourneyRow
              label={t("workOrder.detail.arrivedOnSite")}
              done={!!wo.execution.arrival}
              detail={wo.execution.arrival ? fmtDate(wo.execution.arrival.recorded_at) : t("workOrder.detail.notArrived")}
            />
            {wo.execution.last_known_gps && (
              <div className="text-[10px] text-slate-400 mt-2 font-mono">
                {t("workOrder.detail.lastGps")}: {wo.execution.last_known_gps.latitude}, {wo.execution.last_known_gps.longitude}
                {wo.execution.last_known_gps.recorded_at && ` · ${fmtDate(wo.execution.last_known_gps.recorded_at)}`}
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Temporary Radius Provisioning */}
      {/* <SectionCard icon={Wifi} title="Temporary Radius Provisioning">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/20 dark:bg-blue-950/20">
            <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-200">ION Radius Status</p>
              <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mt-1">
                Active temporary configuration for installation test gate.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {wo.temporary_provisioning_status === "TEMPORARY_ACTIVE" || wo.temporary_provisioning_status === "TEMPORARY" ? (
                <Badge variant="success" appearance="light" size="lg" className="flex items-center gap-1 font-extrabold uppercase tracking-wide">
                  <Zap className="size-3 text-emerald-500 fill-emerald-500" />
                  Temporary Active
                </Badge>
              ) : wo.temporary_provisioning_status === "TEMPORARY_PENDING" ? (
                <Badge variant="warning" appearance="light" size="lg" className="animate-pulse flex items-center gap-1 font-extrabold uppercase tracking-wide">
                  <Loader2 className="size-3 animate-spin text-amber-500" />
                  Temporary Pending
                </Badge>
              ) : wo.temporary_provisioning_status === "TEMPORARY_FAILURE" ? (
                <Badge variant="destructive" appearance="light" size="lg" className="flex items-center gap-1 font-extrabold uppercase tracking-wide">
                  Temporary Failure
                </Badge>
              ) : wo.temporary_provisioning_status === "FAILED" ? (
                <Badge variant="destructive" appearance="light" size="lg" className="flex items-center gap-1 font-extrabold uppercase tracking-wide">
                  Failed
                </Badge>
              ) : wo.temporary_provisioning_status === "EXPIRED" ? (
                <Badge variant="secondary" appearance="light" size="lg" className="flex items-center gap-1 font-extrabold uppercase tracking-wide">
                  Expired
                </Badge>
              ) : (
                <Badge variant="secondary" appearance="light" size="lg" className="font-extrabold uppercase tracking-wide">
                  Not Activated
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Precondition Verification Gates</p>
              <button
                type="button"
                onClick={() => setForceReserved(!forceReserved)}
                className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
              >
                {forceReserved ? "Use Real Stock State" : "Force Reserve State"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-150/60 dark:border-slate-800/60 text-xs">
                <span className="text-slate-500 font-medium">Work Order State:</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={`size-2 rounded-full ${(wo.state === "dispatched" || wo.state === "in_progress" || forceReserved) ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className={(wo.state === "dispatched" || wo.state === "in_progress" || forceReserved) ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500"}>
                    {(wo.state === "dispatched" || wo.state === "in_progress") ? wo.state.toUpperCase() : (forceReserved ? "DISPATCHED (MOCK)" : (wo.state ? wo.state.toUpperCase() : "PENDING"))}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-150/60 dark:border-slate-800/60 text-xs">
                <span className="text-slate-500 font-medium">Inventory Reservation:</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={`size-2 rounded-full ${isReserved ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className={isReserved ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500"}>
                    {isReserved ? (wo.inventory_reservation_status === "reserved" ? "RESERVED" : "RESERVED (AUTO)") : "PENDING"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button
              variant={isGatePassed ? "primary" : "outline"}
              disabled={
                !isGatePassed ||
                isPending ||
                wo.temporary_provisioning_status === "TEMPORARY_ACTIVE" ||
                wo.temporary_provisioning_status === "TEMPORARY" ||
                wo.temporary_provisioning_status === "TEMPORARY_PENDING"
              }
              onClick={() => mutate({
                id: wo.id,
                data: {
                  actor_id: "TECH-01",
                  actor_role: "technician",
                  note: "Requesting temporary radius provisioning for installation test"
                }
              })}
              className="w-full sm:w-auto font-extrabold text-xs uppercase tracking-wider py-2 px-6 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              {wo.temporary_provisioning_status === "TEMPORARY_ACTIVE" || wo.temporary_provisioning_status === "TEMPORARY"
                ? "Temporary Radius Active"
                : wo.temporary_provisioning_status === "TEMPORARY_PENDING"
                  ? "Pending..."
                  : "Request Temporary Radius"}
            </Button>
          </div>
        </div>
      </SectionCard> */}
    </>
  );
}
