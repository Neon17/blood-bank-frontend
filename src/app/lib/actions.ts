"use server"

import { asyncErrorHandler } from "./asyncErrorHandler";
import api from "./axios";
import { BloodRequest, User } from "./definitions";


export const profile = asyncErrorHandler(_profile);
export const updateProfile = asyncErrorHandler(_updateProfile);
export const bloodRequests = asyncErrorHandler(_bloodRequests);
export const bloodDonors = asyncErrorHandler(_bloodDonors);
export const finishBloodRequests = asyncErrorHandler(_finishBloodRequests);
export const test = asyncErrorHandler(_test);

async function _profile() {
    const response = await api.get('/user');
    const data: User = await response.data;
    return data;
}

async function _updateProfile(formData: FormData) {
    for (const [key, value] of formData.entries()) {
        console.log(key, value);
    }
    formData.append('_method', 'PUT');
    const response = await api.post('/updateMe', formData);
    const data: {
        status: string,
        data: User
    } = await response.data;
    return data;
}

async function _bloodRequests() {
    const response = await api.get('/blood/requests');
    const data: [{
        status: string,
        data: BloodRequest[]
    }] = await response.data;
    return data;
}

async function _bloodDonors() {
    const response = await api.get('/donors');
    const data: [{
        status: string,
        data: User[]
    }] = await response.data;
    return data;
}

async function _finishBloodRequests(id: string) {
    const response = await api.post(`/blood/requests/${id}/finish`);
    const data: [{
        status: string,
        data: BloodRequest[]
    }] = await response.data;
    return data;

}

async function _test() {
    const response = await api.get('/test');
    const data = await response.data;
    return data;
}
