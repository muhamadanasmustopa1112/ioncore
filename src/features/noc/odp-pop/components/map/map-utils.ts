import L from "leaflet";
import { PopData } from "../../types/pop";

/**
 * Creates a Leaflet DivIcon for POP and ODP markers.
 * Uses L.point to ensure compatibility with Next.js 15 read-only props.
 */
export const createStatusIcon = (status: 'active' | 'warning' | 'down' | 'odp', isOdp = false) => {
  let color = '#3b82f6';
  if (status === 'active') color = '#10b981';
  if (status === 'warning') color = '#f59e0b';
  if (status === 'down') color = '#f43f5e';
  if (status === 'odp') color = '#8b5cf6';

  const size = isOdp ? [24, 32] : [36, 48];
  const anchor = isOdp ? [12, 32] : [18, 48];

  const svgIcon = isOdp ? `
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3)); pointer-events: none; display: block;">
      <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="${color}"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  ` : `
    <svg width="36" height="48" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3)); pointer-events: none; display: block;">
      <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="${color}"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `;

  return L.divIcon({
    className: "",
    html: `<div style="pointer-events: all; cursor: pointer;">${svgIcon}</div>`,
    iconSize: L.point(size[0], size[1]),
    iconAnchor: L.point(anchor[0], anchor[1]),
    popupAnchor: L.point(0, -anchor[1]),
  });
};
