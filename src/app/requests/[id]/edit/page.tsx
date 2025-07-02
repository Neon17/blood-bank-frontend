"use client"
import MapPicker from "@/app/_components/MapPicker";
import { bloodRequest, deleteBloodRequest, updateBloodRequest } from "@/app/lib/actions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditRequest() {
    const params = useParams();
    const id = params.id as string;
    const [location, setLocation] = useState({
        lat: 27.7172,
        lng: 85.3240,
        city: 'Kathmandu',
        country: 'Nepal'
    })
    const [data, setData] = useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchData = async () => {
        console.log(`id = ${id}`);
        const res = await bloodRequest(id);
        if (res.status === 'error') {
            setError(res.message);
            console.error(res.message);
            return;
        }
        setData(res.data);
        console.log(res.data);
    }

    useEffect(() => {

    }, [data]);

    useEffect(() => {
        fetchData();
    }, [params.id]);

    const handleDelete = async () => {
        const response = await deleteBloodRequest(id);
        if (response.status === 'error') {
            setError(response.message);
            console.error(response.message);
        }
        else {
            setSuccess('Request deleted successfully');
        }
    }

    const handleSubmit = async (formData: FormData, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formData.append("city", location.city);
        formData.append("country", location.country);
        formData.append("lat", location.lat.toString());
        formData.append("lng", location.lng.toString());

        const response = await updateBloodRequest(id, formData);

        if (response.status === "error") {
            setError(response.message);
            console.error(response.message);
        } else {
            e.currentTarget.reset();
            fetchData();
            setSuccess("Request updated successfully");
        }
    };


    return (
        <>
            <div className="flex max-w-7xl mx-auto p-3 justify-center items-center">
                <MapPicker location={location} onChange={setLocation} />
                <form id="edit-form" onSubmit={(e) => {
                    const formData = new FormData(e.currentTarget);
                    handleSubmit(formData, e);
                }}  className="mx-auto w-full p-10 max-w-lg rounded-lg">
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
                        <select name="blood_type" id="countries" value={data?.blood_type} onChange={(e) => setData({ ...data, blood_type: e.target.value })}
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
                        <input type="text" name="quantity" id="base-input" defaultValue={data?.quantity}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                        <input type="date" name="date_time" id="base-input" defaultValue={data?.date_time}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Exact Location</label>
                        <input type="text" name="exact_location" id="base-input" defaultValue={data?.exact_location}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
                        <input type="text" name="contact_number" id="base-input" defaultValue={data?.contact_number}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Verification Photo</label>
                        <input type="file" id="base-input" defaultValue={data?.verification_photo}
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
                    <button type="submit" className="text-white bg-blue-700 hover:cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
                    <button type="button" onClick={handleDelete} className="mx-2 hover:cursor-pointer focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                </form>
            </div>


        </>
    )
}
