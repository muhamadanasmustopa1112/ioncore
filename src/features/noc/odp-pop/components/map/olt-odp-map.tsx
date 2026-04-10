"use client";

import { useEffect, useState, useRef, MutableRefObject } from "react";
import { Card, CardHeader, CardHeading, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Map as MapIcon, Maximize2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_OLT_ODP_LOCATIONS, OdpLocation } from "../../data/dummy-olt-odp-locations";
import { RiFocus2Line } from "@remixicon/react";

// Controller to handle programmatic map changes
function MapFocusController({ selectedOdpName, points, markerRefs }: {
  selectedOdpName: string | null,
  points: OdpLocation[],
  markerRefs: MutableRefObject<Record<string, L.Marker>>
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedOdpName) {
      const odp = points.find(p => p.name === selectedOdpName);
      if (odp) {
        // Pan and Zoom
        map.flyTo([odp.lat, odp.lng], 18, {
          animate: true,
          duration: 1.5
        });

        // Open Popup
        const marker = markerRefs.current[selectedOdpName];
        if (marker) {
          setTimeout(() => {
            marker.openPopup();
          }, 1500); // Wait for flight to finish
        }
      }
    }
  }, [selectedOdpName, points, map, markerRefs]);

  return null;
}

// Update map bounds to fit all markers initially
function MapBoundsController({ points }: { points: OdpLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [points, map]);

  return null;
}

// Custom icon for ODP (Enlarged Circle pin)
const odpIcon = L.divIcon({
  className: "bg-transparent border-none",
  html: `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" fill="#3b82f6" fill-opacity="0.15"/>
      <circle cx="20" cy="20" r="10" fill="#3b82f6" fill-opacity="0.3"/>
      <circle cx="20" cy="20" r="6" fill="#3b82f6" stroke="white" stroke-width="2.5"/>
    </svg>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -15],
});

export default function OltOdpMap({ oltId }: { oltId: string }) {
  const [points, setPoints] = useState<OdpLocation[]>(DUMMY_OLT_ODP_LOCATIONS[oltId] || []);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedOdpName, setSelectedOdpName] = useState<string | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    setIsMounted(true);
    setPoints(DUMMY_OLT_ODP_LOCATIONS[oltId] || []);
  }, [oltId]);

  if (!isMounted) {
    return (
      <div className="h-[500px] w-full bg-muted animate-pulse rounded-3xl flex items-center justify-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
        Loading Infrastructure Map...
      </div>
    );
  }

  const defaultCenter: [number, number] = points.length > 0
    ? [points[0].lat, points[0].lng]
    : [-6.2088, 106.8456];

  return (
    <Card className="h-full flex flex-col shadow-sm border-none rounded-3xl overflow-hidden relative">
      <CardHeader className="py-5 px-6 border-b bg-white z-10">
        <div className="flex items-center justify-between">
          <CardHeading className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapIcon className="size-4 text-primary" />
            </div>
            ODP Distribution Map
          </CardHeading>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
              <span className="size-2 rounded-full bg-blue-500" />
              Connected ODP
            </div>
            <Badge variant="secondary" className="text-[10px] font-black tracking-widest">
              {points.length} Points Detected
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 relative min-h-[600px] overflow-hidden">
        {/* Floating List Overlay */}
        <div className="absolute top-6 left-6 z-[400] w-64 max-h-[calc(100%-48px)] flex flex-col gap-3">
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/10 bg-white/40 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
                ODP Terminal List
              </span>
              <div className="bg-primary/10 p-1.5 rounded-md">
                <RiFocus2Line className="size-3 text-primary" />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[400px] p-2 custom-scrollbar">
              <div className="flex flex-col gap-1">
                {points.length > 0 ? (
                  points.map((odp) => (
                    <button
                      key={odp.name}
                      onClick={() => setSelectedOdpName(odp.name)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group ${selectedOdpName === odp.name
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'hover:bg-primary/5 text-foreground/80'
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-colors ${selectedOdpName === odp.name ? 'bg-white/20' : 'bg-muted group-hover:bg-primary/10'
                        }`}>
                        <Search className={`size-3 ${selectedOdpName === odp.name ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <span className="text-[10px] font-black truncate uppercase tracking-tight">
                        {odp.name}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">
                      No Data Available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <MapContainer center={defaultCenter} zoom={15} className="h-full w-full z-0">
          <TileLayer
            attribution='&copy; Google Maps'
            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />

          <MapBoundsController points={points} />

          <MapFocusController
            selectedOdpName={selectedOdpName}
            points={points}
            markerRefs={markerRefs}
          />

          {points.map((odp) => (
            <Marker
              key={odp.name}
              position={[odp.lat, odp.lng]}
              icon={odpIcon}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[odp.name] = ref;
                }
              }}
            >
              <Popup className="odp-popup">
                <div className="p-1 min-w-[150px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                    <h4 className="font-black text-[11px] m-0 text-foreground uppercase tracking-tight">
                      {odp.name}
                    </h4>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <div className="flex justify-between text-[9px] font-bold">
                      <span className="text-muted-foreground uppercase">Latitude</span>
                      <span className="text-foreground">{odp.lat.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold">
                      <span className="text-muted-foreground uppercase">Longitude</span>
                      <span className="text-foreground">{odp.lng.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <Button
          variant="outline"
          size="sm"
          mode="icon"
          className="absolute bottom-6 right-6 z-[400] bg-white/90 backdrop-blur-xl shadow-2xl border-none hover:bg-white size-10 rounded-xl transition-transform hover:scale-110 active:scale-95"
          onClick={() => setSelectedOdpName(null)}
        >
          <Maximize2 className="size-5 text-primary" />
        </Button>
      </CardContent>
    </Card>
  );
}
