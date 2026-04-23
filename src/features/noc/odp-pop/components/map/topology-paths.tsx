"use client";

import { useMemo } from "react";
import { Polyline } from "react-leaflet";
import { PopData } from "../../types/pop";
import { OdpData } from "../../types/odp";


interface TopologyPathsProps {
  selectedArea?: string | null;
  selectedPopId: string | null;
  pops: PopData[];
  odps: OdpData[];
}

/**
 * Renders topology paths (connection lines) between POPs and their child ODPs.
 * This visualizes the physical/logical connection between infrastructure points.
 */
export function TopologyPaths({ selectedArea, selectedPopId, pops, odps }: TopologyPathsProps) {
  const paths = useMemo(() => {
    const result: { id: string; positions: [number, number][] }[] = [];

    // Filter ODPs based on current view
    let odpsToProcess = odps;
    if (selectedPopId) {
      odpsToProcess = odps.filter(o => String(o.olt_id) === String(selectedPopId));
    } else if (selectedArea) {
      odpsToProcess = odps.filter(o => o.area === selectedArea);
    }

    // Build paths by finding the parent POP location for each ODP
    odpsToProcess.forEach(odp => {
      const pop = pops.find(p => String(p.id) === String(odp.olt_id));
      if (pop) {
        result.push({
          id: `path-${pop.id}-${odp.id}`,
          positions: [
            [pop.gps_lat, pop.gps_lng],
            [odp.gps_lat, odp.gps_lng]
          ]
        });
      }
    });

    return result;
  }, [selectedArea, selectedPopId, pops, odps]);


  return (
    <>
      {paths.map((path) => (
        <Polyline
          key={path.id}
          positions={path.positions}
          pathOptions={{
            color: "#a78bfa",     // Brighter violet (violet-400) for better visibility on dark maps
            weight: 3,            // Increased thickness
            opacity: 0.7,         // Higher opacity
            dashArray: "10, 12",  // More pronounced dash pattern
            lineCap: "round",
            interactive: false
          }}
        />
      ))}
    </>
  );
}
