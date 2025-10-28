"use client";

import { useEffect, useState } from "react";
import { User, PaginatedResponse } from "@/app/lib/definitions";
import { getAllUsers } from "@/app/lib/actions";

export default function Page() {
    const [data, setData] = useState<PaginatedResponse<User> | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            const response = await getAllUsers({ page });
            if ("message" in response) {
                if (response.message) setError(response.message);
            } else {
                setData(response.data);
                setCurrentPage(response.data.current_page);
            }
        } catch (err) {
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

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

    // Generate page numbers for pagination
    const renderPageNumbers = () => {
        if (!data) return [];

        const pages = [];
        const totalPages = data.last_page;
        const current = currentPage;

        // Show first page, last page, and pages around current page
        let startPage = Math.max(1, current - 2);
        let endPage = Math.min(totalPages, current + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (<>
        <div className="p-5 h-full w-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Users</h2>

            {error && <div className="bg-red-500 text-white px-4 py-2 mb-4 rounded">Error: {error}</div>}
            {success && <div className="bg-green-500 text-white px-4 py-2 mb-4 rounded">{success}</div>}

            <div className="overflow-x-auto border rounded border-gray-300 dark:border-gray-700 mb-4">
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
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-4 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : data?.data?.map((user, index) => {
                            const globalIndex = (currentPage - 1) * data.per_page + index + 1;
                            return (
                                <tr key={user.id.toString()} className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 text-center">
                                    <td className="px-4 py-2">{globalIndex}</td>
                                    <td className="px-4 py-2">{user?.name}</td>
                                    <td className="px-4 py-2">{user?.dob?.toString().split('T')[0]}</td>
                                    <td className="px-4 py-2">{user?.address}</td>
                                    <td className="px-4 py-2">{user?.phone_number}</td>
                                    <td className="px-4 py-2">{user?.last_donated?.toString().split('T')[0]}</td>
                                    <td className="px-4 py-2">{user?.will_donate ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-2 relative">
                                        <button
                                            onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                                            className="text-white px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                                        >
                                            ⋮
                                        </button>
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

            {/* Pagination Controls */}
            {data && data.total > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Page Info */}
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Showing {data.from.toString()} to {data.to} of {data.total} results
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        <button
                            onClick={handlePrevPage}
                            disabled={!data.prev_page_url}
                            className={`px-3 py-1 rounded border ${!data.prev_page_url
                                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex gap-1">
                            {renderPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageClick(page)}
                                    className={`px-3 py-1 rounded border ${currentPage === page
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={handleNextPage}
                            disabled={!data.next_page_url}
                            className={`px-3 py-1 rounded border ${!data.next_page_url
                                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                        >
                            Next
                        </button>
                    </div>

                    {/* Per Page Selector (Optional) */}
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        {data.per_page} per page
                    </div>
                </div>
            )}

            {!loading && data?.data?.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No users found.
                </div>
            )}
        </div>
    </>)
}