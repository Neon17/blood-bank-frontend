"use client";

import { useAuth } from "../../authInfo";

const EditProfile = () => {
    const { user, isLoggedIn } = useAuth();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Submit the form data to the server

        const formData = new FormData(event.currentTarget);
        const data = {
            email: formData.get('email'),
            name: formData.get('name'),
            address: formData.get('address'),
            dob: formData.get('dob'),
            phone: formData.get('phone'),
        };
    }
    return (
        <div className="w-full h-full">
            <div className="max-w-sm mx-auto w-full flex flex-col gap-8 bg-white p-4 rounded-md">
                <h1 className="text-2xl text-center m-3">User Profile</h1>
                <form className="" onSubmit={handleSubmit}>
                    <div className="mb-5 flex items-center gap-3">
                        <label className="block text-sm font-medium text-gray-900">Email:</label>
                         <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="test@example.com"
                                value={user?.email} required />
                    </div>

                    <div className="mb-5 flex items-center gap-3">
                        <label className="block text-sm font-medium text-gray-900">Name:</label>
                        <input type="text" id="name" name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="test@example.com"
                                value={user?.name} required />
                    </div>

                    <div className="mb-5 flex items-center gap-3">
                        <label className="block text-sm font-medium text-gray-900">Address:</label>
                        <input type="text" id="address" name="address"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="test@example.com"
                                value={user?.address} required />
                    </div>

                    <div className="mb-5 flex items-center gap-3">
                        <label className="block text-sm font-medium text-gray-900">Date of Birth:</label>
                        <input type="date" id="name" name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="test@example.com"
                                value={(user?.dob) ? user?.dob.split('T')[0] : "-"} required />
                    </div>


                    <div className="mb-5 flex items-center gap-3">
                        <label className="block text-sm font-medium text-gray-900">Role:</label>
                        <input type="text" id="name" name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="test@example.com"
                                value={(user?.role) ? user?.role : "-"} required />
                    </div>

                    <div className="mb-5 flex items-center gap-3">
                        <label className="block text-sm font-medium text-gray-900">City:</label>
                        <input type="text" id="name" name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="test@example.com"
                                value={(user?.city) ? user?.city : "-"} required />
                    </div>

                    <div className="mb-5 flex items-center gap-3">
                        <label className="block text-sm font-medium text-gray-900">Current City:</label>
                        <input type="text" id="name" name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="test@example.com"
                                value={(user?.current_city) ? user?.current_city : "-"} required />
                    </div>

                    <div className="mb-5 flex items-center gap-3">
                        <label className="block text-sm font-medium text-gray-900">Verified as Donor:</label>
                        <input type="text" id="name" name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="test@example.com"
                                value={(user?.verified_as_donor) ? "Yes" : "No"} required />
                    </div>

                    <div className="mb-5 flex items-center gap-3">
                        <label className="block text-sm font-medium text-gray-900">Last Donated:</label>
                        <input type="text" id="name" name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="test@example.com"
                                value={(user?.last_donated) ? user?.last_donated : "-"} required />
                    </div>



                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Edit</button>
                </form>

            </div>




        </div>
    )
}

export default EditProfile;