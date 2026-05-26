import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { PopData } from "../../types/pop";
import { createStatusIcon } from "./map-utils";
import { MutableRefObject } from "react";
import { MapPin, Server, Network, X } from "lucide-react";

interface PopMarkersProps {
  data: PopData[];
  markerRefs: MutableRefObject<Record<string, L.Marker>>;
  onSelect?: (id: string | null) => void;
}

export function PopMarkers({ data, markerRefs, onSelect }: PopMarkersProps) {
  return (
    <>
      {data.map((pop) => (
        <Marker
          key={`pop-${pop.id}`}
          position={[Number(pop.gps_lat), Number(pop.gps_lng)]}
          icon={createStatusIcon("active")}
          eventHandlers={{
            click: () => {
              onSelect?.(String(pop.id));
              const marker = markerRefs.current[String(pop.id)];
              if (marker) marker.openPopup();
            },
          }}
          ref={(ref) => {
            if (ref) markerRefs.current[String(pop.id)] = ref;
          }}
        >
          <Popup className="pop-popup" closeButton={false} minWidth={360} maxWidth={360}>
            <div className="w-[360px] bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-emerald-500/5">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active POP</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(null);
                    const marker = markerRefs.current[String(pop.id)];
                    if (marker) marker.closePopup();
                  }}
                  className="size-5 rounded-md flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="size-3 text-muted-foreground" />
                </button>
              </div>
              <div className="p-4 space-y-3 text-left">
                {/* Row 1: POP Name & Code Badge */}
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <h4 className="text-sm font-black text-foreground uppercase tracking-tight truncate max-w-[240px]" title={pop.name}>
                    {pop.name}
                  </h4>
                  {pop.code && (
                    <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/30 shrink-0">
                      {pop.code}
                    </span>
                  )}
                </div>

                {/* Row 2: Area Badge, OLT Capsule, ODP Capsule aligned side-by-side */}
                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                  {pop.area && (
                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">
                      Area: {pop.area}
                    </span>
                  )}
                  <div className="flex items-center gap-1 bg-muted/40 rounded-lg px-2 py-0.5 border border-border/10 shrink-0">
                    <Server className="size-3 text-primary shrink-0" />
                    <span className="text-[9px] text-muted-foreground font-bold tracking-tight">OLT</span>
                    <span className="text-[10px] font-black text-primary ml-0.5">{pop.oltCount ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-muted/40 rounded-lg px-2 py-0.5 border border-border/10 shrink-0">
                    <Network className="size-3 text-violet-500 shrink-0" />
                    <span className="text-[9px] text-muted-foreground font-bold tracking-tight">ODP</span>
                    <span className="text-[10px] font-black text-violet-500 ml-0.5">{pop.odpCount ?? 0}</span>
                  </div>
                </div>

                {/* Row 3: Address Pin & Truncated Text */}
                {pop.address && (
                  <div className="flex items-center gap-1.5 pt-2 border-t border-border/20">
                    <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                    <p className="text-[10px] text-muted-foreground leading-none text-left truncate" title={pop.address}>
                      {pop.address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
