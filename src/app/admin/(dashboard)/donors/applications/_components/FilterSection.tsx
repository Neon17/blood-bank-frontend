import React, { useCallback } from 'react';
import { FilterParams } from '@/app/lib/definitions';

interface FilterSectionProps {
  filters: FilterParams;
  updateFilter: (key: string, value: string | number) => void;
  handleFilterSubmit: (event: React.FormEvent) => void;
  handleClearFilters: () => void;
  loading: boolean;
  data: { total: number } | null;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  updateFilter,
  handleFilterSubmit,
  handleClearFilters,
  loading,
  data,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filter Donors
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
            Search Donors
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
              // onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search by name, contact, address..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Blood Group */}
        <div>
          <label
            htmlFor="blood_group"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Blood Group
          </label>
          <select
            id="blood_group"
            value={filters.blood_group}
            onChange={(e) => updateFilter('blood_group', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Blood Groups</option>
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
            <option value="wrong">Wrong</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <option value="">All Donors</option>
            <option value="true">Has Donated</option>
            <option value="false">Never Donated</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {data && `Found ${data.total} donors`}
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
          blood_group: 'Blood Group',
          verification_status: 'Status',
          city: 'City',
          country: 'Country',
          has_donated: 'Donation History',
        };

        const displayValue =
          key === 'has_donated'
            ? value === 'true'
              ? 'Has Donated'
              : 'Never Donated'
            : value;

        return (
          <span
            key={key}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {filterLabels[key]}: {displayValue}
            <button
              onClick={() => updateFilter(key, '')}
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
