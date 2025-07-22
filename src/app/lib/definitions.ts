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