"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { RiArrowRightUpLine, RiShoppingBag3Line, RiCheckboxCircleLine } from "@remixicon/react";
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
import {
  useCreateLeadActivity,
  useLead,
  useUpdateLeadCableAcceptance,
  useUpdateLeadCableDistance,
  useUpdateLeadStatus,
} from "../api/leads-queries";
import type { LeadActivityType, LeadStatus } from "../types/leads-api";
import { RerouteLeadSheet } from "./reroute-lead-sheet";
import { ProductSelectorSheet } from "@/features/products/components/product-selector-sheet";
import type { BroadbandPlan, Addon } from "@/features/products/types/products";

const statuses: LeadStatus[] = [
  "new",
  "active",
  "warm",
  "hot",
  "converted",
  "lost",
  "potential",
];
const activityTypes: LeadActivityType[] = ["call", "visit", "note", "email"];

export function LeadDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: lead, isLoading } = useLead(id);

  const [rerouteOpen, setRerouteOpen] = useState(false);
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

  if (isLoading) return <div className="p-4 text-muted-foreground">Loading…</div>;
  if (!lead) return <div className="p-4 text-muted-foreground">Lead not found</div>;

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{lead.lead_name}</h1>
          <p className="text-muted-foreground text-sm">
            {lead.lead_type} · {lead.customer_sub_type} · source {lead.source}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" appearance="light" size="md">
            {lead.status}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setProductSelectorOpen(true)} className="gap-1">
            <RiShoppingBag3Line className="size-4" />
            Select Plan
          </Button>
          <Button variant="outline" size="sm" onClick={() => setRerouteOpen(true)} className="gap-1">
            <RiArrowRightUpLine className="size-4" />
            Reroute
          </Button>
        </div>
      </div>

      <RerouteLeadSheet lead={lead} open={rerouteOpen} onClose={() => setRerouteOpen(false)} />

      <ProductSelectorSheet
        open={productSelectorOpen}
        onOpenChange={setProductSelectorOpen}
        leadType={lead.lead_type}
        branchId={lead.branch_id}
        cableDistanceMeters={lead.cable_distance_meters}
        isExcessCableAccepted={lead.is_excess_cable_accepted}
        onConfirm={(plan, addons) => {
          setSelectedPlan(plan);
          setSelectedAddons(addons);
        }}
      />

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
            <Button variant="outline" size="sm" onClick={() => setProductSelectorOpen(true)}>
              Change
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Update status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Select value={statusDraft} onValueChange={(v) => setStatusDraft(v as LeadStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Notes"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />
            <Button
              onClick={() => updateStatus.mutate({ status: statusDraft, notes: statusNote })}
              disabled={updateStatus.isPending}
            >
              Save status
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cable distance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Current: {lead.cable_distance_meters} m · excess accepted:{" "}
              {lead.is_excess_cable_accepted ? "yes" : "no"}
            </p>
            <Input
              type="number"
              placeholder="meters"
              value={cable}
              onChange={(e) => setCable(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => updateCable.mutate(Number(cable))}
                disabled={!cable || updateCable.isPending}
              >
                Save distance
              </Button>
              <Button
                variant="secondary"
                onClick={() => updateAcceptance.mutate(!lead.is_excess_cable_accepted)}
                disabled={updateAcceptance.isPending}
              >
                Toggle excess acceptance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add activity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Select
            value={activityType}
            onValueChange={(v) => setActivityType(v as LeadActivityType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Notes"
            value={activityNotes}
            onChange={(e) => setActivityNotes(e.target.value)}
          />
          <Button
            onClick={() => {
              addActivity.mutate(
                { type: activityType, notes: activityNotes },
                { onSuccess: () => setActivityNotes("") }
              );
            }}
            disabled={!activityNotes || addActivity.isPending}
          >
            Add activity
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {(lead.activities ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No activities yet</p>
            )}
            {(lead.activities ?? []).map((a) => (
              <div key={a.id} className="border-b pb-2 last:border-0">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Badge variant="secondary" size="sm">
                    {a.type}
                  </Badge>
                  <span className="text-muted-foreground">{a.created_at}</span>
                </div>
                <p className="text-sm">{a.notes}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status timeline</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {(lead.status_timeline ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No transitions yet</p>
            )}
            {(lead.status_timeline ?? []).map((t) => (
              <div key={t.id} className="border-b pb-2 last:border-0">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Badge variant="primary" appearance="light" size="sm">
                    {t.status}
                  </Badge>
                  <span className="text-muted-foreground">{t.created_at}</span>
                </div>
                {t.notes && <p className="text-sm">{t.notes}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
