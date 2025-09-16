'use client';

import { useAuth } from '@/app/context/authInfo';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/app/lib/actions';
import dynamic from 'next/dynamic';
const MapPicker = dynamic(() => import("@/app/_components/MapPicker"), { ssr: false });

type Error = {
    name?: string,
    email?: string,
    address?: string,
    dob? :string,
    blood_group?: string
}

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
    const [errors, setErrors] = useState<Error>({});
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
            setErrors(response.errors);
            console.error(response.errors);
        } else {
            setSuccess(true);
            setTimeout(() => router.push('/profile'), 1200);
        }
    };

    if (!user) return <div className="text-center py-10 min-h-screen">Loading...</div>;

    return (
        <div className="w-full max-w-5xl mx-auto sm:p-6 pt-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">Edit Your Profile</h1>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4 border">
                {error && <p className="dark:bg-red-500 text-white p-3 rounded">{error}</p>}
                {success && <p className="bg-green-500 text-white p-3 rounded">Updated successfully</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email
                            <p className="text-red-500 px-0.5 inline">*</p>
                        </label>
                        <input type="email" name="email" defaultValue={user.email} className="w-full bg-gray-100 dark:bg-gray-700 text-sm p-2 rounded" required />
                        { errors && errors.email && <p className='text-red-700 dark:text-red-400'>{errors.email}</p> }
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name
                            <p className="text-red-500 px-0.5 inline">*</p>
                        </label>
                        <input type="text" name="name" defaultValue={user.name} className="w-full bg-gray-100 dark:bg-gray-700 text-sm p-2 rounded" required />
                        { errors && errors.name && <p className='text-red-700 dark:text-red-400'>{errors.name}</p> }
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Will Donate?
                            <p className="text-red-500 px-0.5 inline">*</p>
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Blood Group
                            <p className="text-red-500 px-0.5 inline">*</p>
                        </label>
                        {/* Select option of Blood Group */}
                        <select name="blood_group" defaultValue={user.blood_group} className="w-full bg-gray-100 dark:bg-gray-700 text-sm p-2 rounded">
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        { errors && errors.blood_group && <p className='text-red-700 dark:text-red-400'>{errors.blood_group}</p> }
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Address
                            <p className="text-red-500 px-0.5 inline">*</p>
                        </label>
                        <input type="text" name="address" defaultValue={(user.address == '0')? '': user.address} className="w-full bg-gray-100 dark:bg-gray-700 text-sm p-2 rounded" />
                        { errors && errors.address && <p className='text-red-700 dark:text-red-400'>{errors.address}</p> }
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Date of Birth
                            <p className="text-red-500 px-0.5 inline">*</p>
                        </label>
                        <input type="date" name="dob" defaultValue={user.dob?.toString().split("T")[0]} className="w-full bg-gray-100 dark:bg-gray-700 text-sm p-2 rounded" />
                        { errors && errors.dob && <p className='text-red-700 dark:text-red-400'>{errors.dob}</p> }
                    </div>

                    <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Save Changes</button>
                </form>

                <div className="mt-10">
                    <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Select Your Location
                        <p className="text-red-500 px-0.5 inline">Within 1 km*</p>
                    </h2>
                    <MapPicker width='100%' location={location} onChange={setLocation} />
                </div>
            </div>
        </div>
    );
}
