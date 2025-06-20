"use client";

import { useAuth } from "../../authInfo";
import { updateProfile } from "@/app/lib/actions";
import { useState } from "react";
import { redirect } from "next/navigation";

const EditProfile = () => {
    const { user, isLoggedIn } = useAuth();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const name = document.getElementById('name');
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const response = await updateProfile(formData);

        if (response.status === 'error') {
            if (response.message){
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
            <div className="max-w-md md:max-w-xl mx-auto w-full flex flex-col gap-8 bg-white p-4 rounded-md">
                <h1 className="text-2xl text-center m-3">User Profile</h1>
                {error &&
                    <p className="text-red-50 bg-red-500 p-2">
                        {error}
                    </p>
                }
                <form onSubmit={handleSubmit}>
                    {/* Editable Fields */}
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            defaultValue={user.email}
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            defaultValue={user.name}
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="will_donate" className="block text-sm font-medium text-gray-900 mb-1">Will Donate?</label>
                        <p className="choice-container">
                            <input type="radio" name="will_donate" className="m-2" value={1} id="" defaultChecked={user.will_donate} /> 
                            Yes
                        </p>
                        <p className="choice-container">
                            <input type="radio" name="will_donate" className="m-2" value={0} id="" defaultChecked={!user.will_donate} />
                            No
                        </p>
                        <p className="meaning-choice italic text-sm text-red-700">
                            (This means you are willing to donate to the person on need)
                        </p>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-1">Address:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            defaultValue={user.address || ''}
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-900 mb-1">Date of Birth:</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            defaultValue={user.dob?.split('T')[0] || ''}
                        />
                    </div>

                    {/* Readonly Fields */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-900 mb-1">Role:</label>
                        <input
                            type="text"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            value={user.role || '-'}
                            readOnly
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-900 mb-1">Verified as Donor:</label>
                        <input
                            type="text"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            value={user.verified_as_donor ? "Yes" : "No"}
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
    )
}

export default EditProfile;