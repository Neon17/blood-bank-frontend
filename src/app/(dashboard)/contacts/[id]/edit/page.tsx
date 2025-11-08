'use client';

import { useEffect, useRef, useState } from 'react';
import MapPickerWrapper from '@/app/_components/MapPickerWrapper';
import {
  editDonorApplication,
  updateDonorApplication,
} from '@/app/lib/actions';
import { BloodDonor, ExactLocation } from '@/app/lib/definitions';

const steps = [
  'Personal Information',
  'Medical History',
  'Contact Location',
  'Confirmation',
];

type DonorApplicationError = {
  contact_number?: string[];
  address?: string[];
  date_of_birth?: string[];
  blood_group?: string[];
  weight?: string[];
  height?: string[];
  last_donated_date?: string[];
  medical_conditions?: string[];
  current_medication?: string[];
  current_health_status?: string[];
  latitude?: string[];
  longitude?: string[];
  city?: string[];
  country?: string[];
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const radius = useRef(2);
  const [data, setData] = useState<BloodDonor>();
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<DonorApplicationError>();
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const { id } = await params;
      const result = await editDonorApplication(id);

      if ('data' in result) {
        setData(result.data);
        setMedicalConditions(result.data.medical_conditions?.split(',') || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch donor data');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (data) {
      const updatedData = {
        ...data,
        medical_conditions: medicalConditions.join(','),
      };

      const result = await updateDonorApplication(updatedData);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });

      if ('data' in result) {
        setData(result.data);
        setSuccess('Donor application updated successfully');
        setError('');
        setErrors(undefined);
      } else {
        setErrors(result.errors);
        setError(result.message);
      }
    }
  };

  const handleMedicalConditionChange = (
    condition: string,
    checked: boolean
  ) => {
    if (checked) {
      setMedicalConditions((prev) => [...prev, condition]);
    } else {
      setMedicalConditions((prev) => prev.filter((c) => c !== condition));
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading donor information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Update Donor Information
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Keep your donor profile current to help save lives
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg">
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
              <p className="text-green-800 dark:text-green-200 font-medium">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
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
              <p className="text-red-800 dark:text-red-200 font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-[500px] lg:h-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Location
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Set your current location to receive blood requests within your
              area
            </p>
            <div className="h-2/3 rounded-lg overflow-hidden">
              <MapPickerWrapper
                location={{
                  lat: data.latitude,
                  lng: data.longitude,
                  city: data.city,
                  country: data.country,
                }}
                onChange={(location: ExactLocation) => {
                  setData({
                    ...data,
                    latitude: location.lat,
                    longitude: location.lng,
                    city: location.city,
                    country: location.country,
                  });
                }}
                radius={radius.current}
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="contact_phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact_phone"
                    name="contact_phone"
                    type="tel"
                    value={data.contact_number || ''}
                    onChange={(e) =>
                      setData({ ...data, contact_number: +e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                  {errors?.contact_number && (
                    <p className="text-red-500 text-sm">
                      {errors.contact_number}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="blood_group"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Blood Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="blood_group"
                    name="blood_group"
                    value={data.blood_group || ''}
                    onChange={(e) =>
                      setData({ ...data, blood_group: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                  {errors?.blood_group && (
                    <p className="text-red-500 text-sm">{errors.blood_group}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  value={data.address || ''}
                  onChange={(e) =>
                    setData({ ...data, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
                {errors?.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>

              {/* Physical Attributes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="weight"
                    type="number"
                    value={data.weight || ''}
                    onChange={(e) =>
                      setData({ ...data, weight: +e.target.value })
                    }
                    placeholder="Enter weight in kg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                  {errors?.weight && (
                    <p className="text-red-500 text-sm">{errors.weight}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="height"
                    type="number"
                    value={data.height || ''}
                    onChange={(e) =>
                      setData({ ...data, height: +e.target.value })
                    }
                    placeholder="Enter height in cm"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                  {errors?.height && (
                    <p className="text-red-500 text-sm">{errors.height}</p>
                  )}
                </div>
              </div>

              {/* Last Donation */}
              <div className="space-y-2">
                <label
                  htmlFor="last_donation"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Last Donation Date
                </label>
                <input
                  id="last_donation"
                  name="last_donation"
                  type="date"
                  value={data.last_donated_date || ''}
                  onChange={(e) =>
                    setData({ ...data, last_donated_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
                {errors?.last_donated_date && (
                  <p className="text-red-500 text-sm">
                    {errors.last_donated_date}
                  </p>
                )}
              </div>

              {/* Medical Conditions */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Medical Conditions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  {[
                    'Diabetes',
                    'Heart Disease',
                    'High Blood Pressure',
                    'HIV/AIDS',
                    'Hepatitis',
                  ].map((condition) => (
                    <label
                      key={condition}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={condition}
                        checked={medicalConditions.includes(condition)}
                        onChange={(e) =>
                          handleMedicalConditionChange(
                            condition,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {condition}
                      </span>
                    </label>
                  ))}
                </div>
                {errors?.medical_conditions && (
                  <p className="text-red-500 text-sm">
                    {errors.medical_conditions}
                  </p>
                )}
              </div>

              {/* Current Medications */}
              <div className="space-y-2">
                <label
                  htmlFor="medications"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Current Medications
                </label>
                <textarea
                  id="medications"
                  name="medications"
                  value={data.current_medication || ''}
                  onChange={(e) =>
                    setData({ ...data, current_medication: e.target.value })
                  }
                  placeholder="List any current medications..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
                />
                {errors?.current_medication && (
                  <p className="text-red-500 text-sm">
                    {errors.current_medication}
                  </p>
                )}
              </div>

              {/* Health Status */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Health Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['excellent', 'good', 'fair', 'poor'].map((status) => (
                    <label
                      key={status}
                      className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <input
                        type="radio"
                        name="health_status"
                        value={status}
                        checked={data.current_health_status === status}
                        onChange={(e) =>
                          setData({
                            ...data,
                            current_health_status: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
                {errors?.current_health_status && (
                  <p className="text-red-500 text-sm">
                    {errors.current_health_status}
                  </p>
                )}
              </div>

              {/* Donor Agreement */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Donor Agreement
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>You are at least 18 years old</li>
                  <li>You weigh at least 50kg</li>
                  <li>You are in good health condition</li>
                  <li>You haven't donated blood in the last 3 months</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Update Donor Information
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
