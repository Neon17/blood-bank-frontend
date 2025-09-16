'use client';

import { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap, Marker, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import { ExactLocation as Location } from "../lib/definitions";

type MapPickerProps = {
  location?: Location;          // Active/focus location
  locations?: Location[];       // Multiple donor markers
  onChange?: (location: Location) => void;
  radius?: number | null;
  height?: string;
  width?: string;
};

export default function MapPicker({
  location,
  locations = [],
  onChange,
  radius,
  height = "800px",
  width = "800px",
}: MapPickerProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);     // red focus marker
  const circleRef = useRef<L.Circle | null>(null);
  const donorMarkersRef = useRef<L.Marker[]>([]);
  const [mounted, setMounted] = useState(false);
  const mapContainerId = "map-leaflet";

  // Helper: safely extract numeric lat/lng from a Location-like object
  function toNumberLatLng(d: any): { lat: number; lng: number } | null {
    if (!d) return null;
    const rawLat = d.lat ?? d.latitude ?? d.latitude_in ?? d.latitudeValue;
    const rawLng = d.lng ?? d.longitude ?? d.longitude_in ?? d.longitudeValue;
    const lat = Number(rawLat);
    const lng = Number(rawLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }

  // Create icons with optional count badge
  function markerSvg(color: string, count?: number) {
    // wrapper ensures absolute badge is positioned relative to icon
    const svg = `
      <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#fff" stroke-width="2"
          d="M15 0 C22.5 0 30 7.5 30 15 C30 22.5 15 40 15 40 
             C15 40 0 22.5 0 15 C0 7.5 7.5 0 15 0 Z 
             M15 10 A5 5 0 1 0 15 10.0001 Z"/>
      </svg>
    `;
    const countDiv = (count && count > 1)
      ? `<div style="
           position:absolute;
           top:-6px;
           right:-6px;
           background: white;
           color: black;
           border-radius: 50%;
           width:18px;
           height:18px;
           font-size:12px;
           display:flex;
           align-items:center;
           justify-content:center;
           box-shadow:0 0 0 1px rgba(0,0,0,0.1);
         ">${count}</div>`
      : "";

    return `<div style="position:relative; width:30px; height:40px; display:inline-block;">${svg}${countDiv}</div>`;
  }

  const redIcon = (count?: number) =>
    L.divIcon({
      className: "custom-div-icon",
      html: markerSvg("red", count),
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

  const blueIcon = (count?: number) =>
    L.divIcon({
      className: "custom-div-icon",
      html: markerSvg("blue", count),
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

  // Initialize leaflet and default icon paths (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);

    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    });
  }, []);

  // update circle radius whenever radius changes
  useEffect(() => {
    if (circleRef.current && radius) {
      circleRef.current.setRadius(radius * 1000);
    }
  }, [radius]);


  // Build a safe tuple center for setView
  function getInitialCenter(): [number, number] {
    const fromSingle = toNumberLatLng(location as any);
    if (fromSingle) return [fromSingle.lat, fromSingle.lng];

    if (Array.isArray(locations) && locations.length > 0) {
      const first = toNumberLatLng(locations[0] as any);
      if (first) return [first.lat, first.lng];
    }

    // fallback Kathmandu
    return [27.7172, 85.3240];
  }

  // Create map once
  useEffect(() => {
    if (!mounted || mapRef.current) return;

    const initialCenter = getInitialCenter();
    const map = L.map(mapContainerId).setView(initialCenter, 13);
    mapRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // click on map moves focus marker
    map.on("click", (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      placeFocusMarker(lat, lng);
      onChange?.({
        lat,
        lng,
        city: "",
        country: "",
      } as Location);
    });

    // if a starting location was provided, place the focus marker
    if (location) {
      const coords = toNumberLatLng(location as any);
      if (coords) placeFocusMarker(coords.lat, coords.lng);
    }

    // render donor markers if provided
    if (locations && locations.length > 0) {
      renderDonorMarkers(locations);
    }
  }, [mounted]);

  // When `locations` prop changes, re-render donor markers
  useEffect(() => {
    if (!mapRef.current) return;
    renderDonorMarkers(locations);
  }, [locations]);

  // When `location` (active) changes, move the focus marker
  useEffect(() => {
    if (!mapRef.current || !location) return;
    const coords = toNumberLatLng(location as any);
    if (!coords) return;
    mapRef.current.setView([coords.lat, coords.lng], 13);
    placeFocusMarker(coords.lat, coords.lng);
  }, [location]);

  // Group by exact coordinates (6 decimal places) and render
  function renderDonorMarkers(donors: Location[]) {
    // remove old markers
    donorMarkersRef.current.forEach((m) => m.remove());
    donorMarkersRef.current = [];

    // group donors by lat/lng key
    const grouped = new Map<string, { original: Location; lat: number; lng: number }[]>();
    donors.forEach((d) => {
      const coords = toNumberLatLng(d as any);
      if (!coords) return; // skip invalid coords
      const key = `${coords.lat.toFixed(6)}_${coords.lng.toFixed(6)}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push({ original: d, lat: coords.lat, lng: coords.lng });
    });

    // create markers for each group
    grouped.forEach((group) => {
      const first = group[0];
      const count = group.length;
      const lat = first.lat;
      const lng = first.lng;

      const m = L.marker([lat, lng], { icon: blueIcon(count) }).addTo(mapRef.current!);

      // tooltip only when label exists
      const labelObj = (first.original as any).label;
      if (labelObj !== undefined && labelObj !== null) {
        let tooltipHtml = "";
        if (typeof labelObj === "string" || typeof labelObj === "number") {
          tooltipHtml = String(labelObj);
        } else if (typeof labelObj === "object") {
          // build line-by-line entries
          tooltipHtml = Object.entries(labelObj)
            .map(([k, v]) => `<div style="white-space:nowrap;">${k}: ${String(v)}</div>`)
            .join("");
        } else {
          tooltipHtml = String(labelObj);
        }
        // bind tooltip (HTML)
        m.bindTooltip(tooltipHtml, { direction: "top", offset: [0, -10], className: "donor-tooltip" });
      }

      // clicking blue marker sets focus marker to this position (and emits onChange)
      m.on("click", () => {
        placeFocusMarker(lat, lng);
        onChange?.({
          lat,
          lng,
          city: (first.original as any).city ?? "",
          country: (first.original as any).country ?? "",
          label: (first.original as any).label,
        } as Location);
      });

      donorMarkersRef.current.push(m);
    });
  }

  // places the single editable focus marker with circle
  function placeFocusMarker(lat: number, lng: number) {
    if (!mapRef.current) return;
    if (markerRef.current) markerRef.current.remove();
    if (circleRef.current) circleRef.current.remove();

    markerRef.current = L.marker([lat, lng], { icon: redIcon() }).addTo(mapRef.current);

    circleRef.current = L.circle([lat, lng], {
      radius: (radius ?? 1) * 1000,
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.3,
    }).addTo(mapRef.current);
  }

  if (!mounted) return null;

  return <div id={mapContainerId} style={{ height, width }} />;
}
