"use client";

import MapPicker from "../_components/MapPicker";
import { useState } from "react";

export default function MapPage() {
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
    city: "",
    country: ""
  });

  const submitLocation = async () => {
    const res = await fetch("http://your-laravel-domain.com/api/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add auth headers here if needed
      },
      body: JSON.stringify(location),
    });

    if (res.ok) alert("Location saved!");
    else alert("Failed!");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Pick Your Location</h1>
      <MapPicker onChange={setLocation} />
      <div>
        <p>Latitude: {location.lat}</p>
        <p>Longitude: {location.lng}</p>
        <p>City: {location.city}</p>
        <p>Country: {location.country}</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={submitLocation}
        >
          Submit to Backend
        </button>
      </div>
    </div>
  );
}
