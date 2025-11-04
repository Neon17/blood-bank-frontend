'use client';

import { useState, useEffect } from 'react';
import { myDonorApplication } from "@/app/lib/actions";
import { 
    CheckCircle, 
    MinusCircle, 
    XCircle, 
    MapPin, 
    Phone, 
    Calendar, 
    Scale, 
    Ruler,
    Heart,
    Pill,
    Activity,
    Edit3,
    AlertCircle
} from "lucide-react";
import { verification_status } from "@/app/lib/definitions";
import Link from "next/link";

// Dynamically import MapPickerWrapper with error handling
const MapPickerWrapper = dynamic(() => import("@/app/_components/MapPickerWrapper").catch(() => {
    // Return a fallback component if import fails
    return () => <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
        <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Map unavailable</p>
        </div>
    </div>;
}), { 
    ssr: false,
    loading: () => <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
    </div>
});

import dynamic from 'next/dynamic';

const steps = ['Personal Information', 'Medical History', 'Contact Location', 'Confirmation'];

export default function DonorProfilePage() {
    const radius = 2;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await myDonorApplication();
                
                if (!result) {
                    throw new Error('No data received from server');
                }
                
                if ('message' in result) {
                    throw new Error(result.message || 'Failed to load donor profile. Please try again');
                }
                
                setData(result);
            } catch (err) {
                console.error('Error fetching donor data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load donor profile');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading donor profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Error Loading Profile
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error}
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Try Again</span>
                    </button>
                </div>
            </div>
        );
    }

    // No donor profile state
    if (!data || !("data" in data) || !data.data) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        No Donor Profile Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You need to complete the donor application to create your donor profile and start saving lives.
                    </p>
                    <Link 
                        href="/donor/application" 
                        className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>Start Donor Application</span>
                    </Link>
                </div>
            </div>
        );
    }

    const donorData = data.data;
    const status = donorData.verification_status;

    const getStatusBadge = () => {
        const baseClasses = "inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium";
        
        if (status === verification_status.approved) {
            return (
                <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300`}>
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Donor</span>
                </span>
            );
        } else if (status === verification_status.failed) {
            return (
                <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300`}>
                    <XCircle className="w-4 h-4" />
                    <span>Verification Failed</span>
                </span>
            );
        } else {
            return (
                <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300`}>
                    <MinusCircle className="w-4 h-4" />
                    <span>Pending Verification</span>
                </span>
            );
        }
    };

    const InfoCard = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Icon className="w-5 h-5" />
                <span>{title}</span>
            </h3>
            {children}
        </div>
    );

    // Safe data access with fallbacks
    const safeData = {
        contact_number: donorData.contact_number || 'Not provided',
        blood_group: donorData.blood_group || 'Not specified',
        address: donorData.address || 'Not provided',
        date_of_birth: donorData.date_of_birth || 'Not provided',
        last_donated_date: donorData.last_donated_date || 'Never donated',
        weight: donorData.weight ? `${donorData.weight} kg` : 'Not provided',
        height: donorData.height ? `${donorData.height} cm` : 'Not provided',
        current_health_status: donorData.current_health_status || 'Not specified',
        medical_conditions: donorData.medical_conditions || [],
        current_medication: donorData.current_medication || 'None',
        latitude: donorData.latitude || 27.7172,
        longitude: donorData.longitude || 85.3240,
        city: donorData.city || 'Unknown',
        country: donorData.country || 'Unknown'
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-0 m-0">
            {/* Header */}
            <div className=" border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Donor Profile
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Your contact details and medical information for blood donation
                            </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                            <Link 
                                href={`/contacts/${donorData.id}/edit`}
                                className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </Link>
                            {getStatusBadge()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Map Section */}
                    <div className="space-y-6">
                        <InfoCard title="Contact Location" icon={MapPin}>
                            <div className="rounded-xl overflow-hidden h-80">
                                <MapPickerWrapper
                                    location={{
                                        lat: safeData.latitude,
                                        lng: safeData.longitude,
                                        city: safeData.city,
                                        country: safeData.country,
                                    }}
                                    radius={radius}
                                />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                                This is your current contact location where you can be reached for nearby blood requests within {radius}km radius.
                            </p>
                        </InfoCard>
                    </div>

                    {/* Donor Information */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <InfoCard title="Contact Information" icon={Phone}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Phone Number
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {safeData.contact_number}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Blood Type
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {safeData.blood_group}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Address
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {safeData.address}
                                    </p>
                                </div>
                            </div>
                        </InfoCard>

                        {/* Personal Details */}
                        <InfoCard title="Personal Details" icon={Calendar}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Date of Birth
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {safeData.date_of_birth}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Last Donation
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {safeData.last_donated_date}
                                    </p>
                                </div>
                            </div>
                        </InfoCard>

                        {/* Physical Information */}
                        <InfoCard title="Physical Information" icon={Activity}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <Scale className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Weight
                                        </label>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {safeData.weight}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Ruler className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Height
                                        </label>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {safeData.height}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>

                        {/* Medical Information */}
                        <InfoCard title="Medical Information" icon={Heart}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        Health Status
                                    </label>
                                    <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                                        <Activity className="w-4 h-4" />
                                        <span className="capitalize font-medium">{safeData.current_health_status}</span>
                                    </div>
                                </div>

                                {safeData.medical_conditions.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                            Medical Conditions
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {safeData.medical_conditions.split(",").map((condition: string) => (
                                                <span 
                                                    key={condition}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                >
                                                    {condition}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {safeData.current_medication && safeData.current_medication !== 'None' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                            Current Medications
                                        </label>
                                        <div className="flex items-start space-x-2">
                                            <Pill className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                            <p className="text-gray-900 dark:text-white">
                                                {safeData.current_medication}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </InfoCard>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add missing RefreshCw icon component
function RefreshCw({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    );
}