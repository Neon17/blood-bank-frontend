"use client";

import { useEffect, useState } from "react";
import {donorApplications } from "../lib/actions";
import dynamic from "next/dynamic";
import Link from "next/link";
import SearchRadiusSlider from "../_components/SearchRadiusSlider";
import { BloodDonor, ExactLocation } from "../lib/definitions";
const MapPicker = dynamic(() => import("@/app/_components/MapPicker"), { ssr: false });

export default function Donors() {
    const [data, setData] = useState<BloodDonor[]>([]);
    const [location, setLocation] = useState<ExactLocation>({
        lat: 27.712,
        lng: 85.3240,
        city: "Kathmandu",
        country: "Nepal"
    });
    const [locations, setLocations] = useState<ExactLocation[]>([]);
    const [searchRadius, setSearchRadius] = useState<number>(1);
    const [searchBloodType, setSearchBloodType] = useState<string>('');

    const handleDonors = (res: {
        status: string;
        data: BloodDonor[];
    } | {
        status: "error";
        message: string;
        errors?: any;
    }) => {
        if (res && "data" in res && res?.data) {
            setData(res?.data);
            setLocations(
                res?.data.map((donor: BloodDonor) => ({
                    lat: donor.latitude,
                    lng: donor.longitude,
                    city: donor.city,
                    country: donor.country,
                    label: {
                        name: donor.user?.name,
                        contact_number: donor.contact_number,
                        blood_type: donor.blood_type,
                    }
                }))
            );
        }
        else {
            console.error('Failed to load donors', res);
        }
    }

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const res = await donorApplications();
                handleDonors(res);
            } catch (err) {
                console.error('Failed to load donors', err);
            }
        }
        fetchDonors();
    }, []);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const preparedData = {
            latitude: location.lat,
            longitude: location.lng,
            blood_group: searchBloodType,
            radius: searchRadius
        };
        const data = await donorApplications(preparedData);
        handleDonors(data);
    }

    return (
        <main className="grid grid-cols-1 lg:grid-cols-2 w-full">

            {/* Left: Map */}
            <div className="h-full w-full overflow-hidden border-r">
                <MapPicker location={location} locations={locations} onChange={setLocation} radius={searchRadius} width={"100%"} height={"100%"} />
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
                            <form onSubmit={handleSubmit} method="get" className="mb-3">
                                <select value={searchBloodType} onChange={(e) => setSearchBloodType(e.target.value)} className="p-2 border rounded w-full dark:bg-gray-800">
                                    <option value="">Blood Group</option>
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
                            <h3 className="text-lg font-semibold">{elem.user?.name}</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Blood Type: {elem.blood_type}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Verified: {elem.user?.verified_as_donor ? 'Yes' : 'No'}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">City: {elem.city}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Email: {elem.user?.email}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Phone: {elem.contact_number}</p>
                        </div>
                    ))}
                </div>
            </div>

        </main>
    );
}
