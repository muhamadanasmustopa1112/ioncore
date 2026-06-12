"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { RiArrowRightUpLine, RiUserAddLine, RiMapPinLine, RiRouteLine, RiCheckboxCircleLine, RiUserReceivedLine, RiUserLine, RiIdCardLine, RiPhoneLine, RiHomeLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { paths } from "@/config/paths";
import { PERMISSIONS } from "@/config/permissions";
import { useResourceActions } from "@/hooks/use-resource-actions";
import { Can } from "@/lib/permissions";
import {
  useCreateLeadActivity,
  useLead,
  useUpdateLeadCableAcceptance,
  useUpdateLeadCableDistance,
  useUpdateLeadStatus,
} from "../api/leads-queries";
import type { LeadActivityType, LeadStatus } from "../types/leads-api";
import { RerouteLeadSheet } from "./reroute-lead-sheet";

const STATUS_VARIANT: Record<LeadStatus, "primary" | "success" | "warning" | "destructive" | "secondary"> = {
  new: "secondary",
  active: "primary",
  warm: "warning",
  hot: "destructive",
  converted: "success",
  lost: "destructive",
  potential: "warning",
};

const STATUSES: LeadStatus[] = ["new", "active", "warm", "hot", "converted", "lost", "potential"];
const STATUS_INDEX: Record<LeadStatus, number> = Object.fromEntries(
  STATUSES.map((s, i) => [s, i])
) as Record<LeadStatus, number>;
const ACTIVITY_TYPES: LeadActivityType[] = ["call", "visit", "note", "email"];

