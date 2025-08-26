'use client';

import MapPicker from "./MapPicker";
import { ExactLocation as Location } from "../lib/definitions";

type Props = {
  location: Location;
  radius?: number | null;
};

export default function MapPickerWrapper({ location, radius }: Props) {
  return (
    <MapPicker
      location={location}
      onChange={() => {}}
      radius={radius}
      width="100%"
      height="100%"
    />
  );
}
