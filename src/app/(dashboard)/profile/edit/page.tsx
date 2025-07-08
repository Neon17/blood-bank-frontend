'use client';

import { useAuth } from '@/app/authInfo';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/app/lib/actions';
import dynamic from 'next/dynamic';
const MapPicker = dynamic(() => import("@/app/_components/MapPicker"), { ssr: false });

export default function EditProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [location, setLocation] = useState({
        lat: 27.7172,
        lng: 85.3240,
        city: 'Kathmandu',
        country: 'Nepal',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        formData.append("city", location.city);
        formData.append("country", location.country);
        formData.append("lat", location.lat.toString());
        formData.append("lng", location.lng.toString());

        const response = await updateProfile(formData);

        if ("message" in response && response.status === "error") {
            setError(response.message);
        } else {
            setSuccess(true);
            setTimeout(() => router.push('/profile'), 1200);
        }
    };

    if (!user) return <div className="text-center py-10 min-h-screen">Loading...</div>;

    return (
        <div className="w-full max-w-5xl mx-auto sm:p-6 pt-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">Edit Your Profile</h1>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
                {error && <p className="bg-red-500 text-white p-3 rounded">{error}</p>}
                {success && <p className="bg-green-500 text-white p-3 rounded">Updated successfully</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                        <input type="email" name="email" defaultValue={user.email} className="w-full bg-gray-100 dark:bg-gray-700 text-sm p-2 rounded" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                        <input type="text" name="name" defaultValue={user.name} className="w-full bg-gray-100 dark:bg-gray-700 text-sm p-2 rounded" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Will Donate?</label>
                        <div className="flex gap-4 mt-1">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="will_donate" value="1" defaultChecked={user.will_donate === true} />
                                Yes
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="will_donate" value="0" defaultChecked={user.will_donate === false} />
                                No
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Address</label>
                        <input type="text" name="address" defaultValue={user.address} className="w-full bg-gray-100 dark:bg-gray-700 text-sm p-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Date of Birth</label>
                        <input type="date" name="dob" defaultValue={user.dob?.toString().split("T")[0]} className="w-full bg-gray-100 dark:bg-gray-700 text-sm p-2 rounded" />
                    </div>

                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Save Changes</button>
                </form>

                <div className="mt-10">
                    <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Select Your Location</h2>
                    <MapPicker width='100%' location={location} onChange={setLocation} />
                </div>
            </div>
        </div>
    );
}
