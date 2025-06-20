"use client";
import { useAuth } from "@/app/authInfo";
import { authenticate } from "@/app/lib/auth";
import { redirect } from 'next/navigation'
import { useState } from "react"

export default function Login() {
    const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuth();
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleFormData = async (formData: FormData) => {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Reset errors
        setError('');
        const data = await authenticate(formData);
        if (data.status === 'error') {
            if (data.message)
                setError(data.message);
            console.error(data.message);
        }
        else {
            setUser(data?.user);
            setIsLoggedIn(true);
            redirect('/dashboard');
        }
    }

    return (
        <div className="p-5 w-full">

            <form action={handleFormData} className="max-w-md mx-auto p-8 rounded-lg flex flex-col bg-white">
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                    <input type="email" id="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@flowbite.com" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
                    <input type="password" id="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Login</button>
            </form>

        </div>
    )
}