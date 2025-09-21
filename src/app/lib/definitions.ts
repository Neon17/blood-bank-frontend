export type User = {
    id: Number;
    name: string;
    email: string;
    email_verified_at: Date;
    dob: Date;
    will_donate: boolean;
    verified_as_donor: boolean;
    blood_group: string;
    last_donated: Date;
    last_verified: Date;
    address: string;
    city: string;
    country: string;
    current_city: string;
    latitude: number;
    longitude: number;
    phone_number: string;
    role: string;
    password: string;
    remember_token: string;
    verification_photo: string;
    profile_photo_id: string;
    profilePhoto?: Upload;
    profile_photo: string;
    created_at: Date;
    updated_at: Date;
}

export type Upload = {
    name: string,
    extension: string,
    path: string,
    url: string
    storage_in_kb: string
};

export type ExactLocation = {
    lat: number;
    lng: number;
    city: string;
    country: string;
    label?: object
};

export type AuthResponse = {
    status?: string,
    token?: string,
    user?: User,
    message?: string
}

export type ErrorResponse = {
    status: string,
    message: string,
    errors?: []
}

export enum verification_status {
    pending = "pending",
    failed = "failed",
    approved = "approved"
}

export type DonorRegistrationForm = {
    id?: number | string,
    name: '',
    contact_phone: '',
    blood_type: '',
    address: '',
    date_of_birth: '',
    weight: '',
    height: '',
    latitude: number,
    longitude: number,
    country: '',
    city: '',
    last_donation: '',
    medical_conditions: string[],
    medications: '',
    health_status: '',
    agreement: false,
}

export type BloodDonor = {
    id?: number | string,
    user_id?: number,
    contact_number?: number,
    blood_type?: string,
    address?: string,
    date_of_birth?: string,

    weight?: number,
    height?: number,
    last_donated_date?: string,
    medical_conditions?: string,
    current_medication?: string,
    current_health_status?: string,

    latitude: number,
    longitude: number,
    city: string,
    country: string

    verification_status?: verification_status,
    verificationPhoto?: Upload,
    verification_photo_id?: string,
    admin_message?: string,
    user? : User
}

export type BloodRequest = {
    id?: Number | undefined;
    blood_type?: string | undefined;
    quantity?: string | undefined;
    date_time?: Date | undefined;
    exact_location?: string | undefined;
    contact_number?: string | undefined;
    state?: string | undefined;
    user_id?: number | undefined;
    donated_by?: string | undefined;
    verification_status?: string | undefined;
    verification_photo?: Upload | undefined;
    user?: User | undefined;
    blood_bank?: string | undefined;
    created_at?: Date | undefined;
    updated_at?: Date | undefined;

    status: string;
    latitude: number;
    longitude: number;
    city: string;
    country: string;
}
