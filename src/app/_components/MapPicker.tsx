"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png", // optional
});

export default function MapPicker({ onChange }: {
  onChange: (location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  }) => void
}) {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([28.2096, 83.9856], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Geocoder search
      //@ts-ignore
      const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
      })
        .on("markgeocode", function (e) {
          const latlng = e.geocode.center;
          mapRef.current.setView(latlng, 13);
          placeMarker(latlng.lat, latlng.lng);
        })
        .addTo(mapRef.current);

      // Map click
      mapRef.current.on("click", function (e: any) {
        const { lat, lng } = e.latlng;
        placeMarker(lat, lng);
      });

      // GPS location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          mapRef.current.setView([lat, lng], 13);
          placeMarker(lat, lng);
        });
      }
    }

    function placeMarker(lat: number, lng: number) {
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);

      // Get city and country
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          const address = data.address;
          const city = address.city || address.town || address.village || "";
          const country = address.country || "";
          onChange({ lat, lng, city, country });
        });
    }
  }, [mounted]);

  return <div id="map" style={{ height: "800px", width: "800px" }} />;
}
