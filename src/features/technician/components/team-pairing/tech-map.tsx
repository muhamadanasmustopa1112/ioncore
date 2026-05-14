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
    // Status Work Order Aktif
    case "in_progress":
      return "#10b981"; // Emerald-500 (Sukses / Berjalan)
    case "dispatched":
    case "accepted":
      return "#3b82f6"; // Blue-500 (Dalam Perjalanan / Penugasan)
    case "created":
    case "unassigned":
      return "#f59e0b"; // Amber-500 (Menunggu)
    case "completed":
      return "#64748b"; // Slate-500 (Selesai)

    // Fallback lama
    case "available":
      return "#10b981";
    case "on_other_wo":
      return "#3b82f6";
    case "cross_area":
      return "#f59e0b";
    default:
      return "#8b5cf6"; // Violet-500
  }
};

const getLeadWeight = (t: any) => {
  const lvl = (t?.level || "").toLowerCase().trim();
  if (lvl === "lead") return 2;
  if (lvl === "senior") return 1;
  return 0;
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

// Fallback Dummy Data disesuaikan dengan response real API backend
const DUMMY_TECH_DATA: DispatchMapItem[] = [
  {
    work_order_id: "wo-1",
    work_order_number: "WO-20260422-001",
    title: "New FTTH Installation",
    type: "new_installation_broadband",
    state: "in_progress",
    priority: "high",
    customer_name: "Bapak Andi",
    site_name: "Andi Residence",
    latitude: -6.1987,
    longitude: 106.7694,
    live_location: { latitude: -6.1944, longitude: 106.8229, recorded_at: "2026-05-13T03:00:00Z" },
    branch_id: "b1",
    area_id: "a1",
    assigned_team: [
      {
        technician_id: "t1",
        technician_name: "Budi Santoso",
        role: "lead",
        level: "senior",
        accepted: true,
        accepted_at: null,
        active_workload: 1,
        area_id: "a1",
        branch_id: "b1",
        sub_area_id: "sa1",
        cross_area: false,
        employee_id: "EMP-001",
        skills: []
      }
    ]
  },
  {
    work_order_id: "wo-2",
    work_order_number: "WO-20260422-003",
    title: "Router Troubleshooting",
    type: "maintenance",
    state: "dispatched",
    priority: "high",
    customer_name: "CV Sinar Data",
    site_name: "Warehouse Bekasi",
    latitude: -6.2104,
    longitude: 106.8451,
    live_location: { latitude: -6.2104, longitude: 106.8451, recorded_at: "2026-05-13T03:00:00Z" },
    branch_id: "b1",
    area_id: "a1",
    assigned_team: [
      {
        technician_id: "t2",
        technician_name: "Agus Darmawan",
        role: "lead",
        level: "senior",
        accepted: true,
        accepted_at: null,
        active_workload: 1,
        area_id: "a1",
        branch_id: "b1",
        sub_area_id: "sa1",
        cross_area: false,
        employee_id: "EMP-002",
        skills: []
      }
    ]
  }
];

export default function TechnicianDispatchMap({ items = [] }: { items?: DispatchMapItem[] }) {
  const techPoints = items.length > 0 ? items : DUMMY_TECH_DATA;

  const defaultCenter: [number, number] = [-6.2088, 106.8456];

  // Filter item yang memiliki koordinat (diutamakan live_location, fallback ke site latitude/longitude)
  const validPoints = techPoints.filter(
    t => (t.live_location && t.live_location.latitude && t.live_location.longitude) || (t.latitude && t.longitude)
  );

  // Helper untuk meresolve koordinat (Live GPS > Site Location)
  const getPointPos = (point: DispatchMapItem): [number, number] => {
    if (point.live_location && point.live_location.latitude && point.live_location.longitude) {
      return [point.live_location.latitude, point.live_location.longitude];
    }
    return [point.latitude, point.longitude];
  };

  const center: [number, number] = validPoints.length > 0
    ? getPointPos(validPoints[0])
    : defaultCenter;

  let bounds: L.LatLngBounds | undefined = undefined;
  if (typeof window !== "undefined" && validPoints.length > 0) {
    bounds = L.latLngBounds(
      validPoints.map(p => getPointPos(p))
    );
  }

  return (
    <Card className="overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-lg rounded-xl relative group z-0">
      {/* Legend Overlay */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg shadow-sm border border-slate-200/60 dark:border-slate-700/50 text-[10px] space-y-1.5 font-bold w-32">
        <div className="flex items-center justify-between text-slate-400 uppercase tracking-wider border-b pb-1 mb-1 dark:border-slate-700">
          <span>WO Status</span>
          <MapPin className="size-3" />
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
          In Progress
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <div className="size-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
          Dispatched
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <div className="size-2 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
          Pending Assign
        </div>
      </div>

      {/* Label indicator */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-primary/90 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
        <div className="size-1.5 bg-white rounded-full animate-pulse" />
        Live Tracking
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

          {validPoints.map((point, idx) => {
            // Urutkan berdasarkan kombinasi Level + Role agar Lead/Senior sesungguhnya berada di index [0]
            const sortedTeam = [...(point.assigned_team || [])].sort((a, b) => getLeadWeight(b) - getLeadWeight(a));
            const leadTech = sortedTeam[0];
            const techName = leadTech?.technician_name || "Unassigned Tech";
            const hasLive = !!(point.live_location && point.live_location.latitude && point.live_location.longitude);
            const markerPos = getPointPos(point);

            return (
              <Marker
                key={`${point.work_order_id || "wo"}-${idx}`}
                position={markerPos}
                icon={createTechIcon(point.state ?? "unknown", techName)}
              >
                <Popup minWidth={200} className="tech-map-popup">
                  <div className="p-2 font-sans">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="size-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                        style={{ background: getStatusColor(point.state ?? "unknown") }}
                      >
                        {techName.charAt(0)}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900 leading-none mb-0.5">
                          {point.assigned_team && point.assigned_team.length > 1
                            ? `${techName} (+${point.assigned_team.length - 1} partner)`
                            : techName}
                        </h5>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                          Work Order: <span className="font-bold text-primary">{point.work_order_number || "N/A"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t pt-2 border-slate-100 dark:border-slate-800">
                      {/* List Seluruh Anggota Tim */}
                      {sortedTeam.length > 0 && (
                        <div className="flex flex-col gap-1 text-[11px] mb-1">
                          <span className="text-slate-500 font-medium">Team Pair</span>
                          <div className="flex flex-col gap-1">
                            {sortedTeam.map((member, mIdx) => (
                              <div key={mIdx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-700/50">
                                <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[110px]">{member.technician_name}</span>
                                <span className="text-[8px] uppercase font-black text-slate-400 bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-100 dark:border-slate-700 shrink-0">
                                  {member.level || "junior"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">WO Status</span>
                        <span
                          className="font-bold uppercase text-[9px] px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${getStatusColor(point.state ?? "unknown")}15`,
                            color: getStatusColor(point.state ?? "unknown")
                          }}
                        >
                          {(point.state ?? "unknown").replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5 text-[11px]">
                        <span className="text-slate-500 font-medium">Location Site</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {point.site_name || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Pos Source</span>
                        <span className={`font-bold text-[9px] uppercase px-1.5 py-0.5 rounded ${hasLive ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30' : 'text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800'}`}>
                          {hasLive ? "📡 Live GPS" : "🏠 Site Loc"}
                        </span>
                      </div>

                      {point.live_updated_at && hasLive && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Last Ping</span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {new Date(point.live_updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}

                      <div className="text-[9px] text-slate-400 font-mono text-right mt-1">
                        GPS: {markerPos[0].toFixed(5)}, {markerPos[1].toFixed(5)}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </Card>
  );
}