export function LeadDetail() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: lead, isLoading } = useLead(id);

  const router = useRouter();
  const [rerouteOpen, setRerouteOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<LeadStatus>("new");
  const [statusNote, setStatusNote] = useState("");
  const [cable, setCable] = useState("");
  const [activityType, setActivityType] = useState<LeadActivityType>("note");
  const [activityNotes, setActivityNotes] = useState("");

  const updateStatus = useUpdateLeadStatus(id);
  const updateCable = useUpdateLeadCableDistance(id);
  const updateAcceptance = useUpdateLeadCableAcceptance(id);
  const addActivity = useCreateLeadActivity(id);
  const { canUpdate, canRoute } = useResourceActions("lead");

  useEffect(() => {
    if (lead?.status) setStatusDraft(lead.status);
  }, [lead?.status]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2" /> {t("common.loading")}
      </div>
    );
  }
  if (!lead) {
    return <div className="p-8 text-center text-muted-foreground text-sm">{t("leads.leadNotFound", "Lead not found")}</div>;
  }

  const displayValue = (value?: string | null) => (value?.trim() ? value.trim() : "—");
  const salesName = lead.sales_name ?? lead.assigned_sales_name;
  const contactPerson = lead.contact_person ?? lead.phone_number;

  return (
    <div className="flex flex-col gap-6 p-4">
      <PageBreadcrumb
        items={[
          { title: t("menu.crmAndSales"), path: paths.dashboard.crmAndSales.root.getHref() },
          { title: t("menu.leads"), path: paths.dashboard.crmAndSales.leads.root.getHref() },
          { title: lead.lead_name },
        ]}
      />

      <Toolbar className="items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            {lead.lead_name}
          </ToolbarTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={STATUS_VARIANT[lead.status]} appearance="light" size="md">
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">
              {lead.lead_type} · {lead.customer_sub_type} · {lead.source.replace("_", " ")}
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Can permission={PERMISSIONS.lead.route}>
            <Button variant="outline" size="sm" onClick={() => setRerouteOpen(true)} className="gap-1.5">
              <RiArrowRightUpLine className="size-4" />
              {t("leads.reroute", "Reroute")}
            </Button>
          </Can>
          {lead.status !== "converted" && canUpdate && (
            <Button variant="primary" size="sm" onClick={() => router.push(paths.dashboard.crmAndSales.leads.convert.getHref(id))} className="gap-1.5">
              <RiUserAddLine className="size-4" />
              {t("leads.convert", "Convert")}
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t("leads.salesName", "Sales Name"), value: displayValue(salesName), icon: <RiUserLine className="size-4 text-muted-foreground" /> },
          { label: t("customers.nik"), value: displayValue(lead.nik), icon: <RiIdCardLine className="size-4 text-muted-foreground" /> },
          { label: t("leads.contactPerson", "Contact Person"), value: displayValue(contactPerson), icon: <RiPhoneLine className="size-4 text-muted-foreground" /> },
          { label: t("common.address"), value: displayValue(lead.address), icon: <RiHomeLine className="size-4 text-muted-foreground" /> },
          { label: t("leads.cableDistance", "Cable Distance"), value: `${lead.cable_distance_meters} m`, icon: <RiRouteLine className="size-4 text-muted-foreground" /> },
          { label: t("leads.excessCable", "Excess Cable"), value: lead.is_excess_cable_accepted ? t("leads.accepted", "Accepted") : t("leads.notAccepted", "Not accepted"), icon: <RiCheckboxCircleLine className="size-4 text-muted-foreground" /> },
          { label: t("leads.coords", "Coords"), value: lead.installation_point_lat ? `${lead.installation_point_lat?.toFixed(4)}, ${lead.installation_point_lng?.toFixed(4)}` : "—", icon: <RiMapPinLine className="size-4 text-muted-foreground" /> },
          {
            label: t("customers.referrerCustomer"),
            value: lead.referrer_customer_id ? (
              <a
                href={paths.dashboard.crmAndSales.customer.detail.getHref(lead.referrer_customer_id)}
              >
                {lead.referrer_name}
              </a>
            ) : "—",
            icon: <RiUserReceivedLine className="size-4 text-muted-foreground" />
          },
        ].map(({ label, value, icon }) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mb-1">
              {icon}{label}
            </p>
            <div className="text-sm font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card>
          <CardHeader><CardTitle>{t("common.status")}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {(lead.status === "converted" || lead.status === "lost") ? (() => {
              const lastEntry = [...(lead.status_timeline ?? [])].reverse().find((t) => t.status === lead.status);
              return (
                <div className="flex flex-col gap-3">
                  <Badge variant={STATUS_VARIANT[lead.status]} appearance="light" size="md" className="w-fit">
                    {t(`common.chartLabels.${lead.status}`, { defaultValue: lead.status })}
                  </Badge>
                  <div className="rounded-lg border bg-muted/40 px-3 py-2.5 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{t("leads.notes", "Notes")}</p>
                    {lastEntry?.notes ? (
                      <>
                        <p className="text-sm text-foreground">{lastEntry.notes}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(lastEntry.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">{t("leads.noNotes", "No notes recorded for this status change.")}</p>
                    )}
                  </div>
                </div>
              );
            })() : canUpdate ? (
              <>
                <Select value={statusDraft} onValueChange={(v) => setStatusDraft(v as LeadStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.filter((s) => STATUS_INDEX[s] >= STATUS_INDEX[lead.status]).map((s) => (
                      <SelectItem key={s} value={s}>
                        <div className="flex items-center gap-2">
                          <Badge variant={STATUS_VARIANT[s]} appearance="light" size="sm">{t(`common.chartLabels.${s}`, { defaultValue: s })}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-1">
                  <Textarea
                    placeholder={statusDraft === "lost" ? t("leads.reasonRequired", "Reason required for Lost status...") : t("leads.notesOptional", "Notes (optional)")}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className={statusDraft === "lost" && !statusNote.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {statusDraft === "lost" && !statusNote.trim() && (
                    <p className="text-xs text-destructive">{t("leads.reasonRequiredLost", "Reason is required when marking as Lost.")}</p>
                  )}
                </div>
                <Button
                  variant="primary"
                  onClick={() => updateStatus.mutate({ status: statusDraft, notes: statusNote })}
                  disabled={
                    updateStatus.isPending ||
                    STATUS_INDEX[statusDraft] < STATUS_INDEX[lead.status] ||
                    (statusDraft === "lost" && !statusNote.trim())
                  }
                >
                  {updateStatus.isPending && <Loader2 className="size-4 animate-spin" />}
                  {t("common.save", "Save")}
                </Button>
              </>
            ) : (
              <Badge variant={STATUS_VARIANT[lead.status]} appearance="light" size="md" className="w-fit">
                {t(`common.chartLabels.${lead.status}`, { defaultValue: lead.status })}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader><CardTitle>Cable Distance</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Current: <span className="font-medium text-foreground">{lead.cable_distance_meters} m</span> · excess:{" "}
              <span className="font-medium text-foreground">{lead.is_excess_cable_accepted ? "accepted" : "not accepted"}</span>
            </p>
            <Input type="number" placeholder="New distance (meters)" value={cable} onChange={(e) => setCable(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={() => updateCable.mutate(Number(cable))} disabled={!cable || updateCable.isPending} className="flex-1">
                {updateCable.isPending && <Loader2 className="size-4 animate-spin" />}
                Save
              </Button>
              <Button variant="outline" onClick={() => updateAcceptance.mutate(!lead.is_excess_cable_accepted)} disabled={updateAcceptance.isPending} className="flex-1">
                {updateAcceptance.isPending && <Loader2 className="size-4 animate-spin" />}
                Toggle Excess
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* <Card>
        <CardHeader><CardTitle>Add Activity</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Select value={activityType} onValueChange={(v) => setActivityType(v as LeadActivityType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((t) => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea placeholder="Notes" value={activityNotes} onChange={(e) => setActivityNotes(e.target.value)} />
          <Button
            variant="primary"
            onClick={() => addActivity.mutate({ type: activityType, notes: activityNotes }, { onSuccess: () => setActivityNotes("") })}
            disabled={!activityNotes || addActivity.isPending}
          >
            {addActivity.isPending && <Loader2 className="size-4 animate-spin" />}
            Add Activity
          </Button>
        </CardContent>
      </Card> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>{t("leads.activities", "Activities")}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {(lead.activities ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">{t("leads.noActivities", "No activities yet")}</p>
            )}
            {(lead.activities ?? []).map((a) => (
              <div key={a.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" size="sm" className="capitalize">{a.type}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm">{a.notes}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t("leads.statusTimeline", "Status Timeline")}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {(lead.status_timeline ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">{t("leads.noTransitions", "No transitions yet")}</p>
            )}
            {(lead.status_timeline ?? []).map((item) => (
              <div key={item.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={STATUS_VARIANT[item.status]} appearance="light" size="sm">{t(`common.chartLabels.${item.status}`, { defaultValue: item.status })}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</span>
                </div>
                {item.notes && <p className="text-sm text-muted-foreground">{item.notes}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <RerouteLeadSheet lead={lead} open={rerouteOpen} onClose={() => setRerouteOpen(false)} />
    </div>
  );
}
