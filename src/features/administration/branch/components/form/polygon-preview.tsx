"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Polyline, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Undo2, Trash2, CheckCheck, MapPin, Pencil, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── Types ────────────────────────────────────────────────────────────────────

type LngLat = [number, number]; // [lng, lat] GeoJSON order
type LatLng = [number, number]; // [lat, lng] Leaflet order

// ─── Parse GeoJSON Polygon/MultiPolygon ──────────────────────────────────────

function extractRings(value: string | undefined): LngLat[][] {
  if (!value?.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (parsed?.type === "Polygon" && Array.isArray(parsed.coordinates)) {
      const ring = parsed.coordinates[0] as LngLat[];
      if (!ring || ring.length < 3) return [];
      return [ring];
    }
    if (parsed?.type === "MultiPolygon" && Array.isArray(parsed.coordinates)) {
      const rings: LngLat[][] = parsed.coordinates.map((poly: LngLat[][]) => poly[0]);
      if (rings.some((r) => r.length < 3)) return [];
      return rings;
    }
    return [];
  } catch {
    return [];
  }
}

function parsePolygonError(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const parsed = JSON.parse(value);
    if (parsed?.type === "Polygon" || parsed?.type === "MultiPolygon") return null;
    return "Unsupported format — use GeoJSON Polygon or MultiPolygon";
  } catch {
    return "Invalid JSON";
  }
}

function toLeaflet(ring: LngLat[]): LatLng[] {
  return ring.map(([lng, lat]) => [lat, lng]);
}

function polygonToGeoJSON(points: LngLat[]): string {
  const ring = [...points, points[0]];
  return JSON.stringify({ type: "Polygon", coordinates: [ring] }, null, 2);
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const dotIcon = L.divIcon({
  className: "",
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#10b981;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#ef4444;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.5)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// ─── Map helpers ──────────────────────────────────────────────────────────────

function DrawHandler({ onAdd }: { onAdd: (pt: LngLat) => void }) {
  useMapEvents({ click(e) { onAdd([e.latlng.lng, e.latlng.lat]); } });
  return null;
}

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onClick(e.latlng.lat, e.latlng.lng); } });
  return null;
}

interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
}

