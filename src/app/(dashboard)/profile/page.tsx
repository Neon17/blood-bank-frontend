'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '../../context/authInfo';
import { useEffect, useRef, useState } from 'react';
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
  RefreshCw,
} from 'lucide-react';

const MapPicker = dynamic(() => import('@/app/_components/MapPicker'), {
  ssr: false,
});

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [location, setLocation] = useState({
    lat: user?.latitude ?? 27.7172,
    lng: user?.longitude ?? 85.324,
    city: user?.city ?? 'Kathmandu',
    country: user?.country ?? 'Nepal',
  });
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{
    profile_photo: string[];
  } | null>(null);
  const [photoVersion, setPhotoVersion] = useState(0);

  // Ref for the file input to clear it safely
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setErrors(null);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await updateProfilePhoto(formData);

      if ('message' in response) {
        setErrors(response.errors);
      } else {
        // Method 1A: Update auth context (best approach)
        if (updateUser) {
          await updateUser(); // Refresh user data in context
        }

        // Method 1B: Cache busting with timestamp
        setPhotoVersion((prev) => prev + 1);

        // Method 1C: Force image reload - SAFE VERSION
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  // Method 2: Add cache busting to image URL
  const getProfilePhotoUrl = () => {
    if (!user?.profilePhoto?.url) return null;
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    return `${base}${user.profilePhoto.url}?v=${photoVersion}`;
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
    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Profile Photo Section */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative group">
                <div className="relative">
                  {user.profilePhoto?.url ? (
                    <div className="relative">
                      <img
                        width={144}
                        height={144}
                        src={getProfilePhotoUrl() || ''}
                        alt="Profile"
                        className="rounded-2xl w-36 h-36 object-cover border-4 border-white/80 dark:border-gray-800/80 shadow-2xl transition-all duration-300 group-hover:scale-105"
                        key={photoVersion}
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center border-4 border-white/80 dark:border-gray-800/80 shadow-2xl">
                      <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Upload Form */}
                <form onSubmit={updateUserPhoto} className="mt-6">
                  <div className="flex flex-col items-center space-y-3">
                    <label className="cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
                      {uploading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                      <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
                      <input
                        ref={fileInputRef} // Use ref instead of querySelector
                        name="profile_photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setErrors(null);
                            e.target.form?.requestSubmit();
                          }
                        }}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {errors?.profile_photo && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="text-sm text-red-600 dark:text-red-400 space-y-1">
                        {errors.profile_photo.map((error, index) => (
                          <p
                            key={index}
                            className="flex items-center space-x-1"
                          >
                            <span>•</span>
                            <span>{error}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="space-y-3">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 flex items-center justify-center lg:justify-start space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <div
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    user.verified_as_donor
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
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
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105">
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
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
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
                className="mt-6 inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                <span>Edit Profile</span>
              </Link>
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 h-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Location Map
              </h2>
              <div className="rounded-xl overflow-hidden h-96 border border-gray-200 dark:border-gray-700">
                <MapPicker location={location} onChange={setLocation} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
