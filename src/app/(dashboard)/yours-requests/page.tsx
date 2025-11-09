'use client';

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  myBloodRequests,
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

interface FilterParams {
  search: string;
  blood_type: string;
  verification_status: string;
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

  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    blood_type: '',
    verification_status: '',
    page: 1,
  });

  const router = useRouter();

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
      const apiParams = {
        search: filterParams.search,
        blood_type: filterParams.blood_type,
        verification_status: filterParams.verification_status,
        page: filterParams.page,
      };

      const cleanParams = Object.fromEntries(
        Object.entries(apiParams).filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined
        )
      );

      const res = await myBloodRequests(cleanParams);
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

  const handleFilterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1);
    let search_text = document.getElementById(
      'search_text_box123'
    ) as HTMLInputElement;
    updateFilter('search', search_text.value);
    fetchData({ ...filters, page: 1 });
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterParams = {
      search: '',
      blood_type: '',
      verification_status: '',
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
    if (user_id) {
      const res = await deleteRequestApplication(user_id.toString());
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
  };

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

  const FilterSection = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-col sm:flex-row gap-4 items-end"
      >
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              id="search_text_box123"
              type="text"
              defaultValue={filters.search}
              placeholder="Search requests..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Blood Type
            </label>
            <select
              value={filters.blood_type}
              onChange={(e) => updateFilter('blood_type', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filters.verification_status}
              onChange={(e) =>
                updateFilter('verification_status', e.target.value)
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Applying...
              </>
            ) : (
              'Apply'
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Blood Requests
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your blood donation requests
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
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
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
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

      {/* Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600 dark:text-gray-400">
            Loading requests...
          </p>
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search filters or create a new request.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((request, index) => {
            const globalIndex = (currentPage - 1) * data.per_page + index + 1;
            const statusValue =
              request.verification_status?.toString() ?? 'pending';

            return (
              <div
                key={request.id?.toString()}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Request #{globalIndex.toString().padStart(3, '0')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {request.created_at &&
                        new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={statusValue} />
                </div>

                {/* Blood Type */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800">
                    {request.blood_type}
                  </span>
                </div>

                {/* Patient Info */}
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.user?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {request.contact_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {request.city}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {request.country}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Quantity</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {request.quantity} units
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Required Date
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {request.date_time
                        ? new Date(request.date_time).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
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
                  </div>
                  <div className="flex space-x-2">
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
      )}

      {/* Modals (View, Edit, Approve, Delete) remain the same as in your original code */}
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
                        src={
                          'http://localhost:8000/storage/' +
                          viewRequest.verification_photo.path
                        }
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
