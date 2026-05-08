"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";

export const INSTALL_DEFAULT: [number, number] = [-6.2, 106.816];

function fixLeafletIcon() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface InstallationSectionProps {
  lat: number;
  lng: number;
  onLatLngChange: (lat: number, lng: number) => void;
  onAddressChange: (address: string) => void;
  onCoverageChange?: (covered: boolean | null) => void;
}

export function InstallationSection({ lat, lng, onLatLngChange, onAddressChange, onCoverageChange }: InstallationSectionProps) {
  const [mapKey] = useState(0);
  const [flyTrigger, setFlyTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [coverage, setCoverage] = useState<Coverage>("idle");
  const [coverageMsg, setCoverageMsg] = useState("");
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { fixLeafletIcon(); }, []);

  function handleMapMove(newLat: number, newLng: number) {
    onLatLngChange(newLat, newLng);
    setCoverage("idle");
    onCoverageChange?.(null);
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
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    onLatLngChange(newLat, newLng);
    onAddressChange(result.display_name);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setCoverage("idle");
    onCoverageChange?.(null);
    setFlyTrigger((t) => t + 1);
  }

  async function handleCheckCoverage() {
    setCoverage("checking");
    setCoverageMsg("");
    try {
      const res = await userServiceApi.get(
        `${services.sales}/coverage-check`,
        { params: { lat, lon: lng } },
      ) as unknown as Record<string, unknown>;
      const d = (res as any)?.data ?? res;
      const covered: boolean = (d as any)?.is_covered ?? false;
      setCoverage(covered ? "available" : "unavailable");
      setCoverageMsg((d as any)?.reason ?? "");
      onCoverageChange?.(covered);
    } catch {
      setCoverage("unavailable");
      setCoverageMsg("Coverage check failed — try again");
      onCoverageChange?.(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Installation Point
        </p>

        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search address…"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
            )}
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

        <div className="rounded-xl overflow-hidden border border-border h-56 relative z-0">
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

        <p className="text-xs text-muted-foreground text-center">
          Click the map or drag the pin to set the installation point
        </p>

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

        <div className="space-y-2">
          <Button
            variant={coverage === "available" ? "outline" : "primary"}
            className="w-full font-semibold"
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
      </CardContent>
    </Card>
  );
}
