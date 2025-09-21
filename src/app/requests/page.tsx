"use client";
import { useEffect, useState } from "react";
import ActionDropdown from "../_components/ActionDropdown";
import { bloodRequests } from "../lib/actions";
import { BloodRequest, ExactLocation } from "../lib/definitions";
import SearchRadiusSlider from "../_components/SearchRadiusSlider";
import dynamic from "next/dynamic";
import Link from "next/link";
const MapPicker = dynamic(() => import("@/app/_components/MapPicker"), { ssr: false });

export default function Requests() {
    const [data, setData] = useState<BloodRequest[]>();
    let success = '';
    let error = '';
    const [searchRadius, setSearchRadius] = useState<number>(1);

    const [location, setLocation] = useState<ExactLocation>({
        lat: 27.7172,
        lng: 85.3240,
        city: "Kathmandu",
        country: "Nepal"
    });
    const [locations, setLocations] = useState<ExactLocation[]>([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await bloodRequests();
                if (res && "data" in res && res?.data) {
                    setData(res.data);
                    setLocations(
                        res?.data.map((request: BloodRequest) => ({
                            lat: request.latitude,
                            lng: request.longitude,
                            city: request.city,
                            country: request.country,
                            label: {
                                name: request.user?.name,
                                contact_number: request.contact_number,
                                blood_type: request.blood_type,
                                date: request.date_time,
                                quantity: request.quantity
                            }
                        }))
                    )
                }
            } catch (err) {
                console.error('Failed to load requests', err);
            }
        }
        fetchRequests();
    }, [])

    return (
        <main className="grid grid-cols-1 lg:grid-cols-2  w-full min-h-screen">

            {/* Map Section */}
            <div className="h-full w-full overflow-hidden border-r">
                <MapPicker location={location} locations={locations} onChange={setLocation} radius={searchRadius} width="100%" height="100%" />
            </div>

            {/* Request Content Section */}
            <div className="w-full overflow-y-auto bg-white dark:bg-gray-900 p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Blood Requests</h1>

                <div className="mb-6">
                    <Link href="/requests/create" className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 w-full text-center">
                        Create Blood Request
                    </Link>
                </div>

                <form action="/requests" className="mb-3" method="get">
                    <SearchRadiusSlider radius={searchRadius} setRadius={setSearchRadius} />
                    <button type="submit" className="hover:cursor-pointer text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Search
                    </button>

                </form>

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        {error}
                    </div>
                )}

                <div className="space-y-4 overflow-y-auto h-[calc(100vh-350px)]">
                    {data && data?.map((elem: BloodRequest, index: number) => (
                        <div
                            key={index}
                            className="p-6 bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-sm"
                        >
                            <h2 className="text-lg font-semibold mb-2">Requested By: {elem && elem.user?.name}</h2>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Blood Type: {elem.blood_type}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Quantity: {elem.quantity}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Date: {elem.date_time && new Date(elem.date_time).toLocaleString()}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Exact Location: {elem.exact_location}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Contact Number: {elem.contact_number}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">City: {elem.city}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Country: {elem.country}</p>
                            {/* <p className="text-sm text-gray-700 dark:text-gray-300">Verified By: {elem.verified_by || 'N/A'}</p> */}
                            
                            {elem.verification_photo?.path && (
                                <img src={elem.verification_photo?.path ? "http://localhost:3000/backend/storage/" + elem.verification_photo.path : "/"} alt="Request Image" width={200} height={200} />
                            )}

                            <div className="flex gap-2 mt-4">
                                <a
                                    href="#"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
                                >
                                    Read more
                                    <svg
                                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 5h12m0 0L9 1m4 4L9 9"
                                        />
                                    </svg>
                                </a>

                                <ActionDropdown id={elem.id ? elem.id.toString(): ""} error={error} success={success} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </main>
    );
}
