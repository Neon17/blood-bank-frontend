'use client';

import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";   // <-- Import namespace as L
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder"; // this will attach geocoder to L
import { ExactLocation as Location } from "../lib/definitions";

type MapPickerProps = {
  location?: Location | null;
  locations?: Location[] | null;
  onChange?: (location: Location) => void;
  radius?: number | null;
  height?: string;
  width?: string;
};


export default function MapPicker({
  location,
  locations = null,
  onChange,
  radius = 1,
  height = "600px",
  width = "100%",
}: MapPickerProps) {
  const mapRef = useRef<any | null>(null);
  const markerRef = useRef<any | null>(null); // red focus marker
  const circleRef = useRef<any | null>(null);
  const donorMarkersRef = useRef<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const mapContainerId = "map-leaflet";

  const KATHMANDU = { lat: 27.7172, lng: 85.3240 };

  // Safely extract lat/lng from various shapes
  function toNumberLatLng(d: any): { lat: number; lng: number } | null {
    if (!d) return null;
    const rawLat = d.lat ?? d.latitude ?? d.latitude_in ?? d.latitudeValue;
    const rawLng = d.lng ?? d.longitude ?? d.longitude_in ?? d.longitudeValue;
    const lat = Number(rawLat);
    const lng = Number(rawLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }

  // small div-icon generator for colored markers
  function markerSvg(color: string, count?: number) {
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
      html: markerSvg("#ef4444", count),
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

  const blueIcon = (count?: number) =>
    L.divIcon({
      className: "custom-div-icon",
      html: markerSvg("#2563eb", count),
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

  // remove all donor markers
  function clearDonorMarkers() {
    donorMarkersRef.current.forEach((m) => m.remove());
    donorMarkersRef.current = [];
  }

  // Render donor markers (groups by coordinates to avoid overlap)
  function renderDonorMarkers(donors: Location[] | null | undefined) {
    if (!mapRef.current) return;
    clearDonorMarkers();
    if (!donors || donors.length === 0) return;

    const grouped = new Map<string, { original: Location; lat: number; lng: number }[]>();
    donors.forEach((d) => {
      const coords = toNumberLatLng(d as any);
      if (!coords) return;
      const key = `${coords.lat.toFixed(6)}_${coords.lng.toFixed(6)}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push({ original: d, lat: coords.lat, lng: coords.lng });
    });

    grouped.forEach((group) => {
      const first = group[0];
      const count = group.length;
      const lat = first.lat;
      const lng = first.lng;

      const m = L.marker([lat, lng], { icon: blueIcon(count) }).addTo(mapRef.current);

      // tooltip when label exists
      const labelObj = (first.original as any).label;
      if (labelObj !== undefined && labelObj !== null) {
        let tooltipHtml = "";
        if (typeof labelObj === "string" || typeof labelObj === "number") {
          tooltipHtml = String(labelObj);
        } else if (typeof labelObj === "object") {
          tooltipHtml = Object.entries(labelObj)
            .map(([k, v]) => `<div style="white-space:nowrap;">${k}: ${String(v)}</div>`)
            .join("");
        } else {
          tooltipHtml = String(labelObj);
        }
        m.bindTooltip(tooltipHtml, { direction: "top", offset: [0, -10], className: "donor-tooltip" });
      }

      // clicking blue marker sets focus marker + emits onChange
      m.on("click", () => {
        // set red focus marker at this location
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

  // place or move the single editable focus marker with circle
  function placeFocusMarker(lat: number, lng: number) {
    if (!mapRef.current) return;

    // create marker if missing otherwise move and ensure red icon
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      if (markerRef.current.setIcon) markerRef.current.setIcon(redIcon());
    } else {
      markerRef.current = L.marker([lat, lng], { icon: redIcon() }).addTo(mapRef.current);
    }

    // circle: create or move + set radius
    const rMeters = (radius ?? 1) * 1000;
    if (circleRef.current) {
      circleRef.current.setLatLng([lat, lng]);
      circleRef.current.setRadius(rMeters);
    } else {
      circleRef.current = L.circle([lat, lng], {
        radius: rMeters,
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.25,
      }).addTo(mapRef.current);
    }
  }

  // init (client only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);

    // set leaflet default icon paths (if you serve these assets)
    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    });
  }, []);

  // create map once
  useEffect(() => {
    if (!mounted || mapRef.current) return;

    const initialCenter = location ? (toNumberLatLng(location) ?? KATHMANDU) : KATHMANDU;
    const map = L.map(mapContainerId, { zoomControl: true }).setView([initialCenter.lat, initialCenter.lng], 13);
    mapRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

    // clicking on map places focus marker and emits onChange
    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      placeFocusMarker(lat, lng);
      onChange?.({
        lat,
        lng,
        city: "",
        country: "",
      } as Location);
    });

    // initial render: donors + focus location or kathmandu
    renderDonorMarkers(locations ?? null);

    if (location) {
      const coords = toNumberLatLng(location as any);
      if (coords) {
        placeFocusMarker(coords.lat, coords.lng);
        map.setView([coords.lat, coords.lng], 13);
      } else {
        placeFocusMarker(KATHMANDU.lat, KATHMANDU.lng);
        map.setView([KATHMANDU.lat, KATHMANDU.lng], 13);
      }
    } else {
      placeFocusMarker(KATHMANDU.lat, KATHMANDU.lng);
      map.setView([KATHMANDU.lat, KATHMANDU.lng], 13);
    }

    // cleanup on unmount
    return () => {
      try {
        clearDonorMarkers();
        if (markerRef.current) markerRef.current.remove();
        if (circleRef.current) circleRef.current.remove();
        map.off();
        map.remove();
      } catch (err) {
        // ignore cleanup errors
      }
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]); // run once after mounted

  // update donor markers whenever `locations` changes
  useEffect(() => {
    if (!mapRef.current) return;
    renderDonorMarkers(locations ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  // update focus when `location` prop changes (singular)
  useEffect(() => {
    if (!mapRef.current) return;
    if (location) {
      const coords = toNumberLatLng(location as any);
      if (coords) {
        mapRef.current.setView([coords.lat, coords.lng], 13);
        placeFocusMarker(coords.lat, coords.lng);
        return;
      }
    }
    // if location is null/invalid => center on Kathmandu
    mapRef.current.setView([KATHMANDU.lat, KATHMANDU.lng], 13);
    placeFocusMarker(KATHMANDU.lat, KATHMANDU.lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // update circle radius when `radius` prop changes
  useEffect(() => {
    if (!mapRef.current) return;
    const rMeters = (radius ?? 1) * 1000;
    if (circleRef.current) {
      circleRef.current.setRadius(rMeters);
    }
  }, [radius]);

  if (!mounted) return null;
  return <div id={mapContainerId} style={{ height, width }} />;
}
