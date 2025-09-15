"use client";

import { useEffect, useState } from "react";
import { User } from "@/app/lib/definitions";
import { getAllUsers } from "@/app/lib/actions";
// import MapPicker from "@/app/_components/MapPicker";

export default function Page() {
    const [data, setData] = useState<User[] | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    useEffect(()=>{
        const fetchData = async () => {
            const response = await getAllUsers();
            if ("message" in response){
                setError(response.message);
            }
            else {
                // console.log(response);
                setData(response.data);
            }
        }
        fetchData();
    }, [])


    return (
        <>
            <div className="p-5 h-full w-full">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Users</h2>

                {error && <div className="bg-red-500 text-white px-4 py-2 mb-4 rounded">Error: {error}</div>}
                {success && <div className="bg-green-500 text-white px-4 py-2 mb-4 rounded">{success}</div>}

                <div className="overflow-x-auto border rounded border-gray-300 dark:border-gray-700">
                    <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900">
                        <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-center">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">DOB</th>
                                <th className="px-4 py-3">Address</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Last Donated</th>
                                <th className="px-4 py-3">Will Donate</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((user, index) => {
                                return (
                                    <tr key={index} className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 text-center">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{user?.name}</td>
                                        <td className="px-4 py-2">{user?.dob.toString().split('T')[0]}</td>
                                        <td className="px-4 py-2">{user?.address}</td>
                                        <td className="px-4 py-2">{user?.phone_number}</td>
                                        <td className="px-4 py-2">{user?.last_donated?.toString()}</td>
                                        <td className="px-4 py-2">{user?.will_donate? 'Yes': 'No'}</td>
                                        <td className="px-4 py-2">
                                            <button onClick={() => setOpenDropdown(index)} className="text-white px-2 py-1 rounded bg-gray-700 hover:bg-gray-600">⋮</button>
                                            {openDropdown === index && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow z-20">
                                                    <button onClick={() => { setOpenDropdown(null); }} className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">View</button>
                                                    <button onClick={() => { setOpenDropdown(null); }} className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Edit</button>
                                                    <button onClick={() => { setOpenDropdown(null); }} className="w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">Delete</button>
                                                    <button className="w-full px-4 py-2 text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700">Approve</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
