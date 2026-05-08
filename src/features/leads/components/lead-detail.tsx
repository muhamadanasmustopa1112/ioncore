"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { RiArrowRightUpLine, RiShoppingBag3Line, RiCheckboxCircleLine, RiUserAddLine, RiMapPinLine, RiRouteLine } from "@remixicon/react";
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
import {
  useCreateLeadActivity,
  useLead,
  useUpdateLeadCableAcceptance,
  useUpdateLeadCableDistance,
  useUpdateLeadStatus,
} from "../api/leads-queries";
import type { LeadActivityType, LeadStatus } from "../types/leads-api";
import { RerouteLeadSheet } from "./reroute-lead-sheet";
import { ConvertLeadSheet } from "./convert-lead-sheet";
import { ProductSelectorSheet } from "@/features/products/components/product-selector-sheet";
import type { BroadbandPlan, Addon } from "@/features/products/types/products";

const STATUS_VARIANT: Record<LeadStatus, "primary" | "success" | "warning" | "destructive" | "secondary"> = {
  new: "secondary",
  active: "primary",
  warm: "warning",
  hot: "destructive",
  converted: "success",
  lost: "secondary",
  potential: "warning",
};

const STATUSES: LeadStatus[] = ["new", "active", "warm", "hot", "converted", "lost", "potential"];
const ACTIVITY_TYPES: LeadActivityType[] = ["call", "visit", "note", "email"];

export function LeadDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: lead, isLoading } = useLead(id);

  const [rerouteOpen, setRerouteOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [productSelectorOpen, setProductSelectorOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BroadbandPlan | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [statusDraft, setStatusDraft] = useState<LeadStatus>("new");
  const [statusNote, setStatusNote] = useState("");
  const [cable, setCable] = useState("");
  const [activityType, setActivityType] = useState<LeadActivityType>("note");
  const [activityNotes, setActivityNotes] = useState("");

  const updateStatus = useUpdateLeadStatus(id);
  const updateCable = useUpdateLeadCableDistance(id);
  const updateAcceptance = useUpdateLeadCableAcceptance(id);
  const addActivity = useCreateLeadActivity(id);

  useEffect(() => {
    if (lead?.status) setStatusDraft(lead.status);
  }, [lead?.status]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2" /> Loading lead…
      </div>
    );
  }
  if (!lead) {
    return <div className="p-8 text-center text-muted-foreground text-sm">Lead not found</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <PageBreadcrumb
        items={[
          { title: "CRM & Sales", path: paths.dashboard.crmAndSales.root.getHref() },
          { title: "Leads", path: paths.dashboard.crmAndSales.leads.root.getHref() },
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
              {lead.status}
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">
              {lead.lead_type} · {lead.customer_sub_type} · {lead.source.replace("_", " ")}
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" size="sm" onClick={() => setProductSelectorOpen(true)} className="gap-1.5">
            <RiShoppingBag3Line className="size-4" />
            Select Plan
          </Button>
          <Button variant="outline" size="sm" onClick={() => setRerouteOpen(true)} className="gap-1.5">
            <RiArrowRightUpLine className="size-4" />
            Reroute
          </Button>
          {lead.status !== "converted" && (
            <Button variant="primary" size="sm" onClick={() => setConvertOpen(true)} className="gap-1.5">
              <RiUserAddLine className="size-4" />
              Convert
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Cable Distance", value: `${lead.cable_distance_meters} m`, icon: <RiRouteLine className="size-4 text-muted-foreground" /> },
          { label: "Excess Cable", value: lead.is_excess_cable_accepted ? "Accepted" : "Not accepted" },
          { label: "Coords", value: lead.installation_point_lat ? `${lead.installation_point_lat?.toFixed(4)}, ${lead.installation_point_lng?.toFixed(4)}` : "—", icon: <RiMapPinLine className="size-4 text-muted-foreground" /> },
          { label: "Referrer", value: lead.referrer_customer_id ? lead.referrer_customer_id.slice(0, 10) + "…" : "—" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mb-1">
              {icon}{label}
            </p>
            <p className="text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <RiCheckboxCircleLine className="size-4 text-primary" />
              Selected Package
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{selectedPlan.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedPlan.speed_download_mbps}/{selectedPlan.speed_upload_mbps} Mbps ·{" "}
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(selectedPlan.price)}/mo
                {selectedAddons.length > 0 && ` · ${selectedAddons.length} add-on${selectedAddons.length > 1 ? "s" : ""}`}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setProductSelectorOpen(true)}>Change</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Select value={statusDraft} onValueChange={(v) => setStatusDraft(v as LeadStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    <div className="flex items-center gap-2">
                      <Badge variant={STATUS_VARIANT[s]} appearance="light" size="sm">{s}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea placeholder="Notes (optional)" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} />
            <Button
              variant="primary"
              onClick={() => updateStatus.mutate({ status: statusDraft, notes: statusNote })}
              disabled={updateStatus.isPending}
            >
              {updateStatus.isPending && <Loader2 className="size-4 animate-spin" />}
              Save Status
            </Button>
          </CardContent>
        </Card>

        <Card>
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
        </Card>
      </div>

      <Card>
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
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Activities</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {(lead.activities ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No activities yet</p>
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
          <CardHeader><CardTitle>Status Timeline</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {(lead.status_timeline ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No transitions yet</p>
            )}
            {(lead.status_timeline ?? []).map((t) => (
              <div key={t.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={STATUS_VARIANT[t.status]} appearance="light" size="sm">{t.status}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</span>
                </div>
                {t.notes && <p className="text-sm text-muted-foreground">{t.notes}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <RerouteLeadSheet lead={lead} open={rerouteOpen} onClose={() => setRerouteOpen(false)} />
      <ConvertLeadSheet lead={lead} selectedPlan={selectedPlan} selectedAddons={selectedAddons} open={convertOpen} onClose={() => setConvertOpen(false)} />
      <ProductSelectorSheet
        open={productSelectorOpen}
        onOpenChange={setProductSelectorOpen}
        leadType={lead.lead_type}
        branchId={lead.branch_id}
        cableDistanceMeters={lead.cable_distance_meters}
        isExcessCableAccepted={lead.is_excess_cable_accepted}
        onConfirm={(plan, addons) => { setSelectedPlan(plan); setSelectedAddons(addons); }}
      />
    </div>
  );
}
