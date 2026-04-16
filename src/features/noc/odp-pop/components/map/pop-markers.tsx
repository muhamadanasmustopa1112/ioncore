import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import { PopData } from "../../types/pop";
import { createStatusIcon } from "./map-utils";
import { MutableRefObject } from "react";

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
          position={[pop.latitude, pop.longitude]}
          icon={createStatusIcon(pop.status)}
          eventHandlers={{
            click: () => onSelect?.(pop.id),
          }}
          ref={(ref) => {
            if (ref) markerRefs.current[pop.id] = ref;
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
      ))}
    </>
  );
}
