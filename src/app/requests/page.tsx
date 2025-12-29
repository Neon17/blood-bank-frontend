'use client';

import { useEffect, useState } from 'react';
import ActionDropdown from '../_components/ActionDropdown';
import { bloodRequests } from '../lib/actions';
import {
  BloodRequest,
  BloodRequestPaginatedResponse,
  ExactLocation,
} from '../lib/definitions';
import SearchRadiusSlider from '../_components/SearchRadiusSlider';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import MapPicker to avoid SSR issues
const MapPicker = dynamic(() => import('@/app/_components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
      <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
    </div>
  ),
});

// Pagination interface matching Laravel response structure
interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export default function Requests() {
  const [data, setData] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState<number>(1);
  const [searchBloodType, setSearchBloodType] = useState<string>('');
  const [location, setLocation] = useState<ExactLocation>({
    lat: 27.7172,
    lng: 85.324,
    city: 'Kathmandu',
    country: 'Nepal',
  });
  const [locations, setLocations] = useState<ExactLocation[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleRequests = (
    res:
      | BloodRequestPaginatedResponse
      | { status: 'error'; message: string; errors?: any }
  ) => {
    if (res && 'data' in res && res?.data) {
      setData(res.data.data || res.data);
      setPagination(res.data);

      const requestsData = res.data.data || res.data;
      setLocations(
        requestsData.map((request: BloodRequest) => ({
          lat: request.latitude,
          lng: request.longitude,
          city: request.city,
          country: request.country,
          label: {
            name: request.user?.name,
            contact_number: request.contact_number,
            blood_type: request.blood_type,
            date: request.date_time,
            quantity: request.quantity,
          },
        }))
      );
    } else {
      console.error('Failed to load requests', res);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const res = await bloodRequests();
        if (res && 'data' in res && res?.data) {
          handleRequests(res);
        }
      } catch (err) {
        console.error('Failed to load requests', err);
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const preparedData = {
      latitude: location.lat,
      longitude: location.lng,
      radius: searchRadius,
      page: currentPage,
      blood_type: searchBloodType,
    };

    try {
      const data = await bloodRequests(preparedData);
      if ('data' in data) {
        handleRequests(data);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (page < 1 || (pagination && page > pagination.last_page)) return;

    setIsLoading(true);
    setCurrentPage(page);

    const preparedData = {
      latitude: location.lat,
      longitude: location.lng,
      radius: searchRadius,
      page: page,
    };

    try {
      const data = await bloodRequests(preparedData);
      if ('data' in data) {
        handleRequests(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Page change failed:', error);
      setIsLoading(false);
    }
  };

  // Pagination Component with Dark Theme Support
  const Pagination = () => {
    if (!pagination || pagination.last_page <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.last_page}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{pagination.from}</span> to{' '}
              <span className="font-medium">{pagination.to}</span> of{' '}
              <span className="font-medium">{pagination.total}</span> results
            </p>
          </div>
          <div>
            <nav
              className="inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 dark:text-gray-500 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="sr-only">Previous</span>
                &larr;
              </button>

              {/* Page numbers */}
              {Array.from(
                { length: pagination.last_page },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'z-10 bg-red-50 dark:bg-red-900 border-red-500 text-red-600 dark:text-red-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.last_page}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 dark:text-gray-500 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="sr-only">Next</span>
                &rarr;
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="grid grid-cols-1 lg:flex justify-end w-full">
        {/* Left: Map Section */}
        <div className="h-full w-full fixed overflow-hidden border-r border-gray-200 dark:border-gray-700">
          <MapPicker
            location={location}
            locations={locations}
            onChange={setLocation}
            radius={searchRadius}
            width="100%"
            height="100%"
          />
        </div>

        {/* Right: Content Panel */}
        <div className="h-full lg:w-1/2 flex flex-col bg-white dark:bg-gray-900 z-[300]">
          <div className="text-center mt-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Blood Requests
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Find and respond to urgent blood needs in your area
            </p>
          </div>

          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700 z-10 shadow-sm">
            <Link
              href="/requests/create"
              className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 rounded-lg transition-colors duration-200 focus:outline-none mb-6"
            >
              Create Blood Request
            </Link>

            {/* Search Form */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Search Requests
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="bloodType"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Blood Group
                  </label>
                  <select
                    id="bloodType"
                    value={searchBloodType}
                    onChange={(e) => setSearchBloodType(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  >
                    <option value="">Select Blood Group</option>
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
                    Search Radius: {searchRadius} km
                  </label>
                  <SearchRadiusSlider
                    radius={searchRadius}
                    setRadius={setSearchRadius}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                >
                  {isLoading ? 'Searching...' : 'Search Donors'}
                </button>
              </form>
            </div>
          </div>

          {/* Messages */}
          {successMessage && (
            <div
              className="mx-6 mt-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg"
              role="alert"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {successMessage}
              </div>
            </div>
          )}

          {errorMessage && (
            <div
              className="mx-6 mt-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg"
              role="alert"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Requests List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Requests
                  {pagination && (
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      ({pagination.total} found)
                    </span>
                  )}
                </h2>

                {pagination && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Page {pagination.current_page} of {pagination.last_page}
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : data.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                    💔
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No blood requests found in this area.
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Try adjusting your search radius or check back later.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {data.map((request, index) => (
                    <div
                      key={`${request.id}-${index}`}
                      className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 relative"
                    >
                      {/* Distance Badge - Top Right */}
                      {request.distance_in_km && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {request.distance_in_km} km away
                          </span>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {request.user?.name || 'Anonymous Requester'}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Urgent
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Blood Type:</span>
                              <span className="font-bold text-red-600 dark:text-red-400">
                                {request.blood_type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Quantity:</span>
                              <span>{request.quantity} units</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Date Needed:</span>
                              <span>
                                {request.date_time
                                  ? new Date(request.date_time).toLocaleString()
                                  : 'ASAP'}
                              </span>
                            </div>

                            {/* Beautiful WhatsApp Link */}
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Contact:</span>
                              <a
                                href={`https://wa.me/${request.contact_number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 group"
                              >
                                <i className="fab fa-whatsapp text-white text-sm"></i>
                                <span className="font-semibold text-sm">
                                  Chat Now
                                </span>
                              </a>
                            </div>

                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Location:</span>
                              <span>
                                {request.exact_location || 'Not specified'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <span className="font-medium">City:</span>
                              <span>
                                {request.city}, {request.country}
                              </span>
                            </div>
                          </div>

                          {/* Phone Number Display */}
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Phone: </span>
                            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {request.contact_number}
                            </span>
                          </div>

                          {/* Verification Photo */}
                          {request.verification_photo?.path && (
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Verification Photo:
                              </p>
                              <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${request.verification_photo.path}`}
                                alt="Request verification"
                                className="rounded-lg border border-gray-200 dark:border-gray-600 max-w-xs"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {/* <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                              Respond to Request
                              <svg
                                className="w-3.5 h-3.5 ms-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M1 5h12m0 0L9 1m4 4L9 9"
                                />
                              </svg>
                            </button>

                            <ActionDropdown
                              id={request.id ? request.id.toString() : ''}
                              error={errorMessage}
                              success={successMessage}
                            />
                          </div> */}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            <Pagination />
          </div>
        </div>
      </div>
    </main>
  );
}