function MapSearch() {
  const map = useMap();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const search = useCallback(async () => {
    if (!q.trim()) return;
    setLoading(true);
    setOpen(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=0`,
        { headers: { "Accept-Language": "en" } },
      );
      const data: GeocodeResult[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [q]);

  const pick = (r: GeocodeResult) => {
    map.flyTo([parseFloat(r.lat), parseFloat(r.lon)], 16, { duration: 0.6 });
    setOpen(false);
    setQ(r.display_name);
  };

  return (
    <div className="absolute top-2 left-2 right-2 z-[400]">
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); search(); } }}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search place or address..."
            className="h-8 pl-8 text-xs bg-background shadow-md"
          />
        </div>
        <Button size="sm" variant="primary" className="h-8 px-2.5 text-xs gap-1" onClick={search} disabled={loading || !q.trim()}>
          {loading ? <Loader2 className="size-3 animate-spin" /> : <Search className="size-3" />}
        </Button>
      </div>
      {open && results.length > 0 && (
        <div className="mt-1 rounded-md border border-border bg-background shadow-lg max-h-48 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => pick(r)}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent border-b border-border last:border-0 truncate"
            >
              {r.display_name}
            </button>
          ))}
        </div>
      )}
      {open && !loading && results.length === 0 && q.trim() && (
        <div className="mt-1 rounded-md border border-border bg-background shadow-lg px-3 py-2 text-xs text-muted-foreground">
          No results.
        </div>
      )}
    </div>
  );
}

function MapResizeController() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// ─── Static preview map ───────────────────────────────────────────────────────

function StaticMap({ rings, pinLat, pinLng }: { rings: LngLat[][]; pinLat?: number; pinLng?: number }) {
  const ringPositions = rings.flatMap(toLeaflet);
  const pinPos: LatLng | null = pinLat != null && pinLng != null ? [pinLat, pinLng] : null;
  const allPositions = pinPos ? [...ringPositions, pinPos] : ringPositions;
  const bounds = allPositions.length > 1 ? L.latLngBounds(allPositions) : undefined;
  const center: LatLng | undefined = !bounds && pinPos ? pinPos : undefined;

  return (
    <div className="rounded-md overflow-hidden border border-border" style={{ height: 240 }}>
      <MapContainer
        key={allPositions.map((p) => p.join()).join("|") || "empty"}
        bounds={bounds}
        center={center ?? [-6.2088, 106.8456]}
        zoom={center ? 15 : 12}
        boundsOptions={{ padding: [24, 24] }}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapResizeController />
        {rings.map((ring, i) => (
          <Polygon
            key={i}
            positions={toLeaflet(ring)}
            pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.15, weight: 2 }}
          />
        ))}
        {pinPos && <Marker position={pinPos} icon={pinIcon} />}
      </MapContainer>
    </div>
  );
}

// ─── Drop Pin picker ──────────────────────────────────────────────────────────

function PointPicker({
  initialLat,
  initialLng,
  existingRings,
  onSave,
  onCancel,
}: {
  initialLat?: number;
  initialLng?: number;
  existingRings: LngLat[][];
  onSave: (lat: number, lng: number) => void;
  onCancel: () => void;
}) {
  const [lat, setLat] = useState<number | null>(initialLat ?? null);
  const [lng, setLng] = useState<number | null>(initialLng ?? null);

  const handleClick = useCallback((clickLat: number, clickLng: number) => {
    setLat(clickLat);
    setLng(clickLng);
  }, []);

  const pinPos: LatLng | null = lat != null && lng != null ? [lat, lng] : null;
  const center: LatLng = pinPos ?? [-6.2088, 106.8456];

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-muted-foreground flex-1">
          {pinPos ? `Pin: ${lat!.toFixed(5)}, ${lng!.toFixed(5)}` : "Click map to drop a pin"}
        </span>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => { setLat(null); setLng(null); }} disabled={!pinPos}>
          <Trash2 className="size-3" /> Clear
        </Button>
        <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={onCancel}>Cancel</Button>
        <Button size="sm" variant="primary" className="h-7 px-2 text-xs gap-1" onClick={() => lat != null && lng != null && onSave(lat, lng)} disabled={!pinPos}>
          <CheckCheck className="size-3" /> Save
        </Button>
      </div>
      <div className="rounded-md overflow-hidden border border-border h-[320px]">
        <MapContainer center={center} zoom={13} className="h-full w-full cursor-crosshair" scrollWheelZoom attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapResizeController />
          <MapSearch />
          <ClickHandler onClick={handleClick} />
          {existingRings.map((ring, i) => (
            <Polygon key={i} positions={toLeaflet(ring)} pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.12, weight: 2, dashArray: "4 4" }} />
          ))}
          {pinPos && <Marker position={pinPos} icon={pinIcon} />}
        </MapContainer>
      </div>
    </div>
  );
}

// ─── Draw Polygon picker ──────────────────────────────────────────────────────

function PolygonPicker({
  initial,
  existingPinLat,
  existingPinLng,
  onSave,
  onCancel,
}: {
  initial: LngLat[];
  existingPinLat?: number;
  existingPinLng?: number;
  onSave: (geojson: string) => void;
  onCancel: () => void;
}) {
  const [points, setPoints] = useState<LngLat[]>(initial);
  const add = useCallback((pt: LngLat) => setPoints((p) => [...p, pt]), []);

  const positions = toLeaflet(points);
  const center: LatLng = initial.length > 0 ? toLeaflet(initial)[0] : [-6.2, 106.816];
  const pinPos: LatLng | null = existingPinLat != null && existingPinLng != null ? [existingPinLat, existingPinLng] : null;

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-muted-foreground flex-1">
          {points.length < 3 ? `Click map to place points (${points.length}/3 min)` : `${points.length} points — ready`}
        </span>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" onClick={() => setPoints((p) => p.slice(0, -1))} disabled={!points.length}>
          <Undo2 className="size-3" /> Undo
        </Button>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => setPoints([])} disabled={!points.length}>
          <Trash2 className="size-3" /> Clear
        </Button>
        <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={onCancel}>Cancel</Button>
        <Button size="sm" variant="primary" className="h-7 px-2 text-xs gap-1" onClick={() => onSave(polygonToGeoJSON(points))} disabled={points.length < 3}>
          <CheckCheck className="size-3" /> Save
        </Button>
      </div>
      <div className="rounded-md overflow-hidden border border-border h-[240px] md:h-[300px]">
        <MapContainer center={center} zoom={13} className="h-full w-full cursor-crosshair" scrollWheelZoom attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapResizeController />
          <MapSearch />
          <DrawHandler onAdd={add} />
          {positions.length >= 3 && (
            <Polygon positions={positions} pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.12, weight: 2, dashArray: "4 4" }} />
          )}
          {positions.length >= 2 && positions.length < 3 && (
            <Polyline positions={positions} pathOptions={{ color: "#10b981", weight: 2, dashArray: "4 4" }} />
          )}
          {positions.map((pos, i) => <Marker key={i} position={pos} icon={dotIcon} />)}
          {pinPos && <Marker position={pinPos} icon={pinIcon} />}
        </MapContainer>
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

interface PolygonPreviewProps {
  pinLat?: number;
  pinLng?: number;
  onPinChange?: (lat: number, lng: number) => void;
  polygonValue?: string;
  onPolygonChange?: (geojson: string) => void;
  readOnly?: boolean;
}

type PickMode = "point" | "polygon" | null;

export function PolygonPreview({
  pinLat,
  pinLng,
  onPinChange,
  polygonValue,
  onPolygonChange,
  readOnly,
}: PolygonPreviewProps) {
  const [pickMode, setPickMode] = useState<PickMode>(null);

  const rings = useMemo(() => extractRings(polygonValue), [polygonValue]);
  const polygonError = useMemo(() => parsePolygonError(polygonValue), [polygonValue]);
  const hasPin = pinLat != null && pinLng != null;
  const hasPolygon = rings.length > 0;
  const hasGeo = hasPin || hasPolygon;

  // ── Pick mode ──
  if (pickMode === "point" && onPinChange) {
    return (
      <div className="mt-2 space-y-2" style={{ minHeight: 320 }}>
        <PointPicker
          initialLat={pinLat}
          initialLng={pinLng}
          existingRings={rings}
          onSave={(lat, lng) => { onPinChange(lat, lng); setPickMode(null); }}
          onCancel={() => setPickMode(null)}
        />
      </div>
    );
  }
  if (pickMode === "polygon" && onPolygonChange) {
    const firstRing = rings[0] ?? [];
    const initial = firstRing.length > 0 && firstRing[0] === firstRing[firstRing.length - 1]
      ? firstRing.slice(0, -1)
      : firstRing;
    return (
      <div className="mt-2 space-y-2" style={{ minHeight: 320 }}>
        <PolygonPicker
          initial={initial}
          existingPinLat={pinLat}
          existingPinLng={pinLng}
          onSave={(geojson) => { onPolygonChange(geojson); setPickMode(null); }}
          onCancel={() => setPickMode(null)}
        />
      </div>
    );
  }

  // ── Normal mode ──
  return (
    <div className="mt-1 space-y-2">
      {polygonValue?.trim() && polygonError && (
        <p className="text-xs text-destructive">{polygonError}</p>
      )}

      {hasGeo && (
        <StaticMap rings={rings} pinLat={pinLat} pinLng={pinLng} />
      )}

      {!readOnly && (onPinChange || onPolygonChange) && (
        <div className="flex flex-wrap gap-2">
          {onPinChange && (
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs gap-1.5" onClick={() => setPickMode("point")}>
              <MapPin className="size-3.5" />
              {hasPin ? "Edit Pin" : "Drop Pin"}
            </Button>
          )}
          {onPolygonChange && (
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs gap-1.5" onClick={() => setPickMode("polygon")}>
              <Pencil className="size-3.5" />
              {hasPolygon ? "Edit Polygon" : "Draw Polygon"}
            </Button>
          )}
        </div>
      )}

      {readOnly && !hasGeo && (
        <div className="rounded-md border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground" style={{ height: 60 }}>
          No location defined
        </div>
      )}

      {readOnly && polygonValue?.trim() && (
        <Textarea value={polygonValue} readOnly className="font-mono text-xs min-h-[80px] resize-none opacity-60" />
      )}
    </div>
  );
}
