"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { allBloodRequests, approveRequestApplication, deleteRequestApplication, updateRequestApplication } from "@/app/lib/actions";
import { BloodRequest, ExactLocation } from "@/app/lib/definitions";
import dynamic from "next/dynamic";
const MapPicker = dynamic(import('@/app/_components/MapPicker'), { ssr: false });
// import MapPicker from "@/app/_components/MapPicker";

type RequestApplicationResponse = {
    status: string;
    total?: number;
    data: BloodRequest[];
};


export default function Page() {
    const [data, setData] = useState<BloodRequest[]>();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const [viewRequest, setViewRequest] = useState<BloodRequest | null>(null);
    const [editRequest, setEditRequest] = useState<BloodRequest | null>(null);
    const [deleteRequest, setDeleteRequest] = useState<BloodRequest | null>(null);
    const [approveRequest, setApproveRequest] = useState<BloodRequest | null>(null);

    const [changeState, setChangeState] = useState(false);

    const [location, setLocation] = useState<ExactLocation>({
        lat: 0,
        lng: 0,
        city: '',
        country: '',
    });

    const router = useRouter();

    const fetchData = async () => {
        const res = await allBloodRequests();
        if ("message" in res) setError(res.message);
        else setData(res.data);
    };

    useEffect(() => {
        if (editRequest) setLocation({ lat: editRequest.latitude, lng: editRequest.longitude, city: editRequest.city, country: editRequest.country })
    }, [editRequest])

    useEffect(() => {
        fetchData();
    }, [success]);

    const closeModals = () => {
        setViewRequest(null);
        setEditRequest(null);
        setDeleteRequest(null);
        setApproveRequest(null);
    };

    const handleDelete = async (user_id: number | undefined) => {
        if (user_id) {
            const res = await deleteRequestApplication(user_id.toString());
            if ("message" in res) setError(res.message);
            else {
                setChangeState(!changeState);
                setSuccess("Successfully Deleted the Request application");
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setError('');
            setSuccess('');
        }, 2000)
    }, [error, success])

    const handleUpdate = async () => {
        const updateData: BloodRequest = {
            ...editRequest,
            status: editRequest?.status || "pending",
            latitude: location.lat,
            longitude: location.lng,
            city: location.country,
            country: location.city
        }

        if (!updateData.contact_number) return;

        // Then pass the formData to the updateRequestApplication function
        let res;
        if (updateData?.id) res = await updateRequestApplication(updateData);
        if (res && "message" in res) setError(res.message);
        else {
            setEditRequest(null);
            setSuccess("Successfully Updated Request Application!");
        }
    }

    const handleApprove = async (id: number | undefined) => {
        const approveData = {
            ...approveRequest,
            status: "approved",
            latitude: location.lat,
            longitude: location.lng,
            city: location.country,
            country: location.city
        }

        if (!approveData.contact_number) return;
        if (!id) return;
        const res = await approveRequestApplication(approveData);
        if ("message" in res) {
            setError(res.message);
            alert('Error! ' + res.message);
        }
        else {
            fetchData();
            setApproveRequest(null);
            setSuccess("Successfully Updated Request Application!");
        }
    }

    const handleEditChange = async (event: ChangeEvent<HTMLInputElement>) => {
        // handle on change of input for Edit Form
        const { name, value, type } = event.target;

        setEditRequest((editRequest) => {
            if (!editRequest) return editRequest;

            return {
                ...editRequest,
                [name]: type === "number" ? +value : value
            }
        })
    }

    return (
        <div className="p-5 h-full w-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Request Applications</h2>

            {error && <div className="bg-red-500 text-white px-4 py-2 mb-4 rounded">Error: {error}</div>}
            {success && <div className="bg-green-500 text-white px-4 py-2 mb-4 rounded">{success}</div>}

            <div className="overflow-x-auto border rounded border-gray-300 dark:border-gray-700">
                <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900">
                    <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-center">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Blood</th>
                            <th className="px-4 py-3">City</th>
                            <th className="px-4 py-3">Country</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((Request, index) => {
                            const statusValue = Request.verification_status?.toString() ?? "pending";
                            const statusLabel = statusValue;

                            return (
                                <tr key={index} className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 text-center">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{Request.blood_type}</td>
                                    <td className="px-4 py-2">{Request.city}</td>
                                    <td className="px-4 py-2">{Request.country}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${statusValue.toLowerCase() === "approved"
                                                ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                                                : statusValue.toLowerCase() === "rejected"
                                                    ? "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100"
                                                    : "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
                                                }`}
                                        >
                                            {statusLabel}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button onClick={() => setOpenDropdown(index)} className="text-white px-2 py-1 rounded bg-gray-700 hover:bg-gray-600">⋮</button>
                                        {openDropdown === index && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow z-20">
                                                <button onClick={() => { setViewRequest(Request); setOpenDropdown(null); }} className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">View</button>
                                                <button onClick={() => { setEditRequest(Request); setOpenDropdown(null); }} className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Edit</button>
                                                <button onClick={() => { setDeleteRequest(Request); setOpenDropdown(null); }} className="w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">Delete</button>
                                                <button onClick={() => { setApproveRequest(Request); setOpenDropdown(null); }} className="w-full px-4 py-2 text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700">Approve</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>


            {/* View Modal */}
            {viewRequest && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center md:ps-50 items-center">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded max-w-3xl w-full">
                        <h3 className="text-lg font-bold mb-4">Request Details</h3>
                        <p><strong>Contact:</strong> {viewRequest.contact_number}</p>
                        <p><strong>Blood Type:</strong> {viewRequest.blood_type}</p>
                        <p><strong>Address:</strong> {viewRequest.exact_location}, {viewRequest.city}, {viewRequest.country}</p>
                        <p><strong>Verification Status:</strong> {viewRequest.verification_status}</p>
                        <div className="mt-4">
                            <MapPicker
                                location={{ lat: viewRequest.latitude, lng: viewRequest.longitude, city: viewRequest.city, country: viewRequest.country }}
                                onChange={() => { }}
                                radius={null}
                                height="400px"
                                width="100%"
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={closeModals} className="px-4 py-2 bg-gray-700 text-white rounded">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editRequest && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center md:ps-50 items-center max-h-screen overflow-y-scroll p-2">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded max-w-3xl w-full">
                        <h3 className="text-lg font-bold mb-4">Edit Request</h3>
                        {/* You can bind these inputs to form state later */}
                        <div className="flex flex-wrap">
                            <div className="formelement w-1/2 p-2">
                                <input value={editRequest.contact_number ?? 9812345678} type="number" onChange={handleEditChange} name="contact_number" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
                            </div>
                            <div className="formelement w-1/2 p-2">
                                <input value={editRequest.exact_location ?? ''} name="exact_location" onChange={handleEditChange} className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
                            </div>
                            <div className="formelement w-1/2 p-2">
                                <input value={editRequest.blood_type ?? ''} name="blood_type" onChange={handleEditChange} className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
                            </div>
                            <div className="formelement w-1/2 p-2">
                                <input value={editRequest.verification_status ?? ''} onChange={handleEditChange} name="verification_status" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
                            </div>
                        </div>
                        <MapPicker
                            location={location}
                            // onChange={(loc) => {
                            //   // Update local state here if needed
                            // }}
                            onChange={setLocation}
                            radius={null}
                            height="400px"
                            width="100%"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={closeModals} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                            <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approve Model */}
            {approveRequest && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Approve Request</h3>
                        <p>Are you sure you want to approve <strong>{approveRequest.user?.name}</strong>?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={closeModals} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                            {approveRequest.user_id &&
                                <button onClick={() => handleApprove(approveRequest.user_id)} className="px-4 py-2 bg-green-600 text-white rounded">Approve</button>
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteRequest && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                        <p>Are you sure you want to delete <strong>{deleteRequest.contact_number}</strong>?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={closeModals} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                            {deleteRequest.user_id &&
                                <button onClick={() => handleDelete(deleteRequest.user_id)} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
