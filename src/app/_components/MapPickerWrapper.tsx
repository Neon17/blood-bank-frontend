'use client';

import MapPicker from "./MapPicker";
import { ExactLocation as Location } from "../lib/definitions";

type MapPickerWrapperProps = {
  location: Location;
  radius?: number | null;
  onChange?: ((location: Location) => void) | (() => void);
};

export default function MapPickerWrapper({ location, radius, onChange }: MapPickerWrapperProps) {
  const handleMapChange = (newLocation: Location) => {
    onChange?.(newLocation);
  };

  return (
    <MapPicker
      location={location}
      onChange={handleMapChange}
      radius={radius}
      width="100%"
      height="100%"
    />
  );
}