export type User = {
    id: Number;
    name: string;
    email: string;
    email_verified_at: Date;
    dob: Date;
    will_donate: boolean;
    verified_as_donor: boolean;
    blood_type: string;
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
    profile_photo: string;
    created_at: Date;
    updated_at: Date;
}

export type ExactLocation = {
    lat: number;
    lng: number;
    city: string;
    country: string;
};

export type AuthResponse = {
    status?: string,
    token?: string,
    user?: User,
    message?: string
}

enum verification_status {
    "pending",
    "failed",
    "approved"
}

export type BloodDonor = {
    user_id?: number,
    contact_number: number,
    blood_type: string,
    address: string,
    date_of_birth: string,

    weight: number,
    height: number,
    last_donated_date: string,
    medical_conditions: string,
    current_medication: string,
    current_health_status: string,

    latitude: number,
    longitude: number,
    city: string,
    country: string

    verification_status?: verification_status,
    admin_message?: string
}

export type BloodRequest = {
    id: Number,
    blood_type: string,
    quantity: string,
    date_time: Date,
    exact_location: string,
    contact_number: string,
    latitude: number,
    longitude: number,
    city: string,
    state: string,
    country: string,
    user_id: number,
    status: string,
    donated_by: string,
    verification_photo: string,
    user: User,
    blood_bank: string,
    created_at: Date,
    updated_at: Date
}