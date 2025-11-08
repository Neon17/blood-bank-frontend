'use client';

import { useAuth } from '@/app/context/authInfo';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/app/lib/actions';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/app/_components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-500">Loading map...</span>
    </div>
  ),
});

type FormErrors = {
  name?: string;
  email?: string;
  address?: string;
  dob?: string;
  blood_group?: string;
};

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [location, setLocation] = useState({
    lat: 27.7172,
    lng: 85.324,
    city: 'Kathmandu',
    country: 'Nepal',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.latitude && user?.longitude) {
      setLocation({
        lat: user.latitude,
        lng: user.longitude,
        city: user.city || 'Kathmandu',
        country: user.country || 'Nepal',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setErrors({});

    const formData = new FormData(e.currentTarget);
    formData.append('city', location.city);
    formData.append('country', location.country);
    formData.append('lat', location.lat.toString());
    formData.append('lng', location.lng.toString());

    try {
      const response = await updateProfile(formData);

      if ('message' in response) {
        if (response.status === 'error') {
          setError(response.message || 'Failed to update profile');
          setErrors(response.errors || {});
        }
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/profile'), 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update your personal information and location
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-800 dark:text-green-200">
                Profile updated successfully! Redirecting...
              </p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="p-6 space-y-8">
            {/* Personal Information Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Blood Group */}
                <div className="space-y-2">
                  <label
                    htmlFor="blood_group"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="blood_group"
                    name="blood_group"
                    defaultValue={user.blood_group || ''}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
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
                  {errors.blood_group && (
                    <p className="text-red-500 text-sm">{errors.blood_group}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    defaultValue={user.dob?.toString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm">{errors.dob}</p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    defaultValue={user.address === '0' ? '' : user.address}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter your complete address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                </div>

                {/* Will Donate */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Willing to Donate Blood?{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="will_donate"
                        value="1"
                        defaultChecked={user.will_donate === true}
                        className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        Yes, I'm willing to donate
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="will_donate"
                        value="0"
                        defaultChecked={user.will_donate === false}
                        className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        No, not at this time
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Location{' '}
                  <span className="text-red-500 text-sm font-normal">
                    (within 1km range for blood requests)
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Set your current location to receive blood requests in your
                  area
                </p>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <MapPicker
                    width="100%"
                    location={location}
                    onChange={setLocation}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
