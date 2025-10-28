"use server"

import { asyncErrorHandler } from "./asyncErrorHandler";
import api from "./axios";
import { BloodRequest, User, BloodDonor, ApiResponse, PaginatedResponse, ErrorResponse } from "./definitions";

export const getAllUsers = asyncErrorHandler(_getAllUsers);
export const profile = asyncErrorHandler(_profile);
export const createBloodRequest = asyncErrorHandler(_createBloodRequest);
export const updateProfile = asyncErrorHandler(_updateProfile);
export const updateProfilePhoto = asyncErrorHandler(_updateProfilePhoto);
export const bloodRequests = asyncErrorHandler(_bloodRequests);
export const allBloodRequests = asyncErrorHandler(_allBloodRequests);
export const bloodRequest = asyncErrorHandler(_bloodRequest);
export const bloodDonors = asyncErrorHandler(_bloodDonors);
export const registerBloodDonor = asyncErrorHandler(_registerBloodDonor);

export const donorApplications = asyncErrorHandler(_donorApplications);
export const deleteDonorApplication = asyncErrorHandler(_deleteDonorApplication);
export const editDonorApplication = asyncErrorHandler(_editDonorApplication);
export const updateDonorApplication = asyncErrorHandler(_updateDonorApplication);
export const myDonorApplication = asyncErrorHandler(_myDonorApplication);
export const approveBloodDonorApplication = asyncErrorHandler(_approveBloodDonorApplication);

export const editRequestApplication = asyncErrorHandler(_editRequestApplication);
export const updateRequestApplicationByFormData = asyncErrorHandler(_updateBloodRequest);
export const updateRequestApplication = asyncErrorHandler(_updateRequestApplication);
export const myRequestApplication = asyncErrorHandler(_yourBloodRequest);
export const cancelRequestApplication = asyncErrorHandler(_cancelRequestApplication);
export const completeRequestApplication = asyncErrorHandler(_completeRequestApplication);
// Admin tasks of Request applications (below 2 lines)
export const approveRequestApplication = asyncErrorHandler(_approveRequestApplication);
export const rejectRequestApplication = asyncErrorHandler(_rejectRequestApplication);

export const finishRequestApplication = asyncErrorHandler(_finishBloodRequests);
export const deleteRequestApplication = asyncErrorHandler(_deleteBloodRequest);
export const test = asyncErrorHandler(_test);

async function _profile() {
    const response = await api.get('/user');
    const data: User = await response.data;
    return data;
}

async function _getAllUsers ($query = {}) {
    const response = await api.get('/users', { params: $query });
    const data: ApiResponse<PaginatedResponse<User>> | ErrorResponse = response.data;
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

async function _updateProfilePhoto( formData: FormData ) {
    const response = await api.patch('/profile/photo/update', formData);
    const data : {
        status: string,
        data: User
    } = await response.data;
    return data;
}

async function _bloodRequests($query = {}) {
    const response = await api.get('/blood/requests', { params: $query });
    const data: {
        status: string,
        data: BloodRequest[]
    } = await response.data;
    return data;
}

async function _allBloodRequests($query = {}) {
    const response = await api.get('/blood/requests/all', { params: $query });
    const data: {
        status: string,
        data: BloodRequest[]
    } = await response.data;
    return data;
}

async function _yourBloodRequest(){
    const response = await api.get('/blood/requests/yours');
    const data: {
        status: string,
        data: BloodRequest[]
    } = await response.data;
    return data;
}

async function _deleteRequestApplication(id: string) {
    const response = await api.delete(`/blood/requests/${id}`);
    const data : { 
        status: string,
        data: BloodDonor
    } = await response.data;
    return data;
}

async function _editRequestApplication(id: string) {
    const response = await api.get(`/blood/requests/${id}/edit`);
    const data: {
        status: string,
        data: BloodDonor
    } | {
        status: string,
        message: string
    } = await response.data;
    return data;
}

async function _updateRequestApplication(formData: BloodRequest) {
    const response = await api.patch(`/blood/requests/${formData.id}`, formData);
    const data: {
        status: string,
        data: BloodRequest
    } = await response.data;
    return data;
}

async function _approveRequestApplication(formData: BloodRequest){
    const response = await api.patch(`/blood/requests/${formData.id}/approve`);
    const data: {
        status: string,
        data: BloodRequest
    } = await response.data;
    return data;
}

async function _rejectRequestApplication(formData: BloodRequest){
    const response = await api.patch(`/blood/requests/${formData.id}/reject`);
    const data: {
        status: string,
        data: BloodRequest
    } = await response.data;
    return data;
}

async function _cancelRequestApplication(formData: BloodRequest){
    const response = await api.patch(`/blood/requests/${formData.id}/cancel`);
    const data: {
        status: string,
        data: BloodRequest
    } = await response.data;
    return data;
}

async function _completeRequestApplication(formData: BloodRequest){
        const response = await api.patch(`/blood/requests/${formData.id}/complete`);
    const data: {
        status: string,
        data: BloodRequest
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

async function _donorApplications($query = {}) {
    const response = await api.get('/blood/donors', { params: $query });
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

async function _editDonorApplication(id: string) {
    const response = await api.get(`/blood/donors/${id}/edit`);
    const data: {
        status: string,
        data: BloodDonor
    } | {
        status: string,
        message: string
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

async function _approveBloodDonorApplication(formData: BloodDonor){
    const response = await api.patch(`/blood/donors/${formData.id}/status`, formData);
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
    const response = await api.post('/blood/requests', formData);
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
