"use client";
import { useAuth } from "@/app/authInfo";
import { authenticate } from "@/app/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function Login() {
    const router = useRouter();
    const { setUser, setIsLoggedIn } = useAuth();
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string | string[] }>({
        email: '',
        password: '',
    });

    const handleFormData = async (formData: FormData) => {
        // Reset errors
        setError('');
        try {
            const data = await authenticate(formData);

            console.log(data);

            if (data.status == 'error') {
                if (data.message === 'validation error')
                    setError("Incomplete Data. Fill all required fields");
                else if (data.message)
                    setError(data.message);
                if ("errors" in data)  setErrors(data.errors);
                console.error(data.message);
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
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email
                        <p className="text-red-500 px-0.5 inline">*</p>
                    </label>
                    <input type="email" id="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@example.com" required />
                    {errors && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password
                        <p className="text-red-500 px-0.5 inline">*</p>
                    </label>
                    <input type="password" id="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    {errors && errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div className="flex">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 hover:cursor-pointer text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                    <p className="newtothiswebsite content-center px-3">Don't have an account?
                        <Link href='/signup' className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 ps-1">Register</Link>
                    </p>
                </div>
            </form>

        </div>
    )
}