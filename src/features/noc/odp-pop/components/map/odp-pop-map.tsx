"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Card, CardHeader, CardHeading, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Maximize2, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

// Modular Components
import { PopMarkers } from "./pop-markers";
import { OdpMarkers } from "./odp-markers";
import { TopologyPaths } from "./topology-paths";
import { usePop } from "../../api/get-pop";

// --- Controllers ---

/**
 * Handles smooth map pan/zoom and automatic popup opening when selections change.
 */
function MapFocusController({ selectedPopId, selectedOdpId, markerRefs, pops }: {
  selectedPopId: string | null;
  selectedOdpId?: string | null;
  markerRefs: React.MutableRefObject<Record<string, L.Marker>>;
  pops: any[];
}) {
  const map = useMap();

  useEffect(() => {
    // 1. Handle ODP Selection (Placeholder for now since odps are disabled)
    if (selectedOdpId) {
      // Logic removed as requested
    }
    // 2. Handle POP Selection
    else if (selectedPopId) {

      const pop = pops.find(p => String(p.id) === String(selectedPopId));
      if (pop) {
        map.flyTo([pop.latitude, pop.longitude], 16, { animate: true, duration: 1.5 });

        // Auto-open POP popup
        const marker = markerRefs.current[selectedPopId];
        if (marker) {
          setTimeout(() => marker.openPopup(), 1500);
        }
      }
    }
  }, [selectedPopId, selectedOdpId, map, markerRefs, pops]);

  return null;
}



/**
 * Fixes Leaflet "size" calculation issues in flex/dynamic layouts.
 */
function MapResizeController() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 300);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// --- Main Component ---

interface OdpPopMapProps {
  selectedArea?: string | null;
  selectedPopId: string | null;
  selectedOdpId?: string | null;
  onSelect?: (id: string | null) => void;
  showOdps?: boolean;
}

export default function OdpPopMap({
  selectedArea,
  selectedPopId,
  selectedOdpId,
  onSelect,
  showOdps = false,
}: OdpPopMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: popResponse } = usePop();
  
  const pops = useMemo(() => popResponse?.data || [], [popResponse]);

  // Filter POPs based on area
  const filteredPops = useMemo(() => {
    if (!selectedArea) return pops;
    return pops.filter(pop => pop.area === selectedArea);
  }, [selectedArea, pops]);

  // Default center

  const defaultCenter = useMemo<[number, number]>(() => (
    filteredPops.length > 0
      ? [filteredPops[0].latitude, filteredPops[0].longitude]
      : [-6.2088, 106.8456]
  ), [filteredPops]);

  if (!isMounted) {
    return (
      <div className="h-full w-full bg-muted animate-pulse rounded-3xl flex items-center justify-center text-muted-foreground uppercase font-black text-xs tracking-widest">
        Initializing Base Map...
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col shadow-lg border-2 border-border/40 rounded-3xl overflow-hidden relative">
      <CardHeader className="py-5 px-6 border-b bg-card z-10">
        <div className="flex items-center justify-between">
          <CardHeading className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapIcon className="size-4 text-primary" />
            </div>
            Infrastructure Geographic View
          </CardHeading>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
              <span className="flex size-2 rounded-full bg-emerald-500" /> Active POP
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
              <span className="flex size-2 rounded-full bg-violet-500" /> ODP
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 relative overflow-hidden">
        <MapContainer center={defaultCenter} zoom={10} className="h-full w-full z-0">
          <TileLayer
            attribution='&copy; Google Maps'
            url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />

          <MapResizeController />
          <MapFocusController
            selectedPopId={selectedPopId}
            selectedOdpId={selectedOdpId}
            markerRefs={markerRefs}
            pops={pops}
          />

          <PopMarkers
            data={filteredPops}
            markerRefs={markerRefs}
            onSelect={onSelect}
          />
        </MapContainer>



        <Button
          variant="outline"
          size="sm"
          mode="icon"
          className="absolute bottom-6 right-6 z-[400] bg-background/90 backdrop-blur-xl shadow-2xl border-none hover:bg-background size-10 rounded-xl transition-transform hover:scale-110 active:scale-95"
          onClick={() => onSelect?.(null)}
        >
          <Maximize2 className="size-5 text-primary" />
        </Button>
      </CardContent>
    </Card>
  );
}
