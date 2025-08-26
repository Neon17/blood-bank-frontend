'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BloodDonor, ExactLocation, DonorRegistrationForm } from '@/app/lib/definitions';
import { registerBloodDonor } from '@/app/lib/actions';
const MapPicker = dynamic(() => import("@/app/_components/MapPicker"), { ssr: false });

const steps = ['Personal Information', 'Medical History', 'Contact Location', 'Confirmation'];

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
  const radius = useRef(2); //acceptable location within our exact contact address
  const [location, setLocation] = useState<ExactLocation>({
    lat: 27.712,
    lng: 85.3240,
    city: "Pokhara",
    country: "Nepal"
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

  // const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);


  const handleNext = () => {
    if (activeStep == 0) {
      if (!(formData.name && formData.contact_phone && formData.blood_type && formData.address && formData.date_of_birth)) {
        setErrors({
          name: formData.name ? [] : ['Name is required'],
          contact_phone: formData.contact_phone ? [] : ['Contact phone is required'],
          blood_type: formData.blood_type ? [] : ['Blood type is required'],
          address: formData.address ? [] : ['Address is required'],
          date_of_birth: formData.date_of_birth ? [] : ['Date of birth is required'],
        })
        return;
      }
      setActiveStep(activeStep + 1);
    }
    if (activeStep == 1) {
      if (!(formData.weight && formData.height && formData.medical_conditions && formData.health_status && formData.last_donation)) {
        setErrors({
          weight: formData.weight ? [] : ['Weight is required'],
          height: formData.height ? [] : ['Height is required'],
          medical_conditions: formData.medical_conditions ? [] : ['Medical conditions are required'],
          health_status: formData.health_status ? [] : ['Health status is required'],
          last_donation: formData.last_donation ? [] : ['Last donation is required'],
        })
        return;
      }
      else {
        setActiveStep(activeStep + 1);
      }
    }
    else if (activeStep == 2) {
      if (location) {
        setActiveStep((prev) => prev + 1);
      }
    }
  }

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

    // now array of medical conditions should be converted to comma separated string
    const medical_conditions = formData.medical_conditions.join(',');
    const actual_sending_object: BloodDonor = {
      ...formData,
      medical_conditions,
      weight: +formData.weight,
      height: +formData.height,
      contact_number: +formData.contact_phone,
      // date_of_birth: new Date(formData.date_of_birth),
      last_donated_date: formData.last_donation,
      current_health_status: formData.health_status,
      current_medication: formData.medications
    };

    const response = await registerBloodDonor(actual_sending_object);

    setErrors({});

    if ("errors" in response && response.status === "error") {
      console.log(response.errors);
      if (response.message === 'validation error') {
        alert(`Submission Failed! Fill all the information correctly!`);
        setErrors(response.errors);
      }
      else
        alert(`Submission Failed! Response is ${response.message}`);
      console.error(response);
    } else {
      alert('Submitted successfully!');
      setTimeout(() => router.push('/profile'), 1200);
    }
  };

  return (
    <>
      <img src="/wall_simplified.jpg" alt="Wall Background" className='fixed h-screen w-full' />
      <div className="max-w-2xl mx-auto p-6 relative">
        <h1 className="text-2xl font-bold mb-6 text-center dark:bg-gray-800 bg-white p-3">Become a Blood Donor</h1>

        <div className="formflex min-h-screen">

          <div className="flex justify-between mb-6 bg-gray-200 dark:bg-gray-800 bg-white items-center">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`text-center h-full p-2 py-4 rounded ${index === activeStep ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}
              >
                {label}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 border p-5 rounded dark:bg-gray-800 bg-white">
            {activeStep === 0 && (
              <>
                <label htmlFor="name">
                  Full Name
                  <span className='text-red-500'>*</span>
                </label>
                <input id='name' name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border" required />
                {errors && errors.name && <p className='text-red-500'>{errors.name[0]}</p>}

                <label htmlFor="contact_phone">
                  Phone Number
                  <span className='text-red-500'>*</span>
                </label>
                <input id='contact_phone' name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="w-full p-2 border" required />
                {errors && errors.contact_phone && <p className='text-red-500'>{errors.contact_phone[0]}</p>}

                <select name="blood_type" value={formData.blood_type} onChange={handleChange} className="w-full p-2 border dark:bg-gray-800" required>
                  <option value="">Select Blood Type
                    <span className="text-red-500">*</span>
                  </option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                {errors && errors.blood_type && <p className='text-red-500'>{errors.blood_type[0]}</p>}

                <label htmlFor="address">
                  Address
                  <span className='text-red-500'>*</span>
                </label>
                <input id='address' name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border" required />
                {errors && errors.address && <p className='text-red-500'>{errors.address[0]}</p>}

                <label htmlFor="date_of_birth">
                  Date of Birth
                  <span className='text-red-500'>*</span>
                </label>
                <input id='date_of_birth' name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" className="w-full p-2 border" required />
                {errors && errors.date_of_birth && <p className='text-red-500'>{errors.date_of_birth[0]}</p>}
              </>
            )}

            {activeStep === 1 && (
              <>
                <input name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)*" type="number" className="w-full p-2 border" required />
                {errors && errors.weight && <p className='text-red-500'>{errors.weight[0]}</p>}
                <input name="height" value={formData.height} onChange={handleChange} placeholder="Height (cm)" type="number" className="w-full p-2 border" required />
                {errors && errors.height && <p className='text-red-500'>{errors.height[0]}</p>}

                <label htmlFor="last_donation">
                  Last Donated Date
                  <span className='text-red-500'>*</span>
                </label>
                <input id='last_donation' name="last_donation" value={formData.last_donation} onChange={handleChange} type="date" className="w-full p-2 border mt-1" />
                {errors && errors.last_donation && <p className='text-red-500'>{errors.last_donation[0]}</p>}

                <fieldset className="border p-4">
                  <legend className="text-sm font-medium">Medical Conditions</legend>
                  {['Diabetes', 'Heart Disease', 'High Blood Pressure', 'HIV/AIDS', 'Hepatitis'].map((condition) => (
                    <label key={condition} className="block">
                      <input type="checkbox" value={condition} onChange={handleMultiCheck} checked={formData.medical_conditions.includes(condition)} className="mr-2" />
                      {condition}
                    </label>
                  ))}
                </fieldset>
                {errors && errors.medical_conditions && <p className='text-red-500'>{errors.medical_conditions[0]}</p>}

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
                {errors && errors.health_status && <p className='text-red-500'>{errors.health_status[0]}</p>}
              </>
            )}

            {activeStep === 2 && (
              <>
                <p className="mb-2">Please select your contact location within {radius.current} km reach</p>
                <MapPicker location={location} onChange={setLocation} radius={radius.current} width='100%' height='500px' />
                <p className="mb-2 text-sm">(It will be updated in your profile too)</p>
                {errors && errors.latitude && <p className='text-red-500'>{errors.latitude[0]}</p>}
                {errors && errors.longitude && <p className='text-red-500'>{errors.longitude[0]}</p>}
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
                <button type="button" onClick={handleBack} className="bg-gray-300 text-black px-4 py-2 rounded">
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
    </>
  );
}
