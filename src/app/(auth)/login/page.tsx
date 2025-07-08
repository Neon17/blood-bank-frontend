"use client";
import { useAuth } from "@/app/authInfo";
import { authenticate } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function Login() {
    const router = useRouter();
    const { setUser, setIsLoggedIn } = useAuth();
    const [error, setError] = useState('');
    // const [errors, setErrors] = useState({
    //     name: '',
    //     email: '',
    //     password: '',
    //     confirmPassword: ''
    // });

    const handleFormData = async (formData: FormData) => {
        // Reset errors
        setError('');
        try {
            const data = await authenticate(formData);

            if (data?.status === 'error') {
                if (data.message) {
                    setError(data.message);
                    console.error(data.message);
                }
            } else {
                if ("user" in data && data?.user) {
                    setUser(data?.user);
                    setIsLoggedIn(true);
                    router.push('/dashboard');
                }
            }
        } catch (error: unknown) {
            console.error(error);

            if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
                const err = error as { code?: string; message?: string };

                if (err.code === 'ERR_BAD_REQUEST') {
                    setError(err.message || 'Bad request');
                } else {
                    setError(err.message || 'An unexpected error occurred.');
                }
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred.');
            }
        }

    }

    return (
        <div className="p-5 w-full">

            <form action={handleFormData} className="max-w-md mx-auto p-8 rounded-lg flex flex-col bg-gray-200 dark:bg-gray-800 border">
                {error &&
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                }

                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <input type="email" id="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@example.com" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input type="password" id="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 hover:cursor-pointer text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
            </form>

        </div>
    )
}