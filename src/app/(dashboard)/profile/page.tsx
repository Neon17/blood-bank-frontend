'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '../../authInfo';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const MapPicker = dynamic(() => import("@/app/_components/MapPicker"), { ssr: false });

export default function ProfilePage() {
    const { user } = useAuth();
    const [location, setLocation] = useState({
        lat: user?.latitude ?? 27.7172,
        lng: user?.longitude ?? 85.3240,
        city: user?.city ?? 'Kathmandu',
        country: user?.country ?? 'Nepal',
    });

    useEffect(() => {
        if (user) {
            setLocation({
                lat: user.latitude ?? 27.7172,
                lng: user.longitude ?? 85.3240,
                city: user.city ?? 'Kathmandu',
                country: user.country ?? 'Nepal',
            });
        }
    }, [user]);

    if (!user) return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Profile Overview</h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* User Info */}
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 dark:text-gray-300">Name</label>
                                <input className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white" value={user.name} readOnly />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 dark:text-gray-300">Email</label>
                                <input className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white" value={user.email} readOnly />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 dark:text-gray-300">Date of Birth</label>
                                <input className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white" value={user.dob?.toString().split('T')[0] || ''} readOnly />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 dark:text-gray-300">Address</label>
                                <input className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white" value={user.address || ''} readOnly />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 dark:text-gray-300">Verified as Donor</label>
                                <input className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white" value={user.verified_as_donor ? "Yes" : "No"} readOnly />
                            </div>
                            <Link href="/profile/edit" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                                Edit Profile
                            </Link>
                        </div>

                        {/* Map Picker */}
                        <div className="rounded-md shadow-md overflow-hidden">
                            <MapPicker location={location} onChange={setLocation} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
