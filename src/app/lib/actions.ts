"use server"

import api from "./axios";
import { BloodRequest, User } from "./definitions";

export async function profile () {
    try {
        const response = await api.get('/user');
        const data: User = await response.data;
        return data;
    } catch (error: any | { message: string }) {
        return {
            status: 'error',
            message: error.message
        }
    }
}

export async function BloodRequests() {
    try {
        const response = await api.get('/blood/requests');
        const data: [{
            status: string,
            data: BloodRequest
        }] = await response.data;
        return data;
    } catch (error: any | { message: string }) {
        return {
            status: 'error',
            message: error.message
        }
    }
}

export async function test() {
    try {
        const response = await api.get('/test');
        const data = await response.data;
        return data;
    } catch (error: any | { message: string }) {
        return {
            status: 'error',
            message: error.message
        }
    }
}
