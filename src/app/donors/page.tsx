'use client';

import { useEffect, useState } from 'react';
import { donorApplications } from '../lib/actions';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SearchRadiusSlider from '../_components/SearchRadiusSlider';
import {
  BloodDonor,
  BloodDonorsPaginatedResponse,
  ExactLocation,
} from '../lib/definitions';

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

export default function Donors() {
  const [data, setData] = useState<BloodDonor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<ExactLocation>({
    lat: 27.712,
    lng: 85.324,
    city: 'Kathmandu',
    country: 'Nepal',
  });
  const [locations, setLocations] = useState<ExactLocation[]>([]);
  const [searchRadius, setSearchRadius] = useState<number>(0);
  const [searchBloodType, setSearchBloodType] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleDonors = (
    res:
      | BloodDonorsPaginatedResponse
      | { status: 'error'; message: string; errors?: any }
  ) => {
    if (res && 'data' in res && res?.data) {
      setData(res.data.data);
      setPagination(res.data);

      setLocations(
        res.data.data.map((donor: BloodDonor) => ({
          lat: donor.latitude,
          lng: donor.longitude,
          city: donor.city,
          country: donor.country,
          label: {
            name: donor.user?.name,
            contact_number: donor.contact_number,
            blood_group: donor.blood_group,
          },
        }))
      );
    } else {
      console.error('Failed to load donors', res);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setIsLoading(true);
        const res = await donorApplications();
        if (res && !('message' in res) && res.data) {
          handleDonors(res);
        }
      } catch (err) {
        console.error('Failed to load donors', err);
        setIsLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const preparedData = {
      latitude: location.lat,
      longitude: location.lng,
      blood_group: searchBloodType,
      radius: searchRadius !== 0 ? searchRadius : null,
      page: currentPage,
    };

    try {
      const data = await donorApplications(preparedData);
      if (!('message' in data)) {
        handleDonors(data);
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
      blood_group: searchBloodType,
      radius: searchRadius,
      page: page,
    };

    try {
      const data = await donorApplications(preparedData);
      if (!('message' in data)) handleDonors(data);
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Page change failed:', error);
      setIsLoading(false);
    }
  };

  // Pagination component
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
      <div className="grid grid-cols-1 lg:flex lg:justify-end w-full">
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
              Be a Lifesaver Today
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Save lives. Find nearby donors or register to become a donor and
              give the gift of hope.
            </p>
          </div>

          {/* Search Header */}
          <div className="bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700 z-10 shadow-sm">
            <Link
              href="/donors/register"
              className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 rounded-lg transition-colors duration-200 focus:outline-none"
            >
              Register as Donor
            </Link>

            <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
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

          {/* Donor Cards Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Nearby Donors
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
                <div className="text-center sticky top-0 py-12 min-h-[calc(100vh-580px)]">
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                      💔
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      No donors found in this area.
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                      Try adjusting your search criteria or expanding the
                      radius.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.map((donor, index) => (
                    <div
                      key={`${donor.id}-${index}`}
                      className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 relative"
                    >
                      {/* Distance Badge - Top Right */}
                      {donor.distance_in_km && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {donor.distance_in_km} km away
                          </span>
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {donor.user?.name || 'Anonymous Donor'}
                            </h3>
                            {donor.user?.verified_as_donor && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Verified Donor
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Blood Type:</span>
                              <span className="font-bold text-red-600 dark:text-red-400 text-lg">
                                {donor.blood_group}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <span className="font-medium">City:</span>
                              <span className="font-medium">
                                {donor.city || 'Not specified'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Country:</span>
                              <span>{donor.country || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Availability:</span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Ready to Donate
                              </span>
                            </div>
                          </div>

                          {/* Contact Section with Phone Call */}
                          {donor.contact_number && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-full">
                                  <i className="fas fa-phone text-white text-sm"></i>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300 block">
                                    Direct Contact
                                  </span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                    {donor.contact_number}
                                  </span>
                                </div>
                              </div>
                              <a
                                href={`tel:${donor.contact_number}`}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 font-semibold whitespace-nowrap"
                              >
                                <i className="fas fa-phone text-white"></i>
                                <span>Call Now</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
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
