"use client";

import { useEffect, useState, useRef, MutableRefObject, useMemo } from "react";
import { Card, CardHeader, CardHeading, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { PopData } from "../../types/odp-pop";
import { DUMMY_POP_DATA } from "../../data/dummy-odp-pop";
import { Maximize2, Map as MapIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// Controller to handle programmatic map changes with smooth navigation
function MapFocusController({ selectedPopId, data, markerRefs }: {
  selectedPopId: string | null,
  data: PopData[],
  markerRefs: MutableRefObject<Record<string, L.Marker>>
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPopId) {
      const pop = data.find(p => p.id === selectedPopId);
      if (pop) {
        // Smooth Pan and Zoom
        map.flyTo([pop.latitude, pop.longitude], 16, {
          animate: true,
          duration: 1.5
        });

        // Open Popup with a slight delay for animation completion
        const marker = markerRefs.current[selectedPopId];
        if (marker) {
          setTimeout(() => {
            marker.openPopup();
          }, 1500);
        }
      }
    }
  }, [selectedPopId, data, map, markerRefs]);

  return null;
}

// Controller to ensure map alignment and fix "broken tiles" by invalidating size on mount
function MapResizeController() {
  const map = useMap();
  useEffect(() => {
    // Small delay ensures the container has finished its layout transition
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Custom icons based on status using standard SVG Map Pin (consistent and clear)
const createStatusIcon = (status: PopData['status']) => {
  let color = '#3b82f6'; // blue default
  if (status === 'active') color = '#10b981'; // emerald-500
  if (status === 'warning') color = '#f59e0b'; // amber-500
  if (status === 'down') color = '#f43f5e'; // rose-500

  const svgIcon = `
    <svg width="36" height="48" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3));">
      <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="${color}"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `;

  return L.divIcon({
    className: "bg-transparent border-none",
    html: svgIcon,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48],
  });
};

export default function OdpPopMap({ selectedPopId, onSelect }: {
  selectedPopId: string | null,
  onSelect?: (id: string | null) => void
}) {
  const [data] = useState<PopData[]>(DUMMY_POP_DATA);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(selectedPopId);
  const [isMounted, setIsMounted] = useState(false);
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setInternalSelectedId(selectedPopId);
  }, [selectedPopId]);

  const handlePopClick = (id: string | null) => {
    setInternalSelectedId(id);
    if (onSelect) onSelect(id);
  };

  // Calculate center based on first marker or default to Jakarta - stabilized with useMemo
  const center = useMemo<[number, number]>(() => (
    data.length > 0
      ? [data[0].latitude, data[0].longitude]
      : [-6.2088, 106.8456]
  ), [data]);

  // Memoize Marker List to prevent broken maps/flickering on every re-render
  const renderedMarkers = useMemo(() => (
    data.map((pop) => (
      <Marker
        key={pop.id}
        position={[pop.latitude, pop.longitude]}
        icon={createStatusIcon(pop.status)}
        ref={(ref) => {
          if (ref) {
            markerRefs.current[pop.id] = ref;
          }
        }}
      >
        <Popup className="odp-popup">
          <div className="w-[280px] p-1">
            <div className="flex justify-between items-start mb-2 border-b pb-2">
              <div>
                <h4 className="font-black text-xs m-0 text-foreground uppercase tracking-tight">{pop.name}</h4>
              </div>
              <Badge
                variant={pop.status === 'active' ? 'success' : pop.status === 'warning' ? 'warning' : 'destructive'}
                appearance="light"
                className="uppercase text-[9px] font-black"
              >
                {pop.status}
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between pb-1 border-b border-border/50">
                <span className="text-muted-foreground font-bold tracking-tight uppercase text-[9px]">Infrastructure:</span>
                <div className="text-right font-black uppercase text-[10px]">
                  <span className="text-primary">{pop.oltCount}</span> OLT{" - "}
                  <span className="text-primary">{pop.odpCount}</span> ODP
                </div>
              </div>
              <div className="pt-1">
                <p className="text-[10px] text-muted-foreground font-medium leading-tight line-clamp-2">
                  {pop.address}
                </p>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    ))
  ), [data]); // Only re-generate if the data array changes

  if (!isMounted) {
    return <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center text-muted-foreground uppercase font-black text-xs tracking-widest">Loading Infrastructure Map...</div>;
  }

  return (
    <Card className="h-full flex flex-col shadow-lg border-2 border-border/40 rounded-3xl overflow-hidden relative">
      <CardHeader className="py-5 px-6 border-b bg-white z-10">
        <div className="flex items-center justify-between">
          <CardHeading className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapIcon className="size-4 text-primary" />
            </div>
            POP Geographic Distribution
          </CardHeading>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
              <span className="flex size-2 rounded-full bg-emerald-500" /> Active
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
              <span className="flex size-2 rounded-full bg-amber-500" /> Warning
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 relative overflow-hidden min-h-[500px]">

        <MapContainer center={center} zoom={10} className="h-full w-full z-0">
          <TileLayer
            attribution='&copy; Google Maps'
            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />

          <MapResizeController />

          <MapFocusController
            selectedPopId={internalSelectedId}
            data={data}
            markerRefs={markerRefs}
          />

          {renderedMarkers}
        </MapContainer>
        <Button
          variant="outline"
          size="sm"
          mode="icon"
          className="absolute bottom-6 right-6 z-[400] bg-white/90 backdrop-blur-xl shadow-2xl border-none hover:bg-white size-10 rounded-xl transition-transform hover:scale-110 active:scale-95"
          onClick={() => handlePopClick(null)}
        >
          <Maximize2 className="size-5 text-primary" />
        </Button>
      </CardContent>
    </Card>
  );
}
