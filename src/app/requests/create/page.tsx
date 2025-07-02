"use client"
import MapPicker from "@/app/_components/MapPicker";
import { createBloodRequest } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateRequest() {
    const router = useRouter();

    const [location, setLocation] = useState({
        lat: 27.7172,
        lng: 85.3240,
        city: 'Kathmandu',
        country: 'Nepal'
    })

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        formData.append("city", location.city);
        formData.append("country", location.country);
        formData.append("lat", location.lat.toString());
        formData.append("lng", location.lng.toString());

        const response = await createBloodRequest(formData);

        if (response.status === "error") {
            setError(response.message);
            console.error(response.message);
            alert(response.message);
        } else {
            e.currentTarget.reset();
            router.push("/requests");
            alert("Request created successfully");
            setSuccess("Request created successfully");
        }
    };


    return (
        <>
            <div className="flex">
                <MapPicker location={location} onChange={setLocation} />
                <form id="edit-form" onSubmit={handleSubmit} className="mx-auto w-full p-10 max-w-lg dark:bg-gray-800 rounded-lg">
                    {success &&
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            {success}
                        </div>}
                    {error &&
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            {error}
                        </div>}
                    <div className="mb-5">
                        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Blood Type</label>
                        <select id="countries" name="blood_type"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value={""}>Choose a Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
                        <input type="text" name="quantity" id="base-input"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                        <input type="date" name="date_time" id="base-input"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Exact Location</label>
                        <input type="text" name="exact_location" id="base-input"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
                        <input type="text" name="contact_number" id="base-input"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Verification Photo</label>
                        <input type="file" name="verification_photo" id="base-input"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <p className="text-md mb-2">What to show?</p>
                        <div className="flex items-center mb-1">
                            <input id="default-checkbox" type="checkbox" defaultValue="name" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Name</label>
                        </div>
                        <div className="flex items-center mb-1">
                            <input id="default-checkbox" type="checkbox" defaultValue="verification_photo" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Verification Photo</label>
                        </div>
                        <div className="flex items-center mb-1">
                            <input id="default-checkbox" type="checkbox" defaultValue="address" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">User Address</label>
                        </div>
                        <div className="flex items-center">
                            <input readOnly checked id="checked-checkbox" type="checkbox" defaultValue="location" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Location</label>
                        </div>
                        <div className="flex items-center">
                            <input readOnly checked id="checked-checkbox" type="checkbox" defaultValue="quantity" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Quantity</label>
                        </div>
                        <div className="flex items-center">
                            <input readOnly checked id="checked-checkbox" type="checkbox" defaultValue="date" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Date</label>
                        </div>
                        <div className="flex items-center">
                            <input readOnly checked id="checked-checkbox" type="checkbox" defaultValue="contact_number" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Contact Number</label>
                        </div>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>


        </>
    )
}
