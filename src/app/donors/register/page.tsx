'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  BloodDonor,
  ExactLocation,
  DonorRegistrationForm,
} from '@/app/lib/definitions';
import { registerBloodDonor } from '@/app/lib/actions';
import Stepper from '@/app/_components/Stepper';

const MapPicker = dynamic(() => import('@/app/_components/MapPicker'), {
  ssr: false,
});

const steps = [
  'Personal Info',
  'Medical History',
  'Contact Location',
  'Confirmation',
];

type DonorFormErrors = {
  name?: string[];
  contact_phone?: string[];
  blood_type?: string[];
  address?: string[];
  date_of_birth?: string[];
  weight?: string[];
  height?: string[];
  latitude?: string[];
  longitude?: string[];
  country?: string[];
  city?: string[];
  last_donation?: string[];
  medical_conditions?: string[];
  medications?: string[];
  health_status?: string[];
};

export default function BecomeDonor() {
  const [errors, setErrors] = useState<DonorFormErrors>({});
  const [activeStep, setActiveStep] = useState(0);
  const [completedStep, setCompletedStep] = useState(0);
  const radius = useRef(2); //acceptable location within our exact contact address
  const [location, setLocation] = useState<ExactLocation>({
    lat: 27.712,
    lng: 85.324,
    city: 'Pokhara',
    country: 'Nepal',
  });

  const [formData, setFormData] = useState<DonorRegistrationForm>({
    name: '',
    contact_phone: '',
    blood_type: '',
    address: '',
    date_of_birth: '',
    weight: '',
    height: '',
    latitude: location.lat,
    longitude: location.lng,
    country: '',
    city: '',
    last_donation: '',
    medical_conditions: [],
    medications: '',
    health_status: '',
    agreement: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (activeStep > completedStep) setCompletedStep(completedStep + 1);
  }, [activeStep]);

  // const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleNext = () => {
    // validation per step
    if (activeStep === 0) {
      if (
        !(
          formData.name &&
          formData.contact_phone &&
          formData.blood_type &&
          formData.address &&
          formData.date_of_birth
        )
      ) {
        setErrors({
          name: formData.name ? [] : ['Full Name is required'],
          contact_phone: formData.contact_phone
            ? []
            : ['Phone Number is required'],
          blood_type: formData.blood_type ? [] : ['Blood Type is required'],
          address: formData.address ? [] : ['Address is required'],
          date_of_birth: formData.date_of_birth
            ? []
            : ['Date of Birth is required'],
        });
        return;
      }
    }
    if (activeStep === 1) {
      if (
        !(
          formData.weight &&
          formData.height &&
          formData.health_status &&
          formData.last_donation
        )
      ) {
        setErrors({
          weight: formData.weight ? [] : ['Weight is required'],
          height: formData.height ? [] : ['Height is required'],
          health_status: formData.health_status
            ? []
            : ['Health status is required'],
          last_donation: formData.last_donation
            ? []
            : ['Last donation date is required'],
        });
        return;
      }
    }
    setErrors({});
    setActiveStep((prev) => prev + 1);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const actual_sending_object: BloodDonor = {
      ...formData,
      medical_conditions: formData.medical_conditions.join(','),
      weight: +formData.weight,
      height: +formData.height,
      contact_number: +formData.contact_phone,
      last_donated_date: formData.last_donation,
      current_health_status: formData.health_status,
      current_medication: formData.medications,
    };

    const response = await registerBloodDonor(actual_sending_object);
    if ('errors' in response && response.status === 'error') {
      alert(`Submission Failed: ${response.message}`);
    } else {
      alert('Submitted successfully!');
      router.push('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center p-2 w-full">
      <div>
        <div className="w-full min-w-[300px] w-full md:w-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-3 lg:p-8 max-h-auto">
          <h2 className="text-2xl lg:text-3xl font-semibold text-center pb-5 lg:mb-10">
            Become a Blood Donor
          </h2>

          {/* Stepper */}
          <div className="w-full justify-center items-center">
            <Stepper completedStep={completedStep} values={steps} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 pt-5">
            {/* Step 1 */}
            {activeStep === 0 && (
              <>
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <InputField
                  label="Phone Number"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  error={errors.contact_phone}
                />
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Blood Type
                  </label>
                  <select
                    name="blood_type"
                    value={formData.blood_type}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  >
                    <option value="">Select Blood Type</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                      (type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      )
                    )}
                  </select>
                  {errors.blood_type && (
                    <p className="text-red-500 text-sm">
                      {errors.blood_type[0]}
                    </p>
                  )}
                </div>
                <InputField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                />
                <InputField
                  label="Date of Birth"
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  error={errors.date_of_birth}
                />
              </>
            )}

            {/* Step 2 */}
            {activeStep === 1 && (
              <>
                <InputField
                  label="Weight (kg)"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  error={errors.weight}
                />
                <InputField
                  label="Height (cm)"
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  error={errors.height}
                />
                <InputField
                  label="Last Donated Date"
                  type="date"
                  name="last_donation"
                  value={formData.last_donation}
                  onChange={handleChange}
                  error={errors.last_donation}
                />

                <fieldset className="border rounded p-4">
                  <legend className="text-sm font-medium">
                    Medical Conditions
                  </legend>
                  {[
                    'Diabetes',
                    'Heart Disease',
                    'High Blood Pressure',
                    'HIV/AIDS',
                    'Hepatitis',
                  ].map((condition) => (
                    <label key={condition} className="block">
                      <input
                        type="checkbox"
                        value={condition}
                        onChange={handleMultiCheck}
                        checked={formData.medical_conditions.includes(
                          condition
                        )}
                        className="mr-2"
                      />
                      {condition}
                    </label>
                  ))}
                </fieldset>

                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  placeholder="Current Medications"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                ></textarea>

                <fieldset className="border rounded p-4">
                  <legend className="text-sm font-medium">
                    Current Health Status
                  </legend>
                  {['excellent', 'good', 'fair', 'poor'].map((status) => (
                    <label key={status} className="block">
                      <input
                        type="radio"
                        name="health_status"
                        value={status}
                        onChange={handleChange}
                        checked={formData.health_status === status}
                        className="mr-2"
                      />
                      {status}
                    </label>
                  ))}
                </fieldset>
                {errors.health_status && (
                  <p className="text-red-500 text-sm">
                    {errors.health_status[0]}
                  </p>
                )}
              </>
            )}

            {/* Step 3 */}
            {activeStep === 2 && (
              <>
                <p className="mb-2">
                  Please select your contact location within {radius.current} km
                  reach
                </p>
                <MapPicker
                  location={location}
                  onChange={setLocation}
                  radius={radius.current}
                  width="100%"
                  height="400px"
                />
                <p className="text-sm text-gray-500">
                  (It will be updated in your profile too)
                </p>
              </>
            )}

            {/* Step 4 */}
            {activeStep === 3 && (
              <>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="mb-2">
                    By agreeing to become a donor, you confirm that:
                  </p>
                  <ul className="list-disc list-inside mb-2">
                    <li>You are at least 18 years old</li>
                    <li>You weigh at least 50kg</li>
                    <li>You are in good health</li>
                  </ul>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="agreement"
                    checked={formData.agreement}
                    onChange={handleChange}
                    className="mr-2"
                    required
                  />
                  I agree to the terms and conditions
                </label>
              </>
            )}

            {/* Buttons */}
            <div className="flex justify-between pt-6">
              {activeStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Back
                </button>
              )}
              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Reusable input component */
function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      {error && <p className="text-red-500 text-sm">{error[0]}</p>}
    </div>
  );
}
