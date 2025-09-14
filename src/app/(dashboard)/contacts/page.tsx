import { myDonorApplication } from "@/app/lib/actions"

// Dynamically import MapPicker wrapper so it only runs on server side
import MapPickerWrapper from "@/app/_components/MapPickerWrapper";
import { CheckCircle, MinusCircle, XCircle } from "lucide-react";
import { verification_status } from "@/app/lib/definitions";
import Link from "next/link";

const steps = ['Personal Information', 'Medical History', 'Contact Location', 'Confirmation'];

export default async function Page() {
    const radius = 2;
    const data = await myDonorApplication();

    let badge = null;
    if (data && "data" in data && data.data) {
        const status = data.data.verification_status;


        if (status === verification_status.approved) {
            badge = (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="w-6 h-6" />
                    Verified
                </span>
            );
        } else if (status === verification_status.failed) {
            badge = (
                <span className="flex items-center gap-1 text-red-600 font-medium">
                    <XCircle className="w-6 h-6" />
                    Failed
                </span>
            );
        } else {
            badge = (
                <span className="flex items-center gap-1 text-yellow-600 font-medium">
                    <MinusCircle className="w-6 h-6" />
                    Pending
                </span>
            );
        }

    }


    return (
        ("data" in data && data.data) &&
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

            <h2 className="text-2xl lg:text-4xl text-center">
                Contact Details
            </h2>
            <p className="show-badges px-5 flex w-full justify-between">
                <Link href={`/contacts/${data.data.id}/edit`} type="button" className="focus:outline-none text-white bg-red-400 hover:bg-red-500 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-red-900">
                    Edit
                </Link>
                {badge}
            </p>

            <div className="lg:flex lg:h-screen w-full">

                {/* Map section */}
                <div className="rounded-2xl py-6 h-[32rem] lg:h-full w-full px-6 sm:px-0 sm:ps-5">
                    <MapPickerWrapper
                        location={{
                            lat: data.data.latitude,
                            lng: data.data.longitude,
                            city: data.data.city,
                            country: data.data.country,
                        }}
                        radius={radius}
                    />
                </div>
                <div className="lg:w-2/3 mx-auto p-6 relative">

                    <div className="formflex min-h-screen">

                        <form className="space-y-4 border p-5 rounded dark:bg-gray-800 bg-white mb-3">
                            <>

                                <label htmlFor="contact_phone">
                                    Phone Number
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input readOnly id='contact_phone' name="contact_phone" value={data.data.contact_number} className="w-full p-2 border" required />

                                <label htmlFor="blood_type">Blood Type</label>
                                <input readOnly id="blood_type" name="blood_type" value={data.data.blood_type} className="w-full p-2 border dark:bg-gray-800" required />

                                <label htmlFor="address">
                                    Address
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input readOnly id='address' name="address" value={data.data.address} className="w-full p-2 border" required />

                                <label htmlFor="date_of_birth">
                                    Date of Birth
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input readOnly id='date_of_birth' name="date_of_birth" value={data.data.date_of_birth} type="date" className="w-full p-2 border" required />
                            </>

                            <>
                                <input readOnly name="weight" value={data.data.weight} placeholder="Weight (kg)*" type="number" className="w-full p-2 border" required />
                                <input readOnly name="height" value={data.data.height} placeholder="Height (cm)" type="number" className="w-full p-2 border" required />

                                <label htmlFor="last_donation">
                                    Last Donated Date
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input readOnly id='last_donation' name="last_donation" value={data.data.last_donated_date} type="date" className="w-full p-2 border mt-1" />

                                {data.data && data.data.medical_conditions && <fieldset className="border p-4">
                                    <legend className="text-sm font-medium">Medical Conditions</legend>
                                    {['Diabetes', 'Heart Disease', 'High Blood Pressure', 'HIV/AIDS', 'Hepatitis'].map((condition) => (
                                        <label key={condition} className="block">
                                            <input readOnly type="checkbox" value={condition} checked={data.data.medical_conditions?.includes(condition)} className="mr-2" />
                                            {condition}
                                        </label>
                                    ))}
                                </fieldset>}

                                <textarea readOnly name="medications" value={data.data.current_medication ?? ""} placeholder="Current Medications" className="w-full p-2 border" rows={2}></textarea>

                                <fieldset className="border p-4">
                                    <legend className="text-sm font-medium">Current Health Status</legend>
                                    {['excellent', 'good', 'fair', 'poor'].map(status => (
                                        <label key={status} className="block">
                                            <input readOnly type="radio" name="health_status" value={status} checked={data.data.current_health_status === status} className="mr-2" />
                                            {status}
                                        </label>
                                    ))}
                                </fieldset>
                            </>

                            <>
                                <div className="text-sm">
                                    <p className="mb-2">By agreeing to become a donor, you confirm that:</p>
                                    <ul className="list-disc list-inside mb-2">
                                        <li>You are at least 18 years old</li>
                                        <li>You weigh at least 50kg</li>
                                        <li>You are in good health</li>
                                    </ul>
                                </div>
                            </>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}