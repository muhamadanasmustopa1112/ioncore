"use client";

import { useMemo } from "react";
import { Polyline } from "react-leaflet";
import { DUMMY_OLT_DETAILS } from "../../data/dummy-olt-details";
import { DUMMY_ODP_LIST } from "../../data/dummy-odp-list";
import { DUMMY_POP_DATA } from "../../data/dummy-odp-pop";

interface TopologyPathsProps {
  selectedArea?: string | null;
  selectedPopId: string | null;
}

/**
 * Renders topology paths (connection lines) between POPs and their child ODPs.
 * This visualizes the physical/logical connection between infrastructure points.
 */
export function TopologyPaths({ selectedArea, selectedPopId }: TopologyPathsProps) {
  const paths = useMemo(() => {
    const result: { id: string; positions: [number, number][] }[] = [];

    // 1. Determine which POPs to process based on filters
    let popsToProcess = DUMMY_POP_DATA;
    if (selectedPopId) {
      popsToProcess = DUMMY_POP_DATA.filter(p => p.id === selectedPopId);
    } else if (selectedArea) {
      popsToProcess = DUMMY_POP_DATA.filter(p => p.area === selectedArea);
    }

    // 2. Iterate through POPs -> OLTs -> ODPs to build connection paths
    popsToProcess.forEach(pop => {
      const olts = DUMMY_OLT_DETAILS[pop.id] || [];
      olts.forEach(olt => {
        const odps = DUMMY_ODP_LIST[olt.id] || [];
        odps.forEach(odp => {
          result.push({
            id: `${pop.id}-${odp.id}`,
            positions: [
              [pop.latitude, pop.longitude],
              [odp.latitude, odp.longitude]
            ]
          });
        });
      });
    });

    return result;
  }, [selectedArea, selectedPopId]);

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
