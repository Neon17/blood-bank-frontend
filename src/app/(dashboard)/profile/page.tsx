'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '../../context/authInfo';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { updateProfilePhoto } from '@/app/lib/actions';
import {
  Camera,
  MapPin,
  User,
  Mail,
  Calendar,
  Home,
  Droplets,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const MapPicker = dynamic(() => import('@/app/_components/MapPicker'), {
  ssr: false,
});

export default function ProfilePage() {
  const { user } = useAuth();
  const [location, setLocation] = useState({
    lat: user?.latitude ?? 27.7172,
    lng: user?.longitude ?? 85.324,
    city: user?.city ?? 'Kathmandu',
    country: user?.country ?? 'Nepal',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setLocation({
        lat: user.latitude ?? 27.7172,
        lng: user.longitude ?? 85.324,
        city: user.city ?? 'Kathmandu',
        country: user.country ?? 'Nepal',
      });
    }
  }, [user]);

  const updateUserPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await updateProfilePhoto(formData);
    } finally {
      setUploading(false);
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );

  const InfoField = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <Icon className="w-5 h-5 text-gray-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {label}
        </p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {value || 'Not provided'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Photo Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                {user.profilePhoto?.url ? (
                  <img
                    width={120}
                    height={120}
                    src={`http://localhost:8000${user.profilePhoto.url}`}
                    alt="Profile"
                    className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <form onSubmit={updateUserPhoto} className="mt-4">
                  <div className="flex items-center space-x-3">
                    <label className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                      <Camera className="w-4 h-4" />
                      <span>Change Photo</span>
                      <input
                        name="profile_photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            e.target.form?.requestSubmit();
                          }
                        }}
                      />
                    </label>
                    {uploading && (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* User Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {user.email}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div
                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                    user.verified_as_donor
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                  }`}
                >
                  {user.verified_as_donor ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>
                    Donor {user.verified_as_donor ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                {user.blood_group && (
                  <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 text-sm font-medium">
                    <Droplets className="w-4 h-4" />
                    <span>Blood Type: {user.blood_group}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </h2>
              <div className="space-y-4">
                <InfoField icon={User} label="Full Name" value={user.name} />
                <InfoField
                  icon={Mail}
                  label="Email Address"
                  value={user.email}
                />
                <InfoField
                  icon={Calendar}
                  label="Date of Birth"
                  value={user.dob?.toString().split('T')[0] || ''}
                />
                <InfoField
                  icon={Home}
                  label="Home Address"
                  value={user.address || ''}
                />
                <InfoField
                  icon={Droplets}
                  label="Blood Group"
                  value={user.blood_group || ''}
                />
              </div>
              <Link
                href="/profile/edit"
                className="mt-6 inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                <User className="w-4 h-4" />
                <span>Edit Profile</span>
              </Link>
            </div>

            {/* Location Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Current Location</span>
              </h2>
              <div className="space-y-4">
                <InfoField icon={MapPin} label="City" value={user.city || ''} />
                <InfoField
                  icon={MapPin}
                  label="Country"
                  value={user.country || ''}
                />
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Location Map
              </h2>
              <div className="rounded-xl overflow-hidden h-96">
                <MapPicker location={location} onChange={setLocation} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Your location helps us match you with nearby blood requests
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/donor/profile"
                  className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Droplets className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Donor Profile
                  </span>
                </Link>
                <Link
                  href="/donor/application"
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <User className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Become Donor
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
