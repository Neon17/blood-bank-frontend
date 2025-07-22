'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExactLocation } from '@/app/lib/definitions';
const MapPicker = dynamic(() => import("@/app/_components/MapPicker"), { ssr: false });

const steps = ['Personal Information', 'Medical History', 'Contact Location', 'Confirmation'];

const InitialFormData = {
  name: '',
  phone: '',
  blood_type: '',
  address: '',
  date_of_birth: '',
  weight: '',
  height: '',
  contact_location: {
    lat: 0,
    lng: 0,
    city: '',
    country: ''
  }, //latititude and longitude
  last_donation: '',
  medical_conditions: [] as string[],
  medications: '',
  health_status: '',
  agreement: false,
};

export default function BecomeDonor() {
  const [activeStep, setActiveStep] = useState(0);
  const radius = useRef(2); //acceptable location within our exact contact address
  const [location, setLocation] = useState<ExactLocation>({
    lat: 27.712,
    lng: 85.3240,
    city: "Pokhara",
    country: "Nepal"
  });
  const [formData, setFormData] = useState<typeof InitialFormData>({
    name: '',
    phone: '',
    blood_type: '',
    address: '',
    date_of_birth: '',
    weight: '',
    height: '',
    contact_location: location,
    last_donation: '',
    medical_conditions: [],
    medications: '',
    health_status: '',
    agreement: false,
  });

  const router = useRouter();

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMultiCheck = (e: React.ChangeEvent<any>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const current = new Set(prev.medical_conditions);
      if (checked) current.add(value);
      else current.delete(value);
      return { ...prev, medical_conditions: Array.from(current) };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Submitted successfully!');
    router.push('/profile');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Become a Blood Donor</h1>

      <div className="formflex min-h-screen">

        <div className="flex justify-between mb-6 bg-gray-200 dark:bg-gray-800 items-center">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`text-center h-full p-2 py-4 rounded ${index === activeStep ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
            >
              {label}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 border p-5 rounded dark:bg-gray-800">
          {activeStep === 0 && (
            <>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border" required />
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-2 border" required />
              <select name="blood_type" value={formData.blood_type} onChange={handleChange} className="w-full p-2 border" required>
                <option value="">Select Blood Type</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border" required />
              <input name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" className="w-full p-2 border" required />
            </>
          )}

          {activeStep === 1 && (
            <>
              <input name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" type="number" className="w-full p-2 border" required />
              <input name="height" value={formData.height} onChange={handleChange} placeholder="Height (cm)" type="number" className="w-full p-2 border" required />
              <input name="last_donation" value={formData.last_donation} onChange={handleChange} type="date" className="w-full p-2 border" />

              <fieldset className="border p-4">
                <legend className="text-sm font-medium">Medical Conditions</legend>
                {['Diabetes', 'Heart Disease', 'High Blood Pressure', 'HIV/AIDS', 'Hepatitis'].map((condition) => (
                  <label key={condition} className="block">
                    <input type="checkbox" value={condition} onChange={handleMultiCheck} checked={formData.medical_conditions.includes(condition)} className="mr-2" />
                    {condition}
                  </label>
                ))}
              </fieldset>

              <textarea name="medications" value={formData.medications} onChange={handleChange} placeholder="Current Medications" className="w-full p-2 border" rows={2}></textarea>

              <fieldset className="border p-4">
                <legend className="text-sm font-medium">Current Health Status</legend>
                {['excellent', 'good', 'fair', 'poor'].map(status => (
                  <label key={status} className="block">
                    <input type="radio" name="health_status" value={status} onChange={handleChange} checked={formData.health_status === status} className="mr-2" />
                    {status}
                  </label>
                ))}
              </fieldset>
            </>
          )}

          {activeStep === 2 && (
            <>
              <p className="mb-2">Please select your contact location within {radius.current} km reach</p>
              <MapPicker location={location} onChange={setLocation} radius={radius.current} width='100%' height='500px'  />
              <p className="mb-2 text-sm">(It will be updated in your profile too)</p>
            </>
          )}

          {activeStep === 3 && (
            <>
              <div className="text-sm">
                <p className="mb-2">By agreeing to become a donor, you confirm that:</p>
                <ul className="list-disc list-inside mb-2">
                  <li>You are at least 18 years old</li>
                  <li>You weigh at least 50kg</li>
                  <li>You are in good health</li>
                </ul>
              </div>
              <label className="block">
                <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} className="mr-2" required />
                I agree to the terms and conditions
              </label>
            </>
          )}

          <div className="flex justify-between">
            {activeStep > 0 && (
              <button type="button" onClick={handleBack} className="bg-gray-300 px-4 py-2 rounded">
                Back
              </button>
            )}
            {activeStep < steps.length - 1 ? (
              <button type="button" onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">
                Next
              </button>
            ) : (
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Submit
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
