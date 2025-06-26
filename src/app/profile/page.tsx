"use client";

import { User } from "@/app/lib/definitions";
import { useAuth } from "../authInfo";
import { updateProfile } from "../lib/actions";
import { useEffect, useState } from "react";
import MapPicker from "../_components/MapPicker";

const Profile = () => {
    const { user, isLoggedIn } = useAuth();
    const { error, setError } = useState();
    const { success, setSuccess } = useState();
    const [location, setLocation] = useState({
        lat: user?.latitude ?? 27.7172,
        lng: user?.longitude ?? 85.3240,
        city: user?.city ?? 'Kathmandu',
        country: user?.country ?? 'Nepal'
    });

    useEffect(() => {
        if (user) {
            setLocation({
                lat: user?.latitude ?? 27.7172,
                lng: user?.longitude ?? 85.3240,
                city: user?.city ?? 'Kathmandu',
                country: user?.country ?? 'Nepal'
            });
        }
    }, [user]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="w-full h-full flex justify-center md:px-2 w-full h-full">

            <div className="flex justify-end h-full">
                <MapPicker location={location} onChange={setLocation} />
            </div>
            <div className="max-w-md w-full flex flex-col gap-8 bg-gray-200 dark:bg-gray-800 p-4 rounded-md">
                <h1 className="text-2xl text-center m-3">User Profile</h1>
                <form>
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user.email}
                            required readOnly
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user.name}
                            required readOnly
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Address:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user.address || ''} readOnly
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Date of Birth:</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user.dob?.split('T')[0] || ''} readOnly
                        />
                    </div>

                    {/* Readonly Fields */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Role:</label>
                        <input
                            type="text"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user.role || '-'}
                            readOnly
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Verified as Donor:</label>
                        <input
                            type="text"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user.verified_as_donor ? "Yes" : "No"}
                            readOnly
                        />
                    </div>

                    <a href="/profile/edit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Edit
                    </a>
                </form>
            </div>
        </div>
    )
}

export default Profile;