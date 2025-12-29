'use client';

import { useEffect, useState } from 'react';
import { User, PaginatedResponse } from '@/app/lib/definitions';
import { getAllUsers } from '@/app/lib/actions';

// Filter interface
interface FilterParams {
  search: string;
  will_donate: string;
  verified_as_donor: string;
  has_donated: string;
  last_donated: string;
  page: number;
}

export default function Page() {
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    will_donate: '',
    verified_as_donor: '',
    has_donated: '',
    last_donated: '',
    page: 1,
  });

  // Update individual filter
  const updateFilter = (key: keyof FilterParams, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const fetchData = async (filterParams: FilterParams = filters) => {
    setLoading(true);
    try {
      // Prepare API parameters
      const apiParams = {
        search: filterParams.search,
        will_donate: filterParams.will_donate,
        verified_as_donor: filterParams.verified_as_donor,
        has_donated: filterParams.has_donated,
        last_donated: filterParams.last_donated,
        page: filterParams.page,
      };

      // Remove empty parameters
      const cleanParams = Object.fromEntries(
        Object.entries(apiParams).filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined
        )
      );

      const response = await getAllUsers(cleanParams);
      if ('message' in response) {
        if (response.message) setError(response.message);
      } else {
        setData(response.data);
        setCurrentPage(response.data.current_page);
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle filter submission
  const handleFilterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to first page when filtering
    fetchData({ ...filters, page: 1 });
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: FilterParams = {
      search: '',
      will_donate: '',
      verified_as_donor: '',
      has_donated: '',
      last_donated: '',
      page: 1,
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    fetchData(clearedFilters);
  };

  // Handle page change
  const handleNextPage = () => {
    if (data?.next_page_url) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchData({ ...filters, page: newPage });
    }
  };

  const handlePrevPage = () => {
    if (data?.prev_page_url) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchData({ ...filters, page: newPage });
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    fetchData({ ...filters, page });
  };

  // Generate page numbers for pagination
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success]);

  // Filter Component
  const FilterSection = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filter Users
        </h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <form onSubmit={handleFilterSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Search Users
            </label>
            <input
              id="search"
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Willing to Donate */}
          <div>
            <label
              htmlFor="will_donate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Donation Willingness
            </label>
            <select
              id="will_donate"
              value={filters.will_donate}
              onChange={(e) => updateFilter('will_donate', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All</option>
              <option value="true">Willing to Donate</option>
              <option value="false">Not Willing</option>
            </select>
          </div>

          {/* Verified Donor */}
          <div>
            <label
              htmlFor="verified_as_donor"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Verification Status
            </label>
            <select
              id="verified_as_donor"
              value={filters.verified_as_donor}
              onChange={(e) =>
                updateFilter('verified_as_donor', e.target.value)
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>

          {/* Has Donated */}
          <div>
            <label
              htmlFor="has_donated"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Donation History
            </label>
            <select
              id="has_donated"
              value={filters.has_donated}
              onChange={(e) => updateFilter('has_donated', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All</option>
              <option value="true">Has Donated</option>
              <option value="false">Never Donated</option>
            </select>
          </div>
        </div>

        {/* Last Donated Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label
              htmlFor="last_donated"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Last Donated
            </label>
            <select
              id="last_donated"
              value={filters.last_donated}
              onChange={(e) => updateFilter('last_donated', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Any Time</option>
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="last_6_months">Last 6 Months</option>
              <option value="last_year">Last Year</option>
            </select>
          </div>

          <div className="flex items-end justify-end space-x-3">
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            >
              {loading ? 'Applying...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      </form>

      {/* Active Filters Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {filters.search && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Search: {filters.search}
            <button
              onClick={() => updateFilter('search', '')}
              className="ml-2 hover:text-blue-600 dark:hover:text-blue-300"
            >
              ×
            </button>
          </span>
        )}
        {filters.will_donate && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Willing: {filters.will_donate === 'true' ? 'Yes' : 'No'}
            <button
              onClick={() => updateFilter('will_donate', '')}
              className="ml-2 hover:text-green-600 dark:hover:text-green-300"
            >
              ×
            </button>
          </span>
        )}
        {filters.verified_as_donor && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Verified: {filters.verified_as_donor === 'true' ? 'Yes' : 'No'}
            <button
              onClick={() => updateFilter('verified_as_donor', '')}
              className="ml-2 hover:text-purple-600 dark:hover:text-purple-300"
            >
              ×
            </button>
          </span>
        )}
        {filters.has_donated && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Donated: {filters.has_donated === 'true' ? 'Yes' : 'No'}
            <button
              onClick={() => updateFilter('has_donated', '')}
              className="ml-2 hover:text-orange-600 dark:hover:text-orange-300"
            >
              ×
            </button>
          </span>
        )}
        {filters.last_donated && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            Last Donated: {filters.last_donated.replace(/_/g, ' ')}
            <button
              onClick={() => updateFilter('last_donated', '')}
              className="ml-2 hover:text-indigo-600 dark:hover:text-indigo-300"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 h-full w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Users Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage and view all registered users in the system
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
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
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <FilterSection />

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Donated
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Donation Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.data?.map((user, index) => {
                  const globalIndex =
                    (currentPage - 1) * data.per_page + index + 1;
                  return (
                    <tr
                      key={user.id.toString()}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {globalIndex}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.profile_photo ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${user.profile_photo}`}
                                alt={user.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user?.dob
                          ? new Date(user.dob).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs">
                        <div className="truncate" title={user.address}>
                          {user.address || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.phone_number || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user?.last_donated
                          ? new Date(user.last_donated).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.will_donate
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {user.will_donate ? 'Willing' : 'Not Willing'}
                          </span>
                          {user.verified_as_donor && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {}}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {}}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                            title="Edit User"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {}}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Delete User"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.total > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{data.from}</span> to{' '}
                <span className="font-medium">{data.to}</span> of{' '}
                <span className="font-medium">{data.total}</span> results
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handlePrevPage}
                  disabled={!data.prev_page_url}
                  className={`px-3 py-2 text-sm font-medium rounded-md border ${
                    !data.prev_page_url
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>

                {renderPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md border ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={handleNextPage}
                  disabled={!data.next_page_url}
                  className={`px-3 py-2 text-sm font-medium rounded-md border ${
                    !data.next_page_url
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  Next
                </button>
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300">
                {data.per_page} per page
              </div>
            </div>
          </div>
        )}

        {!loading && data?.data?.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {Object.values(filters).some(
                (filter) => filter !== '' && filter !== 1
              )
                ? 'Try adjusting your filters to see more results.'
                : 'No users have been registered yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {data && data.total > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {data.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Willing to Donate
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {data.data.filter((user) => user.will_donate).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Verified Donors
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {data.data.filter((user) => user.verified_as_donor).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active This Month
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {
                    data.data.filter((user) => {
                      const lastDonated = user.last_donated
                        ? new Date(user.last_donated)
                        : null;
                      const oneMonthAgo = new Date();
                      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                      return lastDonated && lastDonated > oneMonthAgo;
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
