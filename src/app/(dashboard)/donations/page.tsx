'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  myDonations,
  updateDonation,
  deleteDonation
} from "@/app/lib/actions"
import { Donation, ExactLocation } from '@/app/lib/definitions';
import dynamic from 'next/dynamic';
const MapPicker = dynamic(import('@/app/_components/MapPicker'), {
  ssr: false,
});

export default function MyDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [viewDonation, setViewDonation] = useState<Donation | null>(null);
  const [editDonation, setEditDonation] = useState<Donation | null>(null);
  const [deleteDonationState, setDeleteDonation] = useState<Donation | null>(null);
  const [location, setLocation] = useState<ExactLocation>({
    lat: 0,
    lng: 0,
    city: '',
    country: '',
  });

  const router = useRouter();

  const fetchMyDonations = async () => {
    setLoading(true);
    try {
      const res = await myDonations();
      if ('message' in res) {
        setError(res.message);
      } else {
        setDonations(res.data);
      }
    } catch (err) {
      setError('Failed to fetch your donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editDonation) {
      setLocation({
        lat: editDonation.latitude || 0,
        lng: editDonation.longitude || 0,
        city: editDonation.city,
        country: editDonation.country,
      });
    }
  }, [editDonation]);

  useEffect(() => {
    fetchMyDonations();
  }, [success]);

  const closeModals = () => {
    setViewDonation(null);
    setEditDonation(null);
    setDeleteDonation(null);
  };

  const handleDelete = async (id: number | undefined) => {
    if (id) {
      const res = await deleteDonation(id.toString());
      if ('message' in res) setError(res.message);
      else {
        setSuccess('Successfully deleted the donation');
        closeModals();
        fetchMyDonations();
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleUpdate = async () => {
    if (!editDonation?.contact_number) {
      setError('Contact number is required');
      return;
    }

    const updateData: Donation = {
      ...editDonation,
      verification_status: 'pending', // Reset to pending after update
      latitude: location.lat,
      longitude: location.lng,
      city: location.city,
      country: location.country,
    };

    let res;
    if (updateData?.id) {
      const formData = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      res = await updateDonation(updateData.id.toString(), formData);
    }
    
    if (res && 'message' in res) setError(res.message);
    else {
      setEditDonation(null);
      setSuccess('Donation updated successfully! It will be reviewed by admin.');
      fetchMyDonations();
    }
  };

  const handleEditChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;

    setEditDonation((editDonation) => {
      if (!editDonation) return editDonation;

      return {
        ...editDonation,
        [name]: type === 'number' ? +value : value,
      };
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 h-full w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Donations
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your blood donation applications
            </p>
          </div>
          <button
            onClick={() => router.push('/donations/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Donation
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Donations Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.verification_status)}`}>
                    {donation.verification_status?.charAt(0).toUpperCase() + donation.verification_status?.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewDonation(donation)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    title="View Details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setEditDonation(donation)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteDonation(donation)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Blood Group and Quantity */}
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {donation.blood_group}
                </span>
                <span className="text-lg text-gray-600 dark:text-gray-400">
                  {donation.quantity} units
                </span>
              </div>

              {/* Donation Date */}
              <div className="mb-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Donation Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(donation.date_time)}
                </p>
              </div>

              {/* Location */}
              <div className="mb-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {donation.city}, {donation.country}
                </p>
              </div>

              {/* Contact Info */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {donation.contact_number}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && donations.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No donations found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
            Get started by creating your first blood donation.
          </p>
          <button
            onClick={() => router.push('/donations/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Donation
          </button>
        </div>
      )}

      {/* View Modal */}
      {viewDonation && (
        <div className="fixed inset-0 z-50 overflow-y-auto mt-[76px]">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModals}></div>
            <div className="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Donation Details</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                {/* Same view modal content as before */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Name</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewDonation.contact_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Number</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewDonation.contact_number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Blood Group</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewDonation.blood_group}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewDonation.quantity} units</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Donation Date</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(viewDonation.date_time)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(viewDonation.verification_status)}`}>
                      {viewDonation.verification_status}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {viewDonation.exact_location}, {viewDonation.city}, {viewDonation.country}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end">
                <button onClick={closeModals} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Same as before but with status reset to pending */}
      {editDonation && (
        <div className="fixed inset-0 z-50 overflow-y-auto mt-[76px]">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModals}></div>
            <div className="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Donation</h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  Note: Updating this donation will require admin verification again.
                </p>
              </div>
              <div className="px-6 py-4 space-y-6 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Name</label>
                    <input type="text" name="contact_name" value={editDonation.contact_name || ''} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number</label>
                    <input type="text" name="contact_number" value={editDonation.contact_number || ''} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
                    <select name="blood_group" value={editDonation.blood_group || ''} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                    <input type="number" name="quantity" value={editDonation.quantity || ''} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exact Location</label>
                    <input type="text" name="exact_location" value={editDonation.exact_location || ''} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location Map</label>
                  <MapPicker location={location} onChange={setLocation} radius={null} height="300px" width="100%" />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                <button onClick={closeModals} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500">Cancel</button>
                <button onClick={handleUpdate} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteDonationState && (
        <div className="fixed inset-0 z-50 overflow-y-auto mt-[76px]">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModals}></div>
            <div className="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Deletion</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete your donation from <strong>{deleteDonationState.contact_name}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                <button onClick={closeModals} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500">Cancel</button>
                <button onClick={() => handleDelete(deleteDonationState.id)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}