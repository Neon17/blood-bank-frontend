"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createBloodRequest } from "@/app/lib/actions";

const MapPicker = dynamic(() => import("@/app/_components/MapPicker"), { ssr: false });
// import MapPicker from "@/app/_components/MapPicker";

const steps = ["Request Details", "Location", "Verification", "Confirmation"];
const visibilityOptions = ["name", "verification_photo", "address", "location", "quantity", "date", "contact_number"];
const autoVisible = ["name", "address", "quantity", "date", "contact_number"];
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CreateRequest() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({
        blood_type: [] as string[],
        quantity: [] as string[],
        date_time: [] as string[],
        exact_location: [] as string[],
        contact_number: [] as string[],
        city: [] as string[],
        country: [] as string[]
    });
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [location, setLocation] = useState({
        lat: 27.7172,
        lng: 85.3240,
        city: "Kathmandu",
        country: "Nepal",
    });

    const [formData, setFormData] = useState({
        blood_type: "",
        quantity: "",
        date_time: "",
        exact_location: "",
        contact_number: "",
        verification_photo: null as File | null,
        visibility: autoVisible,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, files } = e.target as any;
        if (type === "file") {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleVisibilityCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            const set = new Set(prev.visibility);
            checked ? set.add(value) : set.delete(value);
            return { ...prev, visibility: Array.from(set) };
        });
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("handle submit called, active step = " + activeStep);
        if (activeStep < steps.length - 1) return;

        const data = new FormData();

        Object.entries(formData).forEach(([key, val]) => {
            if (val instanceof File) {
                data.append(key, val); // File is valid Blob
            } else if (Array.isArray(val)) {
                data.append(key, val.join(",")); // convert array to string
            } else if (val !== null && val !== undefined) {
                data.append(key, String(val)); // safely cast to string
            }
        });

        setSubmitting(true);
        // Timeout is necessary to get city and country name from geocoder (reverse geocoder from leaflet)
        setTimeout(async () => {
            if (!location.city && !location.country) {
                location.city = "Kathmandu";
                location.country = "Nepal";
            }
            data.append("city", location.city);
            data.append("country", location.country);
            data.append("lat", location.lat.toString());
            data.append("lng", location.lng.toString());

            const res = await createBloodRequest(data);

            if ("message" in res && res.status === "error") {
                if (res.message == 'validation error')
                    setError("Please fill all the required form details in standard way");
                else setError(res.message);
                setErrors(res.errors);
                alert(res.message + ": check error by seeing previous input clicking on back button consecutively");
            } else {
                setSuccess("Request created successfully");
                alert("Request created successfully");
                router.push("/requests");
            }

            setSubmitting(false);
        }, 1200)
    };


    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-10">
            <div className="w-full max-w-7xl flex flex-col items-center">


                <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8">
                    <h2 className="text-3xl font-semibold text-center mb-10">Create Blood Request</h2>

                    {/* Stepper */}
                    <div className="flex justify-between mb-8">
                        {steps.map((label, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${i === activeStep ? "bg-red-600 text-white border-red-600" : "border-gray-300 text-gray-500"}`}
                                >
                                    {i + 1}
                                </div>
                                <span className={`mt-2 text-sm ${i === activeStep ? "text-red-600 font-medium" : "text-gray-500"}`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {error && <div className="w-full bg-red-600 text-white dark:bg-red-400 text-black p-3 mb-5">
                        <p>{error}</p>
                    </div>}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Step 1: Request Details */}
                        {activeStep === 0 && (
                            <div className="space-y-4">
                                <Field label="Blood Type*">
                                    <select
                                        name="blood_type"
                                        value={formData.blood_type}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500"

                                    >
                                        <option value="">Choose Blood Type</option>
                                        {bloodTypes.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </Field>
                                {errors && errors.blood_type && <div className="text-red-500">{errors.blood_type}</div>}

                                <InputField label="Quantity*" name="quantity" value={formData.quantity} onChange={handleChange} />
                                {errors && errors.quantity && <div className="text-red-500">{errors.quantity}</div>}

                                <InputField type="date*" label="Date" name="date_time" value={formData.date_time} onChange={handleChange} />
                                {errors && errors.date_time && <div className="text-red-500">{errors.date_time}</div>}

                                <InputField label="Exact Location*" name="exact_location" value={formData.exact_location} onChange={handleChange} />
                                {errors && errors.exact_location && <div className="text-red-500">{errors.exact_location}</div>}

                                <InputField label="Contact Number*" name="contact_number" value={formData.contact_number} onChange={handleChange} />
                                {errors && errors.contact_number && <div className="text-red-500">{errors.contact_number}</div>}
                            </div>
                        )}

                        {/* Step 2: Location */}
                        {activeStep === 1 && (
                            <div>
                                <p className="mb-2">Pick request location*</p>
                                <MapPicker width="100%" height="400px" location={location} onChange={setLocation} />
                            </div>
                        )}

                        {/* Step 3: Verification */}
                        {activeStep === 2 && (
                            <div className="space-y-4">
                                <Field label="Verification Photo">
                                    <input type="file" name="verification_photo" onChange={handleChange} />
                                </Field>
                                <div>
                                    <p className="text-sm font-medium mb-2">Choose what to show publicly:</p>
                                    {visibilityOptions.map(opt => (
                                        <label key={opt} className="flex items-center mb-1">
                                            <input
                                                type="checkbox"
                                                value={opt}
                                                checked={formData.visibility.includes(opt)}
                                                onChange={handleVisibilityCheck}
                                                className="mr-2"
                                            />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Confirmation */}
                        {activeStep === 3 && (
                            <div className="text-gray-700 text-sm space-y-2">
                                <p>Please review your request before submitting.</p>
                                <ul className="list-disc list-inside">
                                    <li><strong>Blood Type:</strong> {formData.blood_type}</li>
                                    <li><strong>Quantity:</strong> {formData.quantity}</li>
                                    <li><strong>Date:</strong> {formData.date_time}</li>
                                    <li><strong>Location:</strong> {formData.exact_location}, {location.city}</li>
                                    <li><strong>Contact:</strong> {formData.contact_number}</li>
                                </ul>
                            </div>
                        )}

                        {/* Nav buttons */}
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
                            ) : (<>
                                {submitting && <button
                                    type="submit"
                                    className="px-6 py-2 rounded bg-gray-800 text-white hover:bg-green-700" disabled
                                >
                                    Submitting...
                                </button>}
                                {!submitting &&
                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Submit
                                    </button>
                                }
                            </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* Utility components */
function InputField({ label, name, value, onChange, type = "text" }: any) {
    return (
        <Field label={label}>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500"
            />
        </Field>
    );
}

function Field({ label, children }: any) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            {children}
        </div>
    );
}
