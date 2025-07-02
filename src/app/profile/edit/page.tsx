"use client";

import { useAuth } from "../../authInfo";
import { updateProfile } from "@/app/lib/actions";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import MapPicker from "@/app/_components/MapPicker";

const EditProfile = () => {
    const { user } = useAuth();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [location, setLocation] = useState({
        lat: user?.latitude ?? 27.7172,
        lng: user?.longitude ?? 85.3240,
        city: user?.city ?? 'Kathmandu',
        country: user?.country ?? 'Nepal'
    });
    console.log(user?.latitude, user?.longitude);

    useEffect(() => {
        if (user){
            setLocation({
                lat: user?.latitude ?? 27.7172,
                lng: user?.longitude ?? 85.3240,
                city: user?.city ?? 'Kathmandu',
                country: user?.country ?? 'Nepal'
            });
        }
    }, [user]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const name = document.getElementById('name');
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append('location', JSON.stringify(location));
        const response = await updateProfile(formData);

        if (response.status === 'error') {
            if (response.message) {
                setError(response.message);
                console.error(response.message);
            }
        }
        else {
            setSuccess('Profile updated successfully');
        }
    }

    if (!user) return <div>Loading...</div>;

    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-center p-3 w-full h-full">
                <div className="flex justify-end h-full">
                    { user &&
                        <MapPicker location={location} onChange={setLocation} />
                    }
                </div>

                <div className="max-w-md md:max-w-xl w-full flex flex-col justify-start gap-8 p-4 rounded-md bg-gray-200 dark:bg-gray-800">
                    <h1 className="text-2xl text-center m-3">User Profile</h1>
                    {error &&
                        <p className="text-red-50 bg-red-500 p-2">
                            {error}
                        </p>
                    }
                    <form onSubmit={handleSubmit}>
                        {/* Editable Fields */}
                        <div className="mb-5">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1 dark:text-gray-100">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                defaultValue={user.email}
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1 dark:text-gray-100">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                defaultValue={user.name}
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="will_donate" className="block text-sm font-medium text-gray-900 mb-1 dark:text-gray-100">Will Donate?</label>
                            <p className="choice-container">
                                <input type="radio" name="will_donate" className="m-2" defaultValue={1} id="" defaultChecked={user.will_donate} />
                                Yes
                            </p>
                            <p className="choice-container">
                                <input type="radio" name="will_donate" className="m-2" defaultValue={0} id="" defaultChecked={!user.will_donate} />
                                No
                            </p>
                            <p className="meaning-choice italic text-sm text-red-700">
                                (This means you are willing to donate to the person on need)
                            </p>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-1 dark:text-gray-100">Address:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                defaultValue={user.address || ''}
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-900 mb-1 dark:text-gray-100">Date of Birth:</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                defaultValue={user.dob?.toString().split('T')[0] || ''}
                            />
                        </div>

                        {/* Readonly Fields */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-900 mb-1 dark:text-gray-100">Role:</label>
                            <input
                                type="text"
                                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                defaultValue={user.role || '-'}
                                readOnly
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-900 mb-1 dark:text-gray-100">Verified as Donor:</label>
                            <input
                                type="text"
                                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                defaultValue={user.verified_as_donor ? "Yes" : "No"}
                                readOnly
                            />
                        </div>

                        <div className="flex-button flex">
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                                Save Changes
                            </button>
                            <p className="text-container px-2 my-auto">
                                {!error && success}
                            </p>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default EditProfile;