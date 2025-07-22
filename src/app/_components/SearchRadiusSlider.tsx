"use client";

import { Dispatch, SetStateAction, useState } from "react";

export default function SearchRadiusSlider(props: {
  radius: number,
  setRadius: Dispatch<SetStateAction<number>>
}) {
  const [radius, setRadius] = useState(props.radius || 1);

  return (
    <div className="w-full p-4">
      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Search Radius: <span className="font-semibold">{radius.toString()}</span>km
      </label>
      <div className="flex items-center space-x-2">
        <span className="text-gray-600 dark:text-gray-400 text-sm">1km</span>
        <input
          type="range"
          min="1"
          max="50"
          value={radius.toString()}
          onChange={(e) => {
            const newRadius = parseInt(e.target.value);
            setRadius(newRadius);
            props.setRadius(newRadius);
          }}
          className="flex-1 appearance-none h-2 bg-red-300 rounded-lg outline-none transition-all duration-300
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-red-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
        />
        <span className="text-gray-600 dark:text-gray-400 text-sm">50km</span>
      </div>
    </div>
  );
}
