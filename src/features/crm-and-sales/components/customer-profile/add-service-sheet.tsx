"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { useCreateOrder } from "@/features/operations/orders/api/orders-queries";
import { ProductSelectorSheet } from "@/features/products/components/product-selector-sheet";
import type { BroadbandPlan, Addon } from "@/features/products/types/products";

const DEFAULT_CENTER: [number, number] = [-6.2, 106.816];

function fixLeafletIcon() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

function MapClickHandler({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onMove(e.latlng.lat, e.latlng.lng); } });
  return null;
}

function FlyTo({ lat, lng, trigger }: { lat: number; lng: number; trigger: number }) {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0) map.flyTo([lat, lng], 16, { animate: true, duration: 1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
  return null;
}

type Coverage = "idle" | "checking" | "available" | "unavailable";

interface NominatimResult { lat: string; lon: string; display_name: string; }

interface CoverageArea {
  cable_distance_meter?: number;
  excess_cable_meters?: number;
  excess_cable_cost?: number;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customerId: string;
  customerLat?: number | null;
  customerLon?: number | null;
  customerAddress?: string | null;
  leadId?: string | null;
  branchId?: string | null;
}

export function AddServiceSheet({ open, onOpenChange, customerId, customerLat, customerLon, customerAddress, leadId, branchId }: Props) {
  const createOrder = useCreateOrder();

  const hasExistingLocation = !!(customerLat && customerLon);

  const [lat, setLat] = useState(customerLat ?? DEFAULT_CENTER[0]);
  const [lng, setLng] = useState(customerLon ?? DEFAULT_CENTER[1]);
  const [mapKey, setMapKey] = useState(0);
  const [flyTrigger, setFlyTrigger] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);

  const [coverage, setCoverage] = useState<Coverage>(hasExistingLocation ? "available" : "idle");
  const [coverageMsg, setCoverageMsg] = useState("");
  const [coverageArea, setCoverageArea] = useState<CoverageArea | null>(null);

  const [planSelectorOpen, setPlanSelectorOpen] = useState(false);
  const [acceptsExcess, setAcceptsExcess] = useState(false);

  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setLat(customerLat ?? DEFAULT_CENTER[0]);
      setLng(customerLon ?? DEFAULT_CENTER[1]);
      setCoverage(hasExistingLocation ? "available" : "idle");
      setCoverageMsg("");
      setCoverageArea(null);
      setSearchQuery("");
      setSearchResults([]);
      setMapKey((k) => k + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, customerLat, customerLon]);

  useEffect(() => { fixLeafletIcon(); }, []);

  function handleMapMove(newLat: number, newLng: number) {
    setLat(newLat);
    setLng(newLng);
    setCoverage("idle");
    setSearchResults([]);
  }

  function handleSearchInput(value: string) {
    setSearchQuery(value);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    if (!value.trim()) { setSearchResults([]); return; }
    searchDebounce.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&countrycodes=id`,
          { headers: { "Accept-Language": "id" } },
        );
        setSearchResults(await res.json());
      } catch { setSearchResults([]); }
      finally { setSearching(false); }
    }, 500);
  }

  function selectResult(result: NominatimResult) {
    setLat(parseFloat(result.lat));
    setLng(parseFloat(result.lon));
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setCoverage("idle");
    setFlyTrigger((t) => t + 1);
  }

  async function handleCheckCoverage() {
    setCoverage("checking");
    setCoverageMsg("");
    setCoverageArea(null);
    setAcceptsExcess(false);
    try {
      const res = await userServiceApi.get(
        `${services.sales}/coverage-check`,
        { params: { lat, lon: lng } },
      ) as unknown as Record<string, any>;
      const d = res?.data ?? res;
      const covered: boolean = d?.is_covered ?? false;
      setCoverage(covered ? "available" : "unavailable");
      setCoverageMsg(d?.reason ?? "");
      if (covered) setCoverageArea(d?.coverage_area ?? null);
    } catch {
      setCoverage("unavailable");
      setCoverageMsg("Coverage check failed — try again");
    }
  }

  async function handlePlanConfirm(plan: BroadbandPlan, addons: Addon[]) {
    const excessCable = coverageArea
      ? Math.max(0, (coverageArea.cable_distance_meter ?? 0) - (coverageArea.excess_cable_meters ?? 0)) * (coverageArea.excess_cable_cost ?? 0)
      : 0;

    await createOrder.mutateAsync({
      customer_id: customerId,
      order_type: "NEW_CONNECTION",
      plan_id: plan.id,
      latitude: lat,
      longitude: lng,
      channel: "DIRECT",
      ...(leadId ? { lead_id: leadId } : {}),
      ...(addons.length > 0 && { addon_orders: addons.map((a) => ({ addon_id: a.id })) }),
      ...(excessCable > 0 && { excess_cable_meters: excessCable }),
    });
    onOpenChange(false);
  }

  if (hasExistingLocation) {
    return (
      <ProductSelectorSheet
        open={open}
        onOpenChange={onOpenChange}
        leadType="broadband"
        branchId={branchId ?? ""}
        onConfirm={handlePlanConfirm}
      />
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[560px] overflow-y-auto flex flex-col gap-4">
          <SheetHeader>
            <SheetTitle>Add Service — Set Installation Point</SheetTitle>
          </SheetHeader>

          {/* Address search */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search address…"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
              />
              {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />}
            </div>
            {searchResults.length > 0 && (
              <div className="absolute z-[9999] left-0 right-0 top-full mt-1 rounded-lg border bg-popover shadow-lg overflow-hidden">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent transition-colors border-b last:border-0"
                    onClick={() => selectResult(r)}
                  >
                    {r.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-border h-64 relative z-0">
            <MapContainer key={mapKey} center={[lat, lng]} zoom={15} className="h-full w-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              <MapClickHandler onMove={handleMapMove} />
              <FlyTo lat={lat} lng={lng} trigger={flyTrigger} />
              <Marker
                position={[lat, lng]}
                draggable
                eventHandlers={{
                  dragend: (e) => {
                    const p = (e.target as L.Marker).getLatLng();
                    handleMapMove(p.lat, p.lng);
                  },
                }}
              />
            </MapContainer>
          </div>

          <p className="text-xs text-muted-foreground text-center -mt-1">
            Click the map or drag the pin to adjust the installation point
          </p>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/30 px-3 py-2">
              <p className="text-xs text-muted-foreground mb-0.5">Latitude</p>
              <p className="text-sm font-mono font-semibold">{lat.toFixed(6)}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 px-3 py-2">
              <p className="text-xs text-muted-foreground mb-0.5">Longitude</p>
              <p className="text-sm font-mono font-semibold">{lng.toFixed(6)}</p>
            </div>
          </div>

          {/* Coverage */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCheckCoverage}
              disabled={coverage === "checking"}
            >
              {coverage === "checking" && <Loader2 className="size-4 animate-spin" />}
              {coverage === "idle" ? "Check Coverage" : coverage === "checking" ? "Checking…" : "Re-check Coverage"}
            </Button>

            {coverage === "available" && (
              <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                <CheckCircle2 className="size-4 shrink-0" />
                {coverageMsg || "Coverage available at this location"}
              </div>
            )}
            {coverage === "unavailable" && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {coverageMsg || "No coverage at this location"}
              </div>
            )}
          </div>

          {(() => {
            if (coverage !== "available") return null;
            const excessMeters = Math.max(0, (coverageArea?.cable_distance_meter ?? 0) - (coverageArea?.excess_cable_meters ?? 0));
            const excessCost = excessMeters * (coverageArea?.excess_cable_cost ?? 0);
            const hasExcess = excessCost > 0;
            const canProceed = !hasExcess || acceptsExcess;
            return (
              <div className="space-y-3">
                {hasExcess && (
                  <div className="rounded-lg border border-warning/30 bg-warning/10 p-4 space-y-3">
                    <div className="text-sm font-semibold text-warning">Excess Cable Required</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Cable distance</p>
                        <p className="font-semibold">{coverageArea?.cable_distance_meter ?? 0} m</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Excess meters</p>
                        <p className="font-semibold">{excessMeters} m</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Additional charge</p>
                        <p className="font-semibold text-warning">
                          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(excessCost)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-1 border-t border-warning/20">
                      <label className="text-sm font-medium cursor-pointer" htmlFor="excess-accept">
                        Customer accepts excess cable charge
                      </label>
                      <Switch id="excess-accept" checked={acceptsExcess} onCheckedChange={setAcceptsExcess} />
                    </div>
                    {!acceptsExcess && (
                      <p className="text-xs text-muted-foreground">
                        Customer must accept the excess cable charge to proceed with the order.
                      </p>
                    )}
                  </div>
                )}
                <Button variant="primary" className="w-full" disabled={!canProceed} onClick={() => setPlanSelectorOpen(true)}>
                  Select Plan &amp; Create Order
                </Button>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>

      <ProductSelectorSheet
        open={planSelectorOpen}
        onOpenChange={setPlanSelectorOpen}
        leadType="broadband"
        branchId={branchId ?? ""}
        cableDistanceMeters={coverageArea?.cable_distance_meter}
        onConfirm={handlePlanConfirm}
      />
    </>
  );
}
