export type User = {
    id: Number;
    name: string;
    email: string;
    email_verified_at: Date;
    dob: Date;
    created_at: Date;
    updated_at: Date;
}

export type AuthResponse = {
    status?: string,
    token?: string,
    user?: User,
    message?: string
}

export type BloodRequest = {
    id: Number,
    blood_type: string,
    quantity: string|number,
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