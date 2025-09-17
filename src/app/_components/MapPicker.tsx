'use client';

import { useEffect, useRef, useState } from "react";
import { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import { ExactLocation as Location } from "../lib/definitions";

declare let L: any; // for leaflet-control-geocoder

type MapPickerProps = {
  location?: Location;
  onChange?: (location: Location) => void;
  radius?: number | null;
  height?: string;
  width?: string;
};

export default function MapPicker({
  location,
  onChange,
  radius,
  height = "600px",
  width = "100%",
}: MapPickerProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [mounted, setMounted] = useState(false);
  const mapContainerId = "map-leaflet";

  function toNumberLatLng(d: any): { lat: number; lng: number } | null {
    if (!d) return null;
    const lat = Number(d.lat ?? d.latitude);
    const lng = Number(d.lng ?? d.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }

  function placeFocusMarker(lat: number, lng: number) {
    if (!mapRef.current) return;
    if (markerRef.current) markerRef.current.remove();
    if (circleRef.current) circleRef.current.remove();

    markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);

    circleRef.current = L.circle([lat, lng], {
      radius: (radius ?? 1) * 1000,
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.3,
    }).addTo(mapRef.current);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);

    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    });
  }, []);

  useEffect(() => {
    if (!mounted || mapRef.current) return;

    const map = L.map(mapContainerId, {
      zoomControl: true, // enable zoom controls
    }).setView([27.7172, 85.3240], 13);

    mapRef.current = map;

    // Light OSM tiles (keep map light always)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // --- Search Control ---
    const searchControl = L.Control.geocoder({
      query: "",
      placeholder: "Search location...",
      defaultMarkGeocode: false,
    }).addTo(map);

    // Add Tailwind dark mode classes
    const searchBox = document.querySelector(
      ".leaflet-control-geocoder"
    ) as HTMLElement;
    if (searchBox) {
      searchBox.classList.add(
        "bg-white", "text-black", "border", "border-gray-300",
        "rounded", "px-2", "py-1",
        "dark:bg-gray-900", "dark:border-gray-700"
      );
    }

    // Style zoom buttons too
    const zoomControls = document.querySelector(
      ".leaflet-control-zoom"
    ) as HTMLElement;
    if (zoomControls) {
      zoomControls.classList.add(
        "bg-white", "text-black", "border", "border-gray-300",
        "rounded-md", "overflow-hidden",
        "dark:bg-gray-900", "dark:text-white", "dark:border-gray-700"
      );
    }

    // Handle search result selection
    searchControl.on("markgeocode", function (e: any) {
      const chosen = e.geocode;
      if (!chosen) return;
      map.setView(chosen.center, 13);
      placeFocusMarker(chosen.center.lat, chosen.center.lng);
      onChange?.({
        lat: chosen.center.lat,
        lng: chosen.center.lng,
        city: chosen.name || "",
        country: "",
      } as Location);
    });

    if (location) {
      const coords = toNumberLatLng(location as any);
      if (coords) {
        placeFocusMarker(coords.lat, coords.lng);
        map.setView([coords.lat, coords.lng], 13);
      }
    }
  }, [mounted]);

  if (!mounted) return null;
  return <div id={mapContainerId} style={{ height, width }} />;
}
