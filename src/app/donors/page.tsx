"use client";

import { useEffect, useState } from "react";
import { bloodDonors } from "../lib/actions";
import { User } from "../lib/definitions";
import dynamic from "next/dynamic";
import Link from "next/link";
import SearchRadiusSlider from "../_components/SearchRadiusSlider";
const MapPicker = dynamic(() => import("@/app/_components/MapPicker"), { ssr: false });

export default function Donors() {
    const [data, setData] = useState<User[]>([]);
    const [location, setLocation] = useState({
        lat: 27.712,
        lng: 85.3240,
        city: "Pokhara",
        country: "Nepal"
    });
    const [searchRadius, setSearchRadius] = useState<number>(1);

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const res = await bloodDonors();
                if (res && "data" in res && res?.data) {
                    setData(res?.data);
                }
            } catch (err) {
                console.error('Failed to load donors', err);
            }
        }
        fetchDonors();
    }, []);

    return (
        <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full">

            {/* Left: Map */}
            <div className="h-full w-full overflow-hidden border-r">
                <MapPicker location={location} onChange={setLocation} radius={searchRadius} width={"100%"} height={"100%"} />
            </div>

            {/* Right: Panel */}
            <div className="h-full w-full overflow-y-auto bg-white dark:bg-gray-900">
                {/* Search Header */}

                <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b z-10">
                    <Link href="/donors/register" className="my-2 text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 w-full text-center">
                        Register as Donor
                    </Link>

                    <div className="blood-donors-filter-container border mt-5 p-8 dark:bg-gray-800">

                        <h1 className="text-2xl font-bold mb-4 mt-6">Search Blood Donors</h1>

                        <div className="flex flex-col gap-3">
                            <form action="" method="get" className="mb-3">
                                <select className="p-2 border rounded w-full dark:bg-gray-800">
                                    <option value="">Blood Type</option>
                                    <option value="A+">A+</option>
                                    <option value="B+">B+</option>
                                    <option value="O+">O+</option>
                                </select>
                                <SearchRadiusSlider radius={searchRadius} setRadius={setSearchRadius} />

                                <button type="submit" className="my-2 text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    Search
                                </button>

                            </form>
                        </div>

                    </div>
                </div>

                {/* Donor Cards */}
                <div className="p-6 space-y-4 max-h-screen overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-2">Nearby Donors</h2>

                    {data.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400">No donors found in this area.</p>
                    )}

                    {data.map((elem, idx) => (
                        <div key={idx} className="p-4 border rounded shadow hover:shadow-md transition bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">{elem.name}</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Blood Type: {elem.blood_type}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Verified: {elem.verified_as_donor ? 'Yes' : 'No'}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">City: {elem.city}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Email: {elem.email}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Phone: {elem.phone_number}</p>
                        </div>
                    ))}
                </div>
            </div>

        </main>
    );
}
