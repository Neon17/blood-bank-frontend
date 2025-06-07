"use server"

import { redirect } from "next/navigation";
import api from "./axios";

export async function profile () {
    try {
        const response = await api.get('/profile');
        const data = await response.data;
        return data;
    } catch (error: any | { message: string }) {
        console.log(error);
        return {
            status: 'error',
            message: error.message
        }
    }
}