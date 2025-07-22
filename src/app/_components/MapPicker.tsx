'use client';

import { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap, Marker, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import { ExactLocation as Location } from "../lib/definitions";

type MapPickerProps = {
  location: Location;
  onChange: (location: Location) => void;
  radius?: number | null;
  height?: string;
  width?: string;
};

export default function MapPicker({
  location,
  onChange,
  radius,
  height = "800px",
  width = "800px",
}: MapPickerProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [mounted, setMounted] = useState(false);
  const mapContainerId = "map-leaflet";

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const { lat, lng } = markerRef.current.getLatLng();

    // Remove old circle
    if (circleRef.current) {
      circleRef.current.remove();
    }

    if (radius !== null && radius !== undefined) {
      // Create new circle in meters
      circleRef.current = L.circle([lat, lng], {
        radius: radius * 1000,
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3,
      }).addTo(mapRef.current);
    }
  }, [radius]);


  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);

    // Fix missing marker icons
    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    });
  }, []);

  useEffect(() => {
    if (!mounted || mapRef.current) return;

    const map = L.map(mapContainerId).setView([location.lat, location.lng], 13);
    mapRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    });

    geocoder
      .on("markgeocode", (e) => {
        const latlng = e.geocode.center;
        map.setView(latlng, 13);
        placeMarker(latlng.lat, latlng.lng);
        onChange({
          lat: latlng.lat,
          lng: latlng.lng,
          city: e.geocode.name,
          country: "",
        });
      })
      .addTo(map);

    map.on("click", (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      placeMarker(lat, lng);
      onChange({
        lat,
        lng,
        city: "",
        country: "",
      });
    });

    placeMarker(location.lat, location.lng);
  }, [mounted]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView([location.lat, location.lng], 13);
    placeMarker(location.lat, location.lng);
  }, [location.lat, location.lng]);

  function placeMarker(lat: number, lng: number) {
    if (!mapRef.current) return;
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);

    if (circleRef.current) circleRef.current.remove();

    circleRef.current = L.circle([lat, lng], {
      radius: (radius ?? 1) * 1000,
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.3,
    }).addTo(mapRef.current);
  }

  // Only render the map container on the client
  if (!mounted) return null;

  return (
    <div id={mapContainerId} style={{ height, width }} />
  );
}
