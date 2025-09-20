'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '../../context/authInfo';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { updateProfilePhoto } from '@/app/lib/actions';
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
            console.log(user);
        }
    }, [user]);

    const updateUserPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await updateProfilePhoto(formData);

        console.log(response);
    }

    if (!user) return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;

    return (
        <div className="flex min-h-screen">

            {/* Main Content */}
            <main className="flex-1 sm:p-6 pt-5">

                <div className="profile-photo mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-8 border shadow-md mb-4">
                    <form onSubmit={updateUserPhoto} method="post" encType='multipart/form-data'>

                        { user.profilePhoto?.url && <img width={300} height={300} src={(`http://localhost:8000${user.profilePhoto?.url?? '#'}`) } alt='' /> }

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 dark:text-gray-300">Profile Photo</label>
                            <input name='profile_photo' className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white" type='file' accept='jpeg/jpg/webp/png' />
                        </div>

                        <button type='submit' className="inline-block mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                            Update Profile Photo
                        </button>

                    </form>
                </div>

                <div className="contact-information mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-8 border shadow-md mb-4">
                    {/* Element of Donor Registration Form that doesn't need admin verification */}
                    {/* Like Current Location, City */}

                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 dark:text-gray-300">Current City</label>
                        <input className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white" value={user.city ?? ""} readOnly />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 dark:text-gray-300">Current Location</label>
                        <input className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white" value={user.country ?? ""} readOnly />
                    </div>

                </div>
                <div className="mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-8 border shadow-md">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Profile Overview</h1>

                    <div className="grid lg:grid-cols-2 gap-8">
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
                            {/* Blood Group */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 dark:text-gray-300">Blood Group</label>
                                <input className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white" value={user.blood_group || ''} readOnly />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 dark:text-gray-300">Verified as Donor</label>
                                <input className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white" value={user.verified_as_donor ? "Yes" : "No"} readOnly />
                            </div>
                            <Link href="/profile/edit" className="inline-block mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
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
