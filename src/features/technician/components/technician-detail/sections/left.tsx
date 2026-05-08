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
import type { WorkOrderDetailResponse } from "../../../types/technician-api";
import { SectionCard, Field, SpecCell, Empty, fmtDate, humanize } from "../shared";
import { TechnicianCard, JourneyRow } from "../shared-widgets";
import { useRequestTemporaryRadius } from "../../../api/warehouse";

export function LeftInfoSections({ wo }: { wo: WorkOrderDetailResponse }) {
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
      <SectionCard icon={User} title="Customer & Site">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Field label="Customer" value={wo.customer_name} />
          <Field label="Phone" value={wo.customer_phone} />
          {wo.customer_email && <Field label="Email" value={wo.customer_email} className="sm:col-span-2" />}
          <Field label="Site Name" value={wo.site_name} />
          <Field label="Package" value={wo.package_name} />
          <Field label="Service Type" value={wo.service_type} capitalize />
          <Field label="Product Type" value={wo.product_type} capitalize />
          <Field label="Address" value={wo.site_address} className="sm:col-span-2" />
        </div>
      </SectionCard>

      {/* Routing */}
      {wo.routing && (
        <SectionCard icon={Network} title="Routing">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Field label="Branch" value={wo.branch_name || wo.routing.resolved_branch_id} />
            <Field label="Area" value={wo.area_name || wo.routing.resolved_area_id} />
            <Field label="Sub Area" value={wo.sub_area_name || wo.routing.resolved_sub_area_id} />
            <Field label="Routed To" value={wo.routing.routed_to_role} />
            {wo.routing.escalated_at && (
              <Field label="Escalated" value={fmtDate(wo.routing.escalated_at)} />
            )}
          </div>
        </SectionCard>
      )}

      {/* Assigned Team */}
      <SectionCard icon={Settings} title="Assigned Team">
        {wo.assigned_team && wo.assigned_team.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            {wo.assigned_team.map((t) => (
              <TechnicianCard key={t.technician_id} t={t} />
            ))}
          </div>
        ) : (
          <Empty>No technicians assigned yet.</Empty>
        )}
      </SectionCard>

      {/* Location */}
      {wo.latitude && wo.longitude && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> Location
              </CardTitle>
              <Link
                href={wo.navigation_url || `https://maps.google.com/maps?q=${wo.latitude},${wo.longitude}`}
                target="_blank"
                className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline"
              >
                Open in Google Maps
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
        <SectionCard icon={Activity} title="Infrastructure / ONT Configuration">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SpecCell label="ODP ID" value={wo.ont_configuration.odp_id} />
            <SpecCell label="Slot" value={wo.ont_configuration.odp_slot} />
            <SpecCell
              label="ODP Location"
              value={
                wo.ont_configuration.odp_location_lat && wo.ont_configuration.odp_location_lng
                  ? `${wo.ont_configuration.odp_location_lat}, ${wo.ont_configuration.odp_location_lng}`
                  : undefined
              }
            />
            <SpecCell
              label="Cable Distance"
              value={
                wo.ont_configuration.cable_distance_meters
                  ? `${wo.ont_configuration.cable_distance_meters} m`
                  : undefined
              }
            />
            <SpecCell label="Model" value={wo.ont_configuration.model} />
            <SpecCell label="Serial #" value={wo.ont_configuration.serial_number} />
            <SpecCell label="VLAN" value={wo.ont_configuration.vlan_id} />
            <SpecCell label="IP Address" value={wo.ont_configuration.ip_address} />
          </div>
        </SectionCard>
      )}

      {/* Required Skills */}
      {Array.isArray(wo.required_skills) && wo.required_skills.length > 0 && (
        <SectionCard icon={ShieldCheck} title="Required Skills">
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
        <SectionCard icon={Truck} title="Warehouse Dispatch">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Field label="Dispatched At" value={fmtDate(wo.warehouse_dispatch.dispatched_at)} />
            <Field label="Dispatched By" value={wo.warehouse_dispatch.dispatched_by} />
            <Field label="Warehouse Branch" value={wo.warehouse_dispatch.warehouse_branch_id} />
            {wo.warehouse_dispatch.note && (
              <Field label="Note" value={wo.warehouse_dispatch.note} className="sm:col-span-2" />
            )}
          </div>
          {wo.warehouse_dispatch.devices && wo.warehouse_dispatch.devices.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Devices</p>
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
                      <Badge variant="success" appearance="light" size="sm">Picked up</Badge>
                    ) : (
                      <Badge variant="warning" appearance="light" size="sm">Pending</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Execution Journey */}
      {wo.execution && (
        <SectionCard icon={MapIcon} title="Execution Journey">
          <div className="space-y-3">
            <JourneyRow
              label="Acceptances"
              done={!!wo.execution.acceptances && wo.execution.acceptances.length > 0}
              detail={
                wo.execution.acceptances && wo.execution.acceptances.length > 0
                  ? `${wo.execution.acceptances.length} technician${wo.execution.acceptances.length > 1 ? "s" : ""} accepted`
                  : "Awaiting acceptance"
              }
            />
            <JourneyRow
              label="Journey Started"
              done={!!wo.execution.journey_started}
              detail={wo.execution.journey_started ? fmtDate(wo.execution.journey_started.recorded_at) : "Not started"}
            />
            <JourneyRow
              label="Arrived On Site"
              done={!!wo.execution.arrival}
              detail={wo.execution.arrival ? fmtDate(wo.execution.arrival.recorded_at) : "Not arrived"}
            />
            {wo.execution.last_known_gps && (
              <div className="text-[10px] text-slate-400 mt-2 font-mono">
                Last GPS: {wo.execution.last_known_gps.latitude}, {wo.execution.last_known_gps.longitude}
                {wo.execution.last_known_gps.recorded_at && ` · ${fmtDate(wo.execution.last_known_gps.recorded_at)}`}
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Temporary Radius Provisioning */}
      <SectionCard icon={Wifi} title="Temporary Radius Provisioning">
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
      </SectionCard>
    </>
  );
}
