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
import { useOdp } from "../../api/get-odp";
import { useOlt } from "../../api/get-olt";
import { PopResponse } from "../../types/pop";

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
        map.flyTo([pop.gps_lat, pop.gps_lng], 16, { animate: true, duration: 1.5 });

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
  data?: PopResponse;
  isLoading?: boolean;
}

export default function OdpPopMap({
  selectedArea,
  selectedPopId,
  selectedOdpId,
  onSelect,
  showOdps = true,
  data: popResponse,
  isLoading
}: OdpPopMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pops = useMemo(() => popResponse?.data || [], [popResponse]);

  // Filter POPs based on area
  const filteredPops = useMemo(() => {
    if (!selectedArea) return pops;
    return pops.filter(pop => pop.area === selectedArea);
  }, [selectedArea, pops]);

  const { data: odpResponse } = useOdp({
    params: {
      limit: 100, // Ambil data ODP yang cukup banyak untuk difilter di client
    },
    queryConfig: {
      enabled: !!selectedPopId, // Tetap hanya fetch saat POP dipilih agar hemat resource
    },
  });

  const { data: oltResponse } = useOlt({
    params: {
      limit: 50,
      pop_id: selectedPopId || undefined, // Fetch OLT yang sesuai dengan POP terpilih
    },
  });

  useEffect(() => {
    console.log("DEBUG NOC MAP:", {
      selectedPopId,
      hasOdpData: !!odpResponse?.data?.length,
      odpCount: odpResponse?.data?.length || 0,
      hasOltData: !!oltResponse?.data?.length,
      oltCount: oltResponse?.data?.length || 0,
    });
  }, [selectedPopId, odpResponse, oltResponse]);

  const odps = useMemo(() => odpResponse?.data || [], [odpResponse]);
  const olts = useMemo(() => oltResponse?.data || [], [oltResponse]);

  // Cari daftar ID OLT yang ada di bawah POP yang sedang dipilih
  const selectedPopOltIds = useMemo(() => {
    if (!selectedPopId) return [];
    return olts
      .filter(olt => String(olt.pop_id) === String(selectedPopId) || String(olt.parent_id) === String(selectedPopId))
      .map(olt => String(olt.id));
  }, [olts, selectedPopId]);

  const filteredOdps = useMemo(() => {
    if (!showOdps || !selectedPopId || !olts.length) return [];
    
    // 1. Ambil semua ID OLT yang 'induknya' adalah POP terpilih
    const validOltIds = olts
      .filter(olt => String(olt.pop_id) === String(selectedPopId) || String(olt.parent_id) === String(selectedPopId))
      .map(olt => String(olt.id));

    // 2. Filter ODP yang olt_id-nya ada di dalam daftar OLT valid tadi
    return odps.filter(odp => validOltIds.includes(String(odp.olt_id)));
  }, [odps, olts, showOdps, selectedPopId]);

  // Default center

  const defaultCenter = useMemo<[number, number]>(() => (
    filteredPops.length > 0
      ? [filteredPops[0].gps_lat, filteredPops[0].gps_lng]
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

          {showOdps && (
            <>
              <TopologyPaths
                pops={pops}
                olts={olts}
                odps={filteredOdps}
              />
              <OdpMarkers
                data={filteredOdps}
                selectedPopId={selectedPopId}
                markerRefs={markerRefs}
                onSelect={(id) => onSelect?.(id)}
              />
            </>
          )}
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
