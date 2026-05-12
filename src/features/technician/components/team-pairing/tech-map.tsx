"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { DispatchMapItem } from "../../types/technician-api";

import "leaflet/dist/leaflet.css";

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "#10b981"; // Emerald-500
    case "on_other_wo":
      return "#3b82f6"; // Blue-500
    case "cross_area":
      return "#f59e0b"; // Amber-500
    case "on_leave":
      return "#64748b"; // Slate-500
    default:
      return "#8b5cf6"; // Violet
  }
};

const createTechIcon = (status: string, name: string) => {
  const color = getStatusColor(status);
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "?";

  const svg = `
    <div class="relative group cursor-pointer">
      <div class="absolute -inset-1 bg-white rounded-full blur-sm opacity-30 group-hover:opacity-60 transition-opacity"></div>
      <div class="size-9 rounded-full flex items-center justify-center text-[10px] font-black border-2 text-white shadow-lg relative z-10 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110" 
           style="background: radial-gradient(circle at top left, ${color}, ${color}CC); border-color: white;">
        ${initials}
      </div>
      <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 z-0 shadow-sm border-r-2 border-b-2" 
           style="background-color: ${color}CC; border-color: white;"></div>
    </div>
  `;

  return L.divIcon({
    className: "",
    html: svg,
    iconSize: L.point(36, 40),
    iconAnchor: L.point(18, 40),
    popupAnchor: L.point(0, -40),
  });
};

function RecenterMap({ center, bounds }: { center: [number, number]; bounds?: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, 13);
    }
  }, [center, bounds, map]);
  return null;
}

// Fallback Dummy Data centered around a general Jakarta region for testing visuals
const DUMMY_TECH_DATA: DispatchMapItem[] = [
  { technician_id: "t1", technician_name: "Budi Santoso", latitude: -6.1944, longitude: 106.8229, status: "available" },
  { technician_id: "t2", technician_name: "Agus Darmawan", latitude: -6.2104, longitude: 106.8451, status: "on_other_wo" },
  { technician_id: "t3", technician_name: "Rini Cahyani", latitude: -6.1824, longitude: 106.8312, status: "cross_area" },
  { technician_id: "t4", technician_name: "Slamet Subagyo", latitude: -6.2224, longitude: 106.8101, status: "available" },
  { technician_id: "t5", technician_name: "Taufik Hidayat", latitude: -6.1754, longitude: 106.8271, status: "on_other_wo" },
];

export default function TechnicianDispatchMap({ items = [] }: { items?: DispatchMapItem[] }) {
  const techPoints = items.length > 0 ? items : DUMMY_TECH_DATA;

  const defaultCenter: [number, number] = [-6.2088, 106.8456];

  const validPoints = techPoints.filter(t => t.latitude && t.longitude);

  const center: [number, number] = validPoints.length > 0
    ? [validPoints[0].latitude, validPoints[0].longitude]
    : defaultCenter;

  let bounds: L.LatLngBounds | undefined = undefined;
  if (typeof window !== "undefined" && validPoints.length > 0) {
    bounds = L.latLngBounds(validPoints.map(p => [p.latitude, p.longitude]));
  }

  return (
    <Card className="overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-lg rounded-xl relative group z-0">
      {/* Legend Overlay */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg shadow-sm border border-slate-200/60 dark:border-slate-700/50 text-[10px] space-y-1.5 font-bold w-32">
        <div className="flex items-center justify-between text-slate-400 uppercase tracking-wider border-b pb-1 mb-1 dark:border-slate-700">
          <span>Status</span>
          <MapPin className="size-3" />
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
          Available
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <div className="size-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
          On Work Order
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <div className="size-2 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
          Cross Area
        </div>
      </div>

      {/* Label indicator */}
      <div className="absolute top-3 left-3 z-[1000] bg-primary/90 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
        <div className="size-1.5 bg-white rounded-full animate-pulse" />
        Live Deployment
      </div>

      <div className="h-[320px] sm:h-[380px] w-full z-0 bg-slate-50 dark:bg-slate-900 relative">
        <MapContainer
          center={center}
          zoom={13}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          {/* Using Modern Voyager TileLayer for clean premium dashboard look */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            className="dark:opacity-80 dark:invert-[0.92] dark:hue-rotate-[180deg]"
          />

          <RecenterMap center={center} bounds={bounds} />

          {validPoints.map((point, idx) => (
            <Marker
              key={`${point.technician_id || "t"}-${idx}`}
              position={[point.latitude, point.longitude]}
              icon={createTechIcon(point.status ?? "unknown", point.technician_name ?? "?")}
            >
              <Popup minWidth={200} className="tech-map-popup">
                <div className="p-2 font-sans">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="size-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                      style={{ background: getStatusColor(point.status ?? "unknown") }}
                    >
                      {(point.technician_name || "?").charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 leading-none mb-0.5">{point.technician_name ?? "Unnamed Tech"}</h5>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Technician</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 border-t pt-2 border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Availability</span>
                      <span
                        className="font-bold uppercase text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${getStatusColor(point.status ?? "unknown")}15`,
                          color: getStatusColor(point.status ?? "unknown")
                        }}
                      >
                        {(point.status ?? "unknown").replace(/_/g, " ")}
                      </span>
                    </div>

                    {point.active_work_order_id && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Active Job</span>
                        <span className="font-mono font-bold text-blue-600 truncate max-w-[80px]">
                          {point.active_work_order_id}
                        </span>
                      </div>
                    )}

                    <div className="text-[9px] text-slate-400 font-mono text-right mt-1">
                      {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}
