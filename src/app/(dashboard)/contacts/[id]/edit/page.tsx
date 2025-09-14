"use client";

// Dynamically import MapPicker wrapper so it only runs on server side
import MapPickerWrapper from "@/app/_components/MapPickerWrapper";
import { useEffect, useRef, useState } from "react";
import { editDonorApplication, updateDonorApplication } from "@/app/lib/actions";
import { BloodDonor, ExactLocation } from "@/app/lib/definitions";

const steps = ['Personal Information', 'Medical History', 'Contact Location', 'Confirmation'];

type DonorApplicationError = {
    contact_number?: string[];
    address?: string[];
    date_of_birth?: string[];
    blood_type?: string[];
    weight?: string[];
    height?: string[];
    last_donated_date?: string[];
    medical_conditions?: string[];
    current_medication?: string[];
    current_health_status?: string[];
    latitude?: string[];
    longitude?: string[];
    city?: string[];
    country?: string[]
}

export default function Page({ params }: { params: { id: string } }) {
    const radius = useRef(2);
    const [data, setData] = useState<BloodDonor>();
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<DonorApplicationError>();
    const [success, setSuccess] = useState('');

    const fetchData = async () => {
        const { id } = await params;
        const data = await editDonorApplication(id);
        if ("data" in data) {
            setData(data.data);
        }
        else {
            setError(data.message);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const updated_data = await updateDonorApplication(data!);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // For smooth scrolling
        });
        if ("data" in updated_data) {
            setData(updated_data.data);
            setSuccess("Successfully Updated the Donor Application");
        }
        else {
            setErrors(updated_data.errors); // validation error catch
            setError(updated_data.message);
            // console.log(updated_data);
        }
    }

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        }
    }, [success]);

    useEffect(() => {
        fetchData();
    }, []);


    return (
        (data) &&
        <div className="w-full h-full">
            {/* <div className="text-message py-10 px-5">
                <p className="title">
                    Contact Address is different than Profile Address. 
                </p>
                <p className="describe-address">
                    It is the address where you are now and where you can be contacted if blood requests appear within this address 10km range
                </p>
                <p className="another-address">
                    Profile Address is home address where you generally live. Donor Registration Form Details can be seen, updated.
                </p>
                <p className="working">
                    We are working on this part...
                </p>
            </div> */}

            <h2 className="text-2xl lg:text-4xl text-center mb-5">
                Contact Details
            </h2>

            {/* Success Message */}
            {success && (
                <div className="success-message px-5 py-3 ms-5 me-8 w-full text-center bg-green-500">
                    <p className="text-white">{success}</p>
                </div>
            )}

            <div className="lg:flex lg:h-screen w-full">

                {/* Map section */}
                <div className="rounded-2xl py-6 h-[32rem] lg:h-full w-full px-6 sm:px-0 sm:ps-5">
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
                <div className="lg:w-2/3 mx-auto p-6 relative">

                    <div className="formflex min-h-screen">

                        <form onSubmit={handleSubmit} className="space-y-4 border p-5 rounded dark:bg-gray-800 bg-white">

                            <div className="formfield pb-2">
                                <label htmlFor="contact_phone">
                                    Phone Number
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input id='contact_phone' name="contact_phone" type="number"
                                    value={data.contact_number}
                                    onChange={(e) => setData({ ...data, contact_number: +e.target.value })} className="w-full p-2 border m-0" required />
                                {errors && errors.contact_number && <p className="text-red-500">{errors.contact_number}</p>}
                            </div>

                            <div className="formfield pb-2">
                                <label htmlFor="blood_type">Blood Type</label>
                                <input id="blood_type" name="blood_type" value={data.blood_type}
                                    onChange={(e) => setData({ ...data, blood_type: e.target.value })} className="w-full p-2 border dark:bg-gray-800" required />
                                {errors && errors.blood_type && <p className="text-red-500">{errors.blood_type}</p>}
                            </div>

                            <div className="formfield pb-2">
                                <label htmlFor="address">
                                    Address
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input id='address' name="address" value={data.address}
                                    onChange={(e) => setData({ ...data, address: e.target.value })}
                                    className="w-full p-2 border" required />
                                {errors && errors.address && <p className="text-red-500">{errors.address}</p>}
                            </div>


                            <div className="formfield pb-2">
                                <input name="weight" value={data.weight}
                                    onChange={(e) => setData({ ...data, weight: +e.target.value })}
                                    placeholder="Weight (kg)*" type="number" className="w-full p-2 border" required />
                                {errors && errors.weight && <p className="text-red-500">{errors.weight}</p>}
                            </div>

                            <div className="formfield pb-2">
                                <input name="height" value={data.height}
                                    onChange={(e) => setData({ ...data, height: +e.target.value })}
                                    placeholder="Height (cm)" type="number" className="w-full p-2 border" required />
                                {errors && errors.height && <p className="text-red-500">{errors.height}</p>}
                            </div>

                            <div className="formfield pb-2">
                                <label htmlFor="last_donation">
                                    Last Donated Date
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input id='last_donation' name="last_donation"
                                    value={data.last_donated_date} type="date"
                                    onChange={(e) => setData({ ...data, last_donated_date: e.target.value })}
                                    className="w-full p-2 border mt-1" />
                                {errors && errors.last_donated_date && <p className="text-red-500">{errors.last_donated_date}</p>}
                            </div>

                            <div className="formfield pb-2">
                                {data && data.medical_conditions && <fieldset className="border p-4">
                                    <legend className="text-sm font-medium">Medical Conditions</legend>
                                    {['Diabetes', 'Heart Disease', 'High Blood Pressure', 'HIV/AIDS', 'Hepatitis'].map((condition) => (
                                        <label key={condition} className="block">
                                            <input type="checkbox" value={condition} checked={data.medical_conditions?.includes(condition)}
                                                onChange={(e) => {
                                                    const conditions = [...data.medical_conditions!];
                                                    if (e.target.checked) {
                                                        conditions.push(condition);
                                                    } else {
                                                        conditions.splice(conditions.indexOf(condition), 1);
                                                    }
                                                    setData({ ...data, medical_conditions: conditions });
                                                }}
                                                className="mr-2" />
                                            {condition}
                                        </label>
                                    ))}
                                </fieldset>}
                                {errors && errors.medical_conditions && <p className="text-red-500">{errors.medical_conditions}</p>}
                            </div>


                            <div className="formfield pb-2">
                                <textarea name="medications"
                                    onChange={(e) => setData({ ...data, current_medication: e.target.value })}
                                    placeholder="Current Medications" className="w-full p-2 border" rows={2}>{data.current_medication ?? ""}</textarea>
                                {errors && errors.current_medication && <p className="text-red-500">{errors.current_medication}</p>}
                            </div>

                            <div className="formfield pb-2">
                                <fieldset className="border p-4">
                                    <legend className="text-sm font-medium">Current Health Status</legend>
                                    {['excellent', 'good', 'fair', 'poor'].map(status => (
                                        <label key={status} className="block">
                                            <input type="radio" name="health_status" value={status}
                                                onChange={(e) => setData({ ...data, current_health_status: e.target.value })}
                                                checked={data.current_health_status === status} className="mr-2" />
                                            {status}
                                        </label>
                                    ))}
                                </fieldset>
                                {errors && errors.current_health_status && <p className="text-red-500">{errors.current_health_status}</p>}
                            </div>


                            <div className="text-sm">
                                <p className="mb-2">By agreeing to become a donor, you confirm that:</p>
                                <ul className="list-disc list-inside mb-2">
                                    <li>You are at least 18 years old</li>
                                    <li>You weigh at least 50kg</li>
                                    <li>You are in good health</li>
                                </ul>
                            </div>


                            <div className="flex justify-end">
                                <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                    Update
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}