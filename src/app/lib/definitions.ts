export type User = {
    id: Number;
    name: string;
    email: string;
    email_verified_at: Date;
    created_at: Date;
    updated_at: Date;
}

export type AuthResponse = {
    status?: string,
    token?: string,
    user?: User,
    message?: string
}