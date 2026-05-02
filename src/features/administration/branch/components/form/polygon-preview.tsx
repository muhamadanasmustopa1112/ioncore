"use client";

import { useMemo, useState, useCallback } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Undo2, Trash2, CheckCheck, Map } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LngLat = [number, number]; // [lng, lat] GeoJSON order
type LatLng = [number, number]; // [lat, lng] Leaflet order

// ─── Parse GeoJSON — supports Polygon + MultiPolygon ─────────────────────────

function parseRings(value: string): { rings: LngLat[][]; error: string | null } {
  if (!value?.trim()) return { rings: [], error: null };
  try {
    const parsed = JSON.parse(value);
    if (parsed?.type === "Polygon" && Array.isArray(parsed.coordinates)) {
      // exterior ring only
      const ring = parsed.coordinates[0] as LngLat[];
      if (!ring || ring.length < 3) return { rings: [], error: "Polygon must have at least 3 points" };
      return { rings: [ring], error: null };
    }
    if (parsed?.type === "MultiPolygon" && Array.isArray(parsed.coordinates)) {
      const rings: LngLat[][] = parsed.coordinates.map((poly: LngLat[][]) => poly[0]);
      if (rings.some((r) => r.length < 3)) return { rings: [], error: "Each polygon ring must have at least 3 points" };
      return { rings, error: null };
    }
    // Raw array [[lng, lat], ...]
    if (Array.isArray(parsed) && parsed.length >= 3) {
      return { rings: [parsed as LngLat[]], error: null };
    }
    return { rings: [], error: "Unsupported format — use GeoJSON Polygon or MultiPolygon" };
  } catch {
    return { rings: [], error: "Invalid JSON" };
  }
}

function toLeaflet(ring: LngLat[]): LatLng[] {
  return ring.map(([lng, lat]) => [lat, lng]);
}

function toGeoJSON(points: LngLat[]): string {
  const ring = [...points, points[0]];
  return JSON.stringify({ type: "Polygon", coordinates: [ring] }, null, 2);
}

// ─── Dot marker ───────────────────────────────────────────────────────────────

const dotIcon = L.divIcon({
  className: "",
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#10b981;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

// ─── Map click handler ────────────────────────────────────────────────────────

function DrawHandler({ onAdd }: { onAdd: (pt: LngLat) => void }) {
  useMapEvents({ click(e) { onAdd([e.latlng.lng, e.latlng.lat]); } });
  return null;
}

// ─── Static preview map ───────────────────────────────────────────────────────

function StaticMap({ rings }: { rings: LngLat[][] }) {
  const allPositions = rings.flatMap(toLeaflet);
  const bounds = L.latLngBounds(allPositions);

  return (
    <MapContainer
      key={allPositions.map((p) => p.join()).join("|")}
      bounds={bounds}
      boundsOptions={{ padding: [24, 24] }}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {rings.map((ring, i) => (
        <Polygon
          key={i}
          positions={toLeaflet(ring)}
          pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.15, weight: 2 }}
        />
      ))}
    </MapContainer>
  );
}

// ─── Draw tool ────────────────────────────────────────────────────────────────

function DrawTool({ initial, onSave, onCancel }: { initial: LngLat[]; onSave: (geojson: string) => void; onCancel: () => void }) {
  const [points, setPoints] = useState<LngLat[]>(initial);
  const add = useCallback((pt: LngLat) => setPoints((p) => [...p, pt]), []);

  const positions = toLeaflet(points);
  const center: LatLng = initial.length > 0 ? toLeaflet(initial)[0] : [-6.2, 106.816];

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
        <Button size="sm" variant="primary" className="h-7 px-2 text-xs gap-1" onClick={() => onSave(toGeoJSON(points))} disabled={points.length < 3}>
          <CheckCheck className="size-3" /> Save
        </Button>
      </div>
      <div className="flex-1 rounded-md overflow-hidden border border-border" style={{ minHeight: 240 }}>
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%", cursor: "crosshair" }} scrollWheelZoom attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <DrawHandler onAdd={add} />
          {positions.length >= 3 && (
            <Polygon positions={positions} pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.12, weight: 2, dashArray: "4 4" }} />
          )}
          {positions.length >= 2 && positions.length < 3 && (
            <Polyline positions={positions} pathOptions={{ color: "#10b981", weight: 2, dashArray: "4 4" }} />
          )}
          {positions.map((pos, i) => <Marker key={i} position={pos} icon={dotIcon} />)}
        </MapContainer>
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

interface PolygonPreviewProps {
  value: string;
  onChange?: (geojson: string) => void;
  readOnly?: boolean;
}

export function PolygonPreview({ value, onChange, readOnly }: PolygonPreviewProps) {
  const [drawing, setDrawing] = useState(false);

  const { rings, error } = useMemo(() => parseRings(value), [value]);
  const hasValidPolygon = rings.length > 0;

  const handleDrawSave = useCallback((geojson: string) => {
    onChange?.(geojson);
    setDrawing(false);
  }, [onChange]);

  // ── Draw mode ──
  if (drawing && onChange) {
    const firstRing = rings[0] ?? [];
    // strip closing duplicate point before passing to draw tool
    const initial = firstRing.length > 0 && firstRing[0] === firstRing[firstRing.length - 1]
      ? firstRing.slice(0, -1)
      : firstRing;
    return (
      <div className="mt-2 space-y-2" style={{ minHeight: 320 }}>
        <DrawTool initial={initial} onSave={handleDrawSave} onCancel={() => setDrawing(false)} />
      </div>
    );
  }

  // ── Normal mode ──
  return (
    <div className="mt-1 space-y-2">
      {/* Textarea for manual input / paste */}
      {!readOnly && onChange && (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste GeoJSON here, e.g.:\n{\n  "type": "MultiPolygon",\n  "coordinates": [[[[106.82,-6.21],[106.84,-6.21],[106.84,-6.23],[106.82,-6.21]]]]\n}`}
          className="font-mono text-xs min-h-[100px] resize-y"
          spellCheck={false}
        />
      )}

      {/* Validation feedback */}
      {value?.trim() && error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* Map preview */}
      {hasValidPolygon && (
        <div className="rounded-md overflow-hidden border border-border" style={{ height: 220 }}>
          <StaticMap rings={rings} />
        </div>
      )}

      {/* Draw button */}
      {!readOnly && onChange && (
        <Button size="sm" variant="outline" className="h-7 px-3 text-xs gap-1.5" onClick={() => setDrawing(true)}>
          <Map className="size-3.5" />
          {hasValidPolygon ? "Edit on Map" : "Draw on Map"}
        </Button>
      )}

      {/* Read-only empty state */}
      {readOnly && !hasValidPolygon && (
        <div className="rounded-md border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground" style={{ height: 60 }}>
          No polygon defined
        </div>
      )}

      {readOnly && value?.trim() && (
        <Textarea value={value} readOnly className="font-mono text-xs min-h-[80px] resize-none opacity-60" />
      )}
    </div>
  );
}
