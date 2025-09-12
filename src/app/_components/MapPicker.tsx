'use client';

import { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap, Marker, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import { ExactLocation as Location } from "../lib/definitions";
import { getCityCountryByLatitudeLongitude } from "../lib/utils";

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
  const redIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
    <svg width="30" height="40" viewBox="0 0 30 40">
      <path
        fill="red"
        stroke="#fff"
        stroke-width="2"
        fill-rule="evenodd"
        d="M15 0 C22.5 0 30 7.5 30 15 C30 22.5 15 40 15 40 C15 40 0 22.5 0 15 C0 7.5 7.5 0 15 0 Z 
           M15 10 A5 5 0 1 0 15 10.0001 Z"
      ></path>
    </svg>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40]
  });

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

  const fillCityCountry = async () => {
    const data = await getCityCountryByLatitudeLongitude(location.lat, location.lng);
    if (data) {
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village;
        const country = data.address.country;
        console.log(`City: ${city}, Country: ${country}`);
        location.city = city;
        location.country = country;
      } else {
        console.log("Address details not found.");
      }
    }
    else {
      console.error("Error during reverse geocoding, so setting default location to Kathmandu, Nepal");
      location.city = "Kathmandu Metropolitican City",
        location.country = "Nepal"
    }
  }


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
    fillCityCountry();
  }, [mounted]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView([location.lat, location.lng], 13);
    placeMarker(location.lat, location.lng);
    fillCityCountry();
  }, [location.lat, location.lng]);

  async function placeMarker(lat: number, lng: number) {
    if (!mapRef.current) return;
    if (markerRef.current) markerRef.current.remove();

    markerRef.current = L.marker([lat, lng], { icon: redIcon }).addTo(mapRef.current);
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
