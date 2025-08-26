"use server"

import { asyncErrorHandler } from "./asyncErrorHandler";
import api from "./axios";
import { BloodRequest, User, BloodDonor } from "./definitions";

export const getAllUsers = asyncErrorHandler(_getAllUsers);
export const profile = asyncErrorHandler(_profile);
export const createBloodRequest = asyncErrorHandler(_createBloodRequest);
export const updateProfile = asyncErrorHandler(_updateProfile);
export const bloodRequests = asyncErrorHandler(_bloodRequests);
export const bloodRequest = asyncErrorHandler(_bloodRequest);
export const bloodDonors = asyncErrorHandler(_bloodDonors);

export const donorApplications = asyncErrorHandler(_donorApplications);
export const deleteDonorApplication = asyncErrorHandler(_deleteDonorApplication);
export const updateDonorApplication = asyncErrorHandler(_updateDonorApplication);
export const myDonorApplication = asyncErrorHandler(_myDonorApplication);

export const registerBloodDonor = asyncErrorHandler(_registerBloodDonor);
export const finishBloodRequests = asyncErrorHandler(_finishBloodRequests);
export const updateBloodRequest = asyncErrorHandler(_updateBloodRequest);
export const deleteBloodRequest = asyncErrorHandler(_deleteBloodRequest);
export const test = asyncErrorHandler(_test);

async function _profile() {
    const response = await api.get('/user');
    const data: User = await response.data;
    return data;
}

async function _getAllUsers () {
    const response = await api.get('/users');
    const data : {
        status: string,
        data: User[]
    } = await response.data;
    return data;
}

async function _updateProfile(formData: FormData) {
    // console.log("updating");
    // for (const [key, value] of formData.entries()) {
    //     console.log(key, value);
    // }
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
    const data: {
        status: string,
        data: BloodRequest[]
    } = await response.data;
    return data;
}

async function _bloodDonors() {
    const response = await api.get('/donors');
    const data: {
        status: string,
        data: User[]
    } = await response.data;
    return data;
}

async function _donorApplications(){
    const response = await api.get('/blood/donors');
    const data : {
        status: string,
        data: BloodDonor[]
    } = await response.data;
    return data;
}

async function _deleteDonorApplication(id: string) {
    const response = await api.delete(`/blood/donors/${id}`);
    const data : { 
        status: string,
        data: BloodDonor
    } = await response.data;
    return data;
}

async function _updateDonorApplication(formData: BloodDonor) {
    const response = await api.put(`/blood/donors/${formData.id}`, formData);
    const data: {
        status: string,
        data: BloodDonor
    } = await response.data;
    return data;
}

async function _registerBloodDonor(formData: BloodDonor) {
    const response = await api.post('/blood/donors', formData);
    const data: {
        status: string,
        data: BloodDonor
    } = await response.data;
    return data;
}

async function _myDonorApplication() {
    const response = await api.get(`/blood/donors/me`);
    const data: {
        status: string,
        data: BloodDonor
    } = await response.data;
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

async function _createBloodRequest(formData: FormData) {
    var object:any = {};
    for (const[key,value] of formData.entries()){
        object[key] = value;
    }
    const response = await api.post('/blood/requests', object);
    const data: [{
        status: string,
        data: BloodRequest[]
    }] = await response.data;
    return data;
}

async function _bloodRequest(id:string){
    const response = await api.get(`/blood/requests/${id}`);
    const data: {
        status: string,
        data: BloodRequest
    } = await response.data;
    return data;
}

async function _updateBloodRequest(id: string, formData: FormData) {
    var object:any = {};
    for (const [key, value] of formData.entries()) {
        object[key] = value;
    }

    const response = await api.patch(`/blood/requests/${id}`, object);
    const data: {
        status: string,
        data: BloodRequest[]
    } = await response.data;
    return data;
}

async function _deleteBloodRequest(id: string) {
    const response = await api.delete(`/blood/requests/${id}`);
    const data: {
        status: string,
        data: BloodRequest
    } = await response.data;
    return data;
}

async function _test() {
    const response = await api.get('/test');
    const data = await response.data;
    return data;
}
