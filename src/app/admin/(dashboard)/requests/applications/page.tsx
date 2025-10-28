"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { allBloodRequests, approveRequestApplication, deleteRequestApplication, updateRequestApplication } from "@/app/lib/actions";
import { BloodRequest, ExactLocation, PaginatedResponse } from "@/app/lib/definitions";
import dynamic from "next/dynamic";
const MapPicker = dynamic(import('@/app/_components/MapPicker'), { ssr: false });

export default function Page() {
    const [data, setData] = useState<PaginatedResponse<BloodRequest> | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [viewRequest, setViewRequest] = useState<BloodRequest | null>(null);
    const [editRequest, setEditRequest] = useState<BloodRequest | null>(null);
    const [deleteRequest, setDeleteRequest] = useState<BloodRequest | null>(null);
    const [approveRequest, setApproveRequest] = useState<BloodRequest | null>(null);

    const [location, setLocation] = useState<ExactLocation>({
        lat: 0,
        lng: 0,
        city: '',
        country: '',
    });

    const router = useRouter();

    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            const res = await allBloodRequests({ page });
            if ("message" in res) {
                if (res.message) setError(res.message);
            } else {
                setData(res.data);
                setCurrentPage(res.data.current_page);
            }
        } catch (err) {
            setError("Failed to fetch blood requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (editRequest) setLocation({
            lat: editRequest.latitude,
            lng: editRequest.longitude,
            city: editRequest.city,
            country: editRequest.country
        });
    }, [editRequest]);

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
                setSuccess("Successfully deleted the request application");
                closeModals();
                fetchData();
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
            setSuccess('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [error, success]);

    const handleUpdate = async () => {
        if (!editRequest?.contact_number) {
            setError("Contact number is required");
            return;
        }

        const updateData: BloodRequest = {
            ...editRequest,
            status: editRequest?.status || "pending",
            latitude: location.lat,
            longitude: location.lng,
            city: location.city,
            country: location.country
        };

        let res;
        if (updateData?.id) res = await updateRequestApplication(updateData);
        if (res && "message" in res) setError(res.message);
        else {
            setEditRequest(null);
            setSuccess("Successfully updated request application!");
            fetchData();
        }
    };

    const handleApprove = async (id: number | undefined) => {
        if (!id) return;

        const approveData = {
            ...approveRequest,
            status: "approved",
            latitude: location.lat,
            longitude: location.lng,
            city: location.city,
            country: location.country
        };

        const res = await approveRequestApplication(approveData);
        if ("message" in res) {
            setError(res.message);
        } else {
            setApproveRequest(null);
            setSuccess("Successfully approved request application!");
            fetchData();
        }
    };

    const handleEditChange = async (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = event.target;

        setEditRequest((editRequest) => {
            if (!editRequest) return editRequest;

            return {
                ...editRequest,
                [name]: type === "number" ? +value : value
            };
        });
    };

    // Pagination functions
    const handleNextPage = () => {
        if (data?.next_page_url) {
            fetchData(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (data?.prev_page_url) {
            fetchData(currentPage - 1);
        }
    };

    const handlePageClick = (page: number) => {
        fetchData(page);
    };

    const renderPageNumbers = () => {
        if (!data) return [];

        const pages = [];
        const totalPages = data.last_page;
        const current = currentPage;

        let startPage = Math.max(1, current - 2);
        let endPage = Math.min(totalPages, current + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="p-6 h-full w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Blood Request Applications</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and review blood donation requests</p>
            </div>

            {/* Alerts */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-green-700">{success}</p>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Blood Type</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">City</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Country</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data?.data?.map((request, index) => {
                                const globalIndex = (currentPage - 1) * data.per_page + index + 1;
                                const statusValue = request.verification_status?.toString() ?? "pending";

                                return (
                                    <tr key={request.id?.toString()} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {globalIndex}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                {request.blood_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {request.city}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {request.country}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusValue.toLowerCase() === "approved"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                    : statusValue.toLowerCase() === "rejected"
                                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                }`}>
                                                {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setViewRequest(request)}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                    title="View Details"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setEditRequest(request)}
                                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteRequest(request)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setApproveRequest(request)}
                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                                    title="Approve"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data && data.total > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span className="font-medium">{data.from}</span> to <span className="font-medium">{data.to}</span> of{" "}
                                <span className="font-medium">{data.total}</span> results
                            </div>

                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={!data.prev_page_url}
                                    className={`px-3 py-2 text-sm font-medium rounded-md border ${!data.prev_page_url
                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    Previous
                                </button>

                                {renderPageNumbers().map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageClick(page)}
                                        className={`px-3 py-2 text-sm font-medium rounded-md border ${currentPage === page
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={handleNextPage}
                                    disabled={!data.next_page_url}
                                    className={`px-3 py-2 text-sm font-medium rounded-md border ${!data.next_page_url
                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && data?.data?.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No requests found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new blood request.</p>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {viewRequest && (
                <div className="fixed inset-0 z-50 overflow-y-auto mt-[76px]">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModals}></div>

                        <div className="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Details</h3>
                            </div>

                            <div className="px-6 py-4 space-y-4">
                                {viewRequest.verification_photo?.path && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Verification Photo</label>
                                        <img
                                            src={'http://localhost:8000/storage/' + viewRequest.verification_photo.path}
                                            alt="Verification"
                                            className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Number</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewRequest.contact_number}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Blood Type</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewRequest.blood_type}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewRequest.exact_location}, {viewRequest.city}, {viewRequest.country}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification Status</label>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${viewRequest.verification_status?.toLowerCase() === "approved"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : viewRequest.verification_status?.toLowerCase() === "rejected"
                                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                            }`}>
                                            {viewRequest.verification_status}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                                    <MapPicker
                                        location={{ lat: viewRequest.latitude, lng: viewRequest.longitude, city: viewRequest.city, country: viewRequest.country }}
                                        onChange={() => { }}
                                        radius={null}
                                        height="300px"
                                        width="100%"
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end">
                                <button
                                    onClick={closeModals}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editRequest && (
                <div className="fixed inset-0 z-50 overflow-y-auto mt-[76px]">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModals}></div>

                        <div className="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Request</h3>
                            </div>

                            <div className="px-6 py-4 space-y-6 max-h-96 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number</label>
                                        <input
                                            type="number"
                                            name="contact_number"
                                            value={editRequest.contact_number || ''}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Type</label>
                                        <input
                                            type="text"
                                            name="blood_type"
                                            value={editRequest.blood_type || ''}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exact Location</label>
                                        <input
                                            type="text"
                                            name="exact_location"
                                            value={editRequest.exact_location || ''}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                        <select
                                            name="verification_status"
                                            value={editRequest.verification_status || 'pending'}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location Map</label>
                                    <MapPicker
                                        location={location}
                                        onChange={setLocation}
                                        radius={null}
                                        height="300px"
                                        width="100%"
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                                <button
                                    onClick={closeModals}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Approve Modal */}
            {approveRequest && (
                <div className="fixed inset-0 z-50 overflow-y-auto mt-[76px]">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModals}></div>

                        <div className="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Approve Request</h3>
                            </div>

                            <div className="px-6 py-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Are you sure you want to approve the request from <strong>{approveRequest.user?.name}</strong>?
                                </p>
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                                <button
                                    onClick={closeModals}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleApprove(approveRequest.user_id)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteRequest && (
                <div className="fixed inset-0 z-50 overflow-y-auto mt-[76px]">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModals}></div>

                        <div className="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Deletion</h3>
                            </div>

                            <div className="px-6 py-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Are you sure you want to delete the request from <strong>{deleteRequest.contact_number}</strong>? This action cannot be undone.
                                </p>
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                                <button
                                    onClick={closeModals}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteRequest.user_id)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}