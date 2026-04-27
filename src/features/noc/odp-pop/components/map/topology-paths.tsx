"use client";

import { useMemo } from "react";
import { Polyline } from "react-leaflet";
import { PopData } from "../../types/pop";
import { OdpData } from "../../types/odp";


interface TopologyPathsProps {
  pops: PopData[];
  odps: OdpData[];
}

/**
 * Renders topology paths (connection lines) between POPs and their child ODPs.
 * This visualizes the physical/logical connection between infrastructure points.
 */
export function TopologyPaths({ pops, odps }: TopologyPathsProps) {
  const paths = useMemo(() => {
    const result: { id: string; positions: [number, number][] }[] = [];

    // ODPs are already filtered by the parent (OdpPopMap)
    const odpsToProcess = odps;

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
  }, [pops, odps]);


  return (
    <>
      {paths.map((path) => (
        <Polyline
          key={path.id}
          positions={path.positions}
          pathOptions={{
            color: "#a78bfa",
            weight: 3,
            opacity: 0.7,
            dashArray: "10, 12",
            lineCap: "round",
            interactive: false
          }}
        />
      ))}
    </>
  );
}
