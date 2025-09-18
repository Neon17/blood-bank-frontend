"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { approveBloodDonorApplication, deleteDonorApplication, donorApplications, updateDonorApplication } from "@/app/lib/actions";
import { BloodDonor, ExactLocation, verification_status } from "@/app/lib/definitions";
import dynamic from "next/dynamic";
const MapPicker = dynamic(import('@/app/_components/MapPicker'), { ssr: false });
// import MapPicker from "@/app/_components/MapPicker";

type DonorApplicationResponse = {
  status: string;
  total?: number;
  data: BloodDonor[];
};

export default function Page() {
  const [data, setData] = useState<DonorApplicationResponse>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const [viewDonor, setViewDonor] = useState<BloodDonor | null>(null);
  const [editDonor, setEditDonor] = useState<BloodDonor | null>(null);
  const [deleteDonor, setDeleteDonor] = useState<BloodDonor | null>(null);
  const [approveDonor, setApproveDonor] = useState<BloodDonor | null>(null);

  const [changeState, setChangeState] = useState(false);

  const [location, setLocation] = useState<ExactLocation>({
    lat: 0,
    lng: 0,
    city: '',
    country: '',
  });

  const router = useRouter();

  const fetchData = async () => {
    const res = await donorApplications();
    if ("message" in res) setError(res.message);
    else setData(res);
  };

  useEffect(() => {
    if (editDonor) setLocation({ lat: editDonor.latitude, lng: editDonor.longitude, city: editDonor.city, country: editDonor.country })
  }, [editDonor])

  useEffect(() => {
    fetchData();
  }, [success]);

  const closeModals = () => {
    setViewDonor(null);
    setEditDonor(null);
    setDeleteDonor(null);
    setApproveDonor(null);
  };

  const handleDelete = async (user_id: number | undefined) => {
    if (user_id) {
      const res = await deleteDonorApplication(user_id.toString());
      if ("message" in res) setError(res.message);
      else {
        setChangeState(!changeState);
        setSuccess("Successfully Deleted the donor application");
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 2000)
  }, [error, success])

  const handleUpdate = async () => {
    const updateData = {
      ...editDonor,
      latitude: location.lat,
      longitude: location.lng,
      city: location.country,
      country: location.city
    }

    if (!updateData.contact_number) return;
    const res = await updateDonorApplication(updateData);
    if ("message" in res) setError(res.message);
    else {
      setEditDonor(null);
      setSuccess("Successfully Updated Donor Application!");
    }
  }

  const handleApprove = async (id: number | undefined) => {
    const approveData = {
      ...approveDonor,
      status: "approved",
      latitude: location.lat,
      longitude: location.lng,
      city: location.country,
      country: location.city
    }

    if (!approveData.contact_number) return;
    if (!id) return;
    const res = await approveBloodDonorApplication(approveData);
    if ("message" in res) {
      setError(res.message);
      alert('Error! ' + res.message);
    }
    else {
      fetchData();
      setApproveDonor(null);
      setSuccess("Successfully Updated Donor Application!");
    }
  }

  const handleEditChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handle on change of input for Edit Form
    const { name, value, type } = event.target;

    setEditDonor((editDonor) => {
      if (!editDonor) return editDonor;

      return {
        ...editDonor,
        [name]: type === "number" ? +value : value
      }
    })
  }

  return (
    <div className="p-5 h-full w-full">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Donor Applications</h2>

      {error && <div className="bg-red-500 text-white px-4 py-2 mb-4 rounded">Error: {error}</div>}
      {success && <div className="bg-green-500 text-white px-4 py-2 mb-4 rounded">{success}</div>}

      <div className="overflow-x-auto border rounded border-gray-300 dark:border-gray-700">
        <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-center">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Blood</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((donor, index) => {
              const statusValue = donor.verification_status?.toString() ?? "pending";
              const statusLabel = statusValue;

              return (
                <tr key={index} className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 text-center">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{donor.blood_type}</td>
                  <td className="px-4 py-2">{donor.city}</td>
                  <td className="px-4 py-2">{donor.country}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${statusValue.toLowerCase() === "approved"
                        ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                        : statusValue.toLowerCase() === "wrong"
                          ? "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100"
                          : "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
                        }`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => setOpenDropdown(index)} className="text-white px-2 py-1 rounded bg-gray-700 hover:bg-gray-600">⋮</button>
                    {openDropdown === index && (
                      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow z-20">
                        <button onClick={() => { setViewDonor(donor); setOpenDropdown(null); }} className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">View</button>
                        <button onClick={() => { setEditDonor(donor); setOpenDropdown(null); }} className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Edit</button>
                        <button onClick={() => { setDeleteDonor(donor); setOpenDropdown(null); }} className="w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">Delete</button>
                        <button onClick={() => { setApproveDonor(donor); setOpenDropdown(null); }} className="w-full px-4 py-2 text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700">Approve</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>


      {/* View Modal */}
      {viewDonor && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center md:ps-50 items-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded max-w-3xl w-full">
            <h3 className="text-lg font-bold mb-4">Donor Details</h3>
            <p><strong>Contact:</strong> {viewDonor.contact_number}</p>
            <p><strong>Blood Type:</strong> {viewDonor.blood_type}</p>
            <p><strong>Address:</strong> {viewDonor.address}, {viewDonor.city}, {viewDonor.country}</p>
            <p><strong>Date of Birth:</strong> {viewDonor.date_of_birth}</p>
            <p><strong>Last Donated Date:</strong> {viewDonor.last_donated_date}</p>
            <p><strong>Current Health Status:</strong> {viewDonor.current_health_status}</p>
            <p><strong>Current Medications:</strong> {viewDonor.current_medication}</p>
            <p><strong>Medical Conditions:</strong> {viewDonor.medical_conditions}</p>
            <p><strong>Verification Status:</strong> {viewDonor.verification_status}</p>
            <p><strong>Admin Message:</strong> {viewDonor.admin_message}</p>
            <div className="mt-4">
              <MapPicker
                location={{ lat: viewDonor.latitude, lng: viewDonor.longitude, city: viewDonor.city, country: viewDonor.country }}
                onChange={() => { }}
                radius={null}
                height="400px"
                width="100%"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={closeModals} className="px-4 py-2 bg-gray-700 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editDonor && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center md:ps-50 items-center max-h-screen overflow-y-scroll p-2">
          <div className="bg-white dark:bg-gray-900 p-6 rounded max-w-3xl w-full">
            <h3 className="text-lg font-bold mb-4">Edit Donor</h3>
            {/* You can bind these inputs to form state later */}
            <div className="flex flex-wrap">
              <div className="formelement w-1/2 p-2">
                <input value={editDonor.contact_number ?? 9812345678} type="number" onChange={handleEditChange} name="contact_number" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
              </div>
              <div className="formelement w-1/2 p-2">
                <input value={editDonor.address ?? ''} name="address" onChange={handleEditChange} className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
              </div>
              <div className="formelement w-1/2 p-2">
                <input value={editDonor.blood_type ?? ''} name="blood_type" onChange={handleEditChange} className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
              </div>
              <div className="formelement w-1/2 p-2">
                <input value={editDonor.date_of_birth ?? ''} type="date" onChange={handleEditChange} name="date_of_birth" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
              </div>
              <div className="formelement w-1/2 p-2">
                <input value={editDonor.current_health_status ?? ''} onChange={handleEditChange} name="current_health_status" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
              </div>
              <div className="formelement w-1/2 p-2">
                <input value={editDonor.current_medication ?? ''} onChange={handleEditChange} name="current_medication" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
              </div>
              <div className="formelement w-1/2 p-2">
                <input value={editDonor.medical_conditions ?? ''} onChange={handleEditChange} name="medical_conditions" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
              </div>
              <div className="formelement w-1/2 p-2">
                <input value={editDonor.verification_status ?? ''} onChange={handleEditChange} name="verification_status" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
              </div>
              <div className="formelement w-1/2 p-2">
                <input value={editDonor.admin_message ?? ''} name="admin_message" onChange={handleEditChange} className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white" />
              </div>
            </div>
            <MapPicker
              location={location}
              // onChange={(loc) => {
              //   // Update local state here if needed
              // }}
              onChange={setLocation}
              radius={null}
              height="400px"
              width="100%"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeModals} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Model */}
      {approveDonor && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Approve Donor</h3>
            <p>Are you sure you want to approve <strong>{approveDonor.user?.name}</strong>?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeModals} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
              {approveDonor.user_id &&
                <button onClick={() => handleApprove(approveDonor.user_id)} className="px-4 py-2 bg-green-600 text-white rounded">Approve</button>
              }
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteDonor && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{deleteDonor.contact_number}</strong>?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeModals} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
              {deleteDonor.user_id &&
                <button onClick={() => handleDelete(deleteDonor.user_id)} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
