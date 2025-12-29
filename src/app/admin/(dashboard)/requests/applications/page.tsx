'use client';

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  allBloodRequests,
  approveRequestApplication,
  deleteRequestApplication,
  updateRequestApplication,
} from '@/app/lib/actions';
import {
  BloodRequest,
  ExactLocation,
  PaginatedResponse,
} from '@/app/lib/definitions';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(import('@/app/_components/MapPicker'), {
  ssr: false,
});

// Filter interface
interface FilterParams {
  search: string;
  blood_type: string;
  verification_status: string;
  city: string;
  country: string;
  date_range: string;
  page: number;
}

export default function Page() {
  const [data, setData] = useState<PaginatedResponse<BloodRequest> | null>(
    null
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [viewRequest, setViewRequest] = useState<BloodRequest | null>(null);
  const [editRequest, setEditRequest] = useState<BloodRequest | null>(null);
  const [deleteRequest, setDeleteRequest] = useState<BloodRequest | null>(null);
  const [approveRequest, setApproveRequest] = useState<BloodRequest | null>(
    null
  );

  const [location, setLocation] = useState<ExactLocation>({
    lat: 0,
    lng: 0,
    city: '',
    country: '',
  });

  // Filter states
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    blood_type: '',
    verification_status: '',
    city: '',
    country: '',
    date_range: '',
    page: 1,
  });

  const router = useRouter();

  // Update individual filter
  const updateFilter = useCallback(
    (key: keyof FilterParams, value: string | number) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const fetchData = async (filterParams: FilterParams = filters) => {
    setLoading(true);
    try {
      // Prepare API parameters
      const apiParams = {
        search: filterParams.search,
        blood_type: filterParams.blood_type,
        verification_status: filterParams.verification_status,
        city: filterParams.city,
        country: filterParams.country,
        date_range: filterParams.date_range,
        page: filterParams.page,
      };

      // Remove empty parameters
      const cleanParams = Object.fromEntries(
        Object.entries(apiParams).filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined
        )
      );

      const res = await allBloodRequests(cleanParams);
      if ('message' in res) {
        if (res.message) setError(res.message);
      } else {
        setData(res.data);
        setCurrentPage(res.data.current_page);
      }
    } catch (err) {
      setError('Failed to fetch blood requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editRequest)
      setLocation({
        lat: editRequest.latitude,
        lng: editRequest.longitude,
        city: editRequest.city,
        country: editRequest.country,
      });
  }, [editRequest]);

  useEffect(() => {
    fetchData();
  }, [success]);

  // Handle filter submission
  const handleFilterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to first page when filtering
    let search_text = document.getElementById(
      'search_text_box123'
    ) as HTMLInputElement;
    updateFilter('search', search_text.value);
    fetchData({ ...filters, page: 1 });
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: FilterParams = {
      search: '',
      blood_type: '',
      verification_status: '',
      city: '',
      country: '',
      date_range: '',
      page: 1,
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    fetchData(clearedFilters);
  };

  const closeModals = () => {
    setViewRequest(null);
    setEditRequest(null);
    setDeleteRequest(null);
    setApproveRequest(null);
  };

  const handleDelete = async (user_id: number | undefined) => {
    if (deleteRequest?.id) {
      const res = await deleteRequestApplication(deleteRequest.id?.toString());
      if ('message' in res) setError(res.message);
      else {
        setSuccess('Request application deleted successfully');
        closeModals();
        fetchData();
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleUpdate = async () => {
    if (!editRequest?.contact_number) {
      setError('Contact number is required');
      return;
    }

    const updateData: BloodRequest = {
      ...editRequest,
      status: editRequest?.status || 'pending',
      latitude: location.lat,
      longitude: location.lng,
      city: location.city,
      country: location.country,
    };

    let res;
    if (updateData?.id) res = await updateRequestApplication(updateData);
    if (res && 'message' in res) setError(res.message);
    else {
      setEditRequest(null);
      setSuccess('Request application updated successfully');
      fetchData();
    }
  };

  const handleApprove = async (id: number | undefined) => {
    if (!id) return;

    const approveData = {
      ...approveRequest,
      status: 'approved',
      latitude: location.lat,
      longitude: location.lng,
      city: location.city,
      country: location.country,
    };

    const res = await approveRequestApplication(approveData);
    if ('message' in res) {
      setError(res.message);
      console.log(res);
    } else {
      setApproveRequest(null);
      setSuccess('Request application approved successfully');
      fetchData();
    }
  };

  const handleEditChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    setEditRequest((editRequest) => {
      if (!editRequest) return editRequest;

      return {
        ...editRequest,
        [name]: type === 'number' ? +value : value,
      };
    });

    fetchData();
  };

  // Pagination functions
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

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      approved: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-800',
        dot: 'bg-green-500',
      },
      rejected: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-800',
        dot: 'bg-red-500',
      },
      pending: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-200 dark:border-yellow-800',
        dot: 'bg-yellow-500',
      },
    };

    const config =
      statusConfig[status.toLowerCase() as keyof typeof statusConfig] ||
      statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <span className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Action button component
  const ActionButton = ({
    onClick,
    icon,
    title,
    color = 'gray',
  }: {
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    color?: 'blue' | 'green' | 'red' | 'gray';
  }) => {
    const colorClasses = {
      blue: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
      green:
        'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300',
      red: 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300',
      gray: 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300',
    };

    return (
      <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${colorClasses[color]}`}
        title={title}
      >
        {icon}
      </button>
    );
  };

  // Enhanced Filter Component
  const FilterSection = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filter Requests
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Refine your search using the filters below
          </p>
        </div>
        <button
          onClick={handleClearFilters}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          Clear All
        </button>
      </div>

      <form onSubmit={handleFilterSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Search Requests
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                id="search_text_box123"
                type="text"
                defaultValue={filters.search}
                placeholder="Search by contact, location, name..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Blood Type */}
          <div>
            <label
              htmlFor="blood_type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Blood Type
            </label>
            <select
              id="blood_type"
              value={filters.blood_type}
              onChange={(e) => updateFilter('blood_type', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Blood Types</option>
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

          {/* Verification Status */}
          <div>
            <label
              htmlFor="verification_status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Status
            </label>
            <select
              id="verification_status"
              value={filters.verification_status}
              onChange={(e) =>
                updateFilter('verification_status', e.target.value)
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Date Range */}
          <div>
            <label
              htmlFor="date_range"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Date Range
            </label>
            <select
              id="date_range"
              value={filters.date_range}
              onChange={(e) => updateFilter('date_range', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {data && `Found ${data.total} requests`}
          </div>
          <div className="flex items-center space-x-3">
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
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Applying...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Apply Filters
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Active Filters Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {Object.entries(filters).map(([key, value]) => {
          if (!value || key === 'page') return null;

          const filterLabels: { [key: string]: string } = {
            search: 'Search',
            blood_type: 'Blood Type',
            verification_status: 'Status',
            city: 'City',
            country: 'Country',
            date_range: 'Date Range',
          };

          return (
            <span
              key={key}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {filterLabels[key]}: {value}
              <button
                onClick={() => updateFilter(key as keyof FilterParams, '')}
                className="ml-2 hover:text-blue-600 dark:hover:text-blue-300 text-sm"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-6 h-full w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Blood Request Applications
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and review blood donation requests from patients
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {data && `Total: ${data.total} requests`}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center animate-fade-in">
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
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center animate-fade-in">
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

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Blood Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Loading requests...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <svg
                        className="w-16 h-16 mb-4 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No requests found
                      </h3>
                      <p className="text-sm">
                        Try adjusting your search filters or create a new
                        request.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.data?.map((request, index) => {
                  const globalIndex =
                    (currentPage - 1) * data.per_page + index + 1;
                  const statusValue =
                    request.verification_status?.toString() ?? 'pending';

                  return (
                    <tr
                      key={request.id?.toString()}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          #{globalIndex.toString().padStart(3, '0')}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.created_at &&
                            new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800">
                          {request.blood_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.user?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.contact_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {request.city}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={statusValue} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <ActionButton
                            onClick={() => setViewRequest(request)}
                            icon={
                              <svg
                                className="w-4 h-4"
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
                            }
                            title="View Details"
                            color="blue"
                          />
                          <ActionButton
                            onClick={() => setEditRequest(request)}
                            icon={
                              <svg
                                className="w-4 h-4"
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
                            }
                            title="Edit Request"
                            color="gray"
                          />
                          <ActionButton
                            onClick={() => setApproveRequest(request)}
                            icon={
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            }
                            title="Approve Request"
                            color="green"
                          />
                          <ActionButton
                            onClick={() => setDeleteRequest(request)}
                            icon={
                              <svg
                                className="w-4 h-4"
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
                            }
                            title="Delete Request"
                            color="red"
                          />
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
                Showing <span className="font-semibold">{data.from}</span> to{' '}
                <span className="font-semibold">{data.to}</span> of{' '}
                <span className="font-semibold">{data.total}</span> results
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={!data.prev_page_url}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    !data.prev_page_url
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {renderPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border min-w-[40px] ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!data.next_page_url}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    !data.next_page_url
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto mt-[76px]">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModals}
            ></div>

            <div className="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Request Details - #
                      {viewRequest.id?.toString().padStart(3, '0')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Complete information about the blood request
                    </p>
                  </div>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Verification Photo */}
                {viewRequest.verification_photo?.path && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Verification Photo
                    </label>
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${viewRequest.verification_photo.path}`}
                        alt="Verification"
                        className="max-w-full h-auto max-h-64 rounded-lg mx-auto shadow-sm"
                      />
                    </div>
                  </div>
                )}

                {/* viewRequest Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Blood Type
                      </label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800">
                        {viewRequest.blood_type}
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Quantity Required
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {viewRequest.quantity} units
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Date & Time Required
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {viewRequest.date_time
                          ? new Date(viewRequest.date_time).toLocaleString()
                          : 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Contact Number
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {viewRequest.contact_number}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Verification Status
                      </label>
                      <StatusBadge
                        status={viewRequest.verification_status || 'pending'}
                      />
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Patient Name
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {viewRequest.user?.name || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Exact Location
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {viewRequest.exact_location}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        City & Country
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {viewRequest.city}, {viewRequest.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Map */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Location Map
                  </label>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    <MapPicker
                      location={{
                        lat: viewRequest.latitude,
                        lng: viewRequest.longitude,
                        city: viewRequest.city,
                        country: viewRequest.country,
                      }}
                      onChange={() => {}}
                      radius={null}
                      height="300px"
                      width="100%"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Created Date
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {viewRequest.created_at
                        ? new Date(viewRequest.created_at).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Last Updated
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {viewRequest.updated_at
                        ? new Date(viewRequest.updated_at).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end">
                <button
                  onClick={closeModals}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500 transition-colors"
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
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModals}
            ></div>

            <div className="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Edit Request
                  </h3>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="number"
                      name="contact_number"
                      value={editRequest.contact_number || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blood Type
                    </label>
                    <select
                      name="blood_type"
                      value={editRequest.blood_type || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                    >
                      <option value="">Select Blood Type</option>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Exact Location
                    </label>
                    <input
                      type="text"
                      name="exact_location"
                      value={editRequest.exact_location || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                      placeholder="Enter exact location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="verification_status"
                      value={editRequest.verification_status || 'pending'}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Location Map
                  </label>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    <MapPicker
                      location={location}
                      onChange={setLocation}
                      radius={null}
                      height="300px"
                      width="100%"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end space-x-3">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
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
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModals}
            ></div>

            <div className="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Approve Request
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to approve the request from{' '}
                  <strong>{approveRequest.user?.name}</strong>?
                </p>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={closeModals}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApprove(approveRequest.user_id)}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto mt-76px">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModals}
            ></div>

            <div className="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                  <svg
                    className="h-6 w-6 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Confirm Deletion
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete the request from{' '}
                  <strong>{deleteRequest.contact_number}</strong>? This action
                  cannot be undone.
                </p>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={closeModals}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteRequest.user_id)}
                    className="px-6 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
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
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
