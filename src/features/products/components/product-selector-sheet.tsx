"use client";

import { useState } from "react";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiCheckLine,
  RiLoader4Line,
  RiSearchLine,
  RiShoppingBag3Line,
  RiWifiLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBroadbandPlans, useAddons } from "../api/products-queries";
import type { BroadbandPlan, Addon } from "../types/products";
import type { LeadType } from "@/features/leads/types/leads-api";

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface PlanCardProps {
  plan: BroadbandPlan;
  selected: boolean;
  onSelect: () => void;
}

function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-start rounded-xl border p-4 transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring ${
        selected
          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
          : "border-border bg-background hover:bg-muted/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              selected
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <RiWifiLine className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">{plan.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {plan.speed_download_mbps} Mbps / {plan.speed_upload_mbps} Mbps
            </p>
          </div>
        </div>
        {selected && (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <RiCheckLine className="h-3 w-3" />
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="text-muted-foreground">Monthly</p>
          <p className="font-semibold text-foreground mt-0.5">{formatIDR(plan.price)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="text-muted-foreground">OTC</p>
          <p className="font-semibold text-foreground mt-0.5">{formatIDR(plan.one_time_charge)}</p>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <RiArrowDownLine className="h-3 w-3 text-blue-500" />
          <span>{plan.speed_download_mbps} Mbps down</span>
        </div>
        <span className="text-muted-foreground/40">·</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <RiArrowUpLine className="h-3 w-3 text-emerald-500" />
          <span>{plan.speed_upload_mbps} Mbps up</span>
        </div>
      </div>
    </button>
  );
}

interface AddonRowProps {
  addon: Addon;
  selected: boolean;
  onToggle: () => void;
}

function AddonRow({ addon, selected, onToggle }: AddonRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full text-start flex items-center justify-between rounded-lg border px-4 py-3 transition-all hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-ring ${
        selected ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            selected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          }`}
        >
          <RiShoppingBag3Line className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{addon.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{addon.type}</p>
        </div>
      </div>
      <div className="shrink-0 text-right ml-4">
        <p className="text-sm font-semibold">{formatIDR(addon.price)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
        {addon.one_time_charge > 0 && (
          <p className="text-xs text-muted-foreground">+{formatIDR(addon.one_time_charge)} OTC</p>
        )}
      </div>
    </button>
  );
}

interface CostSummaryProps {
  plan: BroadbandPlan | null;
  selectedAddons: Addon[];
  cableDistanceMeters: number;
  isExcessCableAccepted: boolean;
}

function CostSummary({ plan, selectedAddons, cableDistanceMeters, isExcessCableAccepted }: CostSummaryProps) {
  if (!plan) return null;

  const addonMonthly = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const addonOtc = selectedAddons.reduce((sum, a) => sum + a.one_time_charge, 0);
  const totalMonthly = plan.price + addonMonthly;
  const totalOtc = plan.one_time_charge + addonOtc;
  const annual = totalMonthly * 12 + totalOtc;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
      <p className="text-sm font-semibold text-foreground">Cost Estimation</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Plan (monthly)</span>
          <span className="font-medium">{formatIDR(plan.price)}</span>
        </div>
        {addonMonthly > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Add-ons (monthly)</span>
            <span className="font-medium">{formatIDR(addonMonthly)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-primary/10 pt-2 font-semibold">
          <span>Total Monthly</span>
          <span className="text-primary">{formatIDR(totalMonthly)}</span>
        </div>
      </div>

      <div className="space-y-2 text-sm border-t border-primary/10 pt-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Plan OTC</span>
          <span className="font-medium">{formatIDR(plan.one_time_charge)}</span>
        </div>
        {addonOtc > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Add-on OTC</span>
            <span className="font-medium">{formatIDR(addonOtc)}</span>
          </div>
        )}
        {cableDistanceMeters > 0 && isExcessCableAccepted && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Cable charge ({cableDistanceMeters}m)
            </span>
            <span className="text-xs text-muted-foreground italic">TBD by survey</span>
          </div>
        )}
        <div className="flex justify-between font-semibold">
          <span>Total OTC</span>
          <span>{formatIDR(totalOtc)}</span>
        </div>
      </div>

      <div className="flex justify-between text-sm font-bold border-t border-primary/10 pt-3">
        <span>Est. 12-month Total</span>
        <span className="text-primary">{formatIDR(annual)}</span>
      </div>
    </div>
  );
}

interface ProductSelectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadType: LeadType;
  branchId: string;
  cableDistanceMeters?: number;
  isExcessCableAccepted?: boolean;
  onConfirm?: (plan: BroadbandPlan, addons: Addon[]) => void;
}

export function ProductSelectorSheet({
  open,
  onOpenChange,
  leadType,
  branchId,
  cableDistanceMeters = 0,
  isExcessCableAccepted = false,
  onConfirm,
}: ProductSelectorSheetProps) {
  const [search, setSearch] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(new Set());

  const { data: plansData, isLoading: plansLoading } = useBroadbandPlans(
    open && leadType === "broadband"
      ? { /* branch_id: branchId, */ per_page: 50 }
      : {}
  );
  const { data: addonsData, isLoading: addonsLoading } = useAddons(
    open ? { per_page: 50 } : {}
  );

  const plans = plansData?.broadband_plans ?? [];
  const addons = addonsData?.addons ?? [];

  const filteredPlans = search
    ? plans.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : plans;

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? null;
  const selectedAddons = addons.filter((a) => selectedAddonIds.has(a.id));

  function toggleAddon(id: string) {
    setSelectedAddonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    if (!selectedPlan) return;
    onConfirm?.(selectedPlan, selectedAddons);
    onOpenChange(false);
  }

  function handleOpenChange(val: boolean) {
    if (!val) {
      setSearch("");
      setSelectedPlanId(null);
      setSelectedAddonIds(new Set());
    }
    onOpenChange(val);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[600px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            Product & Package Selection
          </SheetTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Select a plan and optional add-ons for this lead.
          </p>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Plan selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {leadType === "broadband" ? "Broadband Plans" : "Enterprise Services"}
              </h3>
              {branchId && (
                <Badge variant="secondary" appearance="light" size="sm">
                  Branch-filtered
                </Badge>
              )}
            </div>

            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search plans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {plansLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <RiLoader4Line className="h-5 w-5 animate-spin mr-2" />
                <span className="text-sm">Loading plans...</span>
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No plans available for this branch.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    selected={selectedPlanId === plan.id}
                    onSelect={() => setSelectedPlanId(plan.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add-ons */}
          {addons.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Add-ons <span className="text-muted-foreground font-normal">(optional)</span></h3>
              {addonsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                  <RiLoader4Line className="h-4 w-4 animate-spin" /> Loading add-ons...
                </div>
              ) : (
                <div className="space-y-2">
                  {addons.map((addon) => (
                    <AddonRow
                      key={addon.id}
                      addon={addon}
                      selected={selectedAddonIds.has(addon.id)}
                      onToggle={() => toggleAddon(addon.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cost summary */}
          <CostSummary
            plan={selectedPlan}
            selectedAddons={selectedAddons}
            cableDistanceMeters={cableDistanceMeters}
            isExcessCableAccepted={isExcessCableAccepted}
          />
        </SheetBody>

        <SheetFooter className="border-border border-t p-5 pb-4 flex gap-2">
          <Button variant="ghost" onClick={() => handleOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedPlan}
            className="flex-1"
          >
            Confirm Selection
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
