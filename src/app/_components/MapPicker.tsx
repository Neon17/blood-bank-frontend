"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

// Fix for missing marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
});

export default function MapPicker({
    location,
    onChange,
}: {
    location: {
        lat: number;
        lng: number;
        city: string;
        country: string;
    };
    onChange: (location: {
        lat: number;
        lng: number;
        city: string;
        country: string;
    }) => void;
}) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerId = "map-leaflet";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Initialize the map and set marker
    useEffect(() => {
        if (!mounted || mapRef.current) return;

        const map = L.map(mapContainerId).setView([location.lat, location.lng], 13);
        mapRef.current = map;

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Add geocoder control
        //@ts-ignore
        const geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
        })
            .on("markgeocode", function (e:any) {
                const latlng = e.geocode.center;
                map.setView(latlng, 13);
                placeMarker(latlng.lat, latlng.lng);
                onChange({
                    lat: latlng.lat,
                    lng: latlng.lng,
                    city: e.geocode.name,
                    country: "", // no reverse lookup, keep empty
                });
            })
            .addTo(map);

        // On map click
        map.on("click", function (e: L.LeafletMouseEvent) {
            const { lat, lng } = e.latlng;
            placeMarker(lat, lng);
            onChange({
                lat,
                lng,
                city: "",
                country: "",
            });
        });

        // Initial marker
        placeMarker(location.lat, location.lng);
    }, [mounted]);

    // Update view and marker if props change
    useEffect(() => {
        if (!mapRef.current) return;
        mapRef.current.setView([location.lat, location.lng], 13);
        placeMarker(location.lat, location.lng);
    }, [location.lat, location.lng]);

    function placeMarker(lat: number, lng: number) {
        if (!mapRef.current) return;

        if (markerRef.current) {
            markerRef.current.remove();
        }

        markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    }

    return <div id={mapContainerId} style={{ height: "800px", width: "800px" }} />;
}
