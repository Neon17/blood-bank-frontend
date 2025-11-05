"use client";
import { useAuth } from "@/app/context/authInfo";
import { authenticate } from "@/app/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function Login() {
    const router = useRouter();
    const { setUser, setIsLoggedIn } = useAuth();
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | string[] }>({
        email: '',
        password: '',
    });

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated]);

    const handleFormData = async (formData: FormData) => {
        // Reset errors
        setError('');
        setIsLoading(true);
        try {
            const data = await authenticate(formData);

            if (data.status == 'error') {
                if (data.message === 'validation error')
                    setError("Incomplete Data. Fill all required fields");
                else if (data.message)
                    setError(data.message);
                if ("errors" in data) setErrors(data.errors);
                console.error(data.message);
                setIsLoading(false);
            } else {
                if ("user" in data && data?.user) {
                    setUser(data?.user);
                    setIsLoggedIn(true);
                    setIsAuthenticated(true);
                    setIsLoading(false);
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

                <h3 className="welcome-back text-3xl text-center text-red-600 dark:text-red-400 py-2">Welcome Back</h3>
                <p className="small-text-below-welcome-back text-sm text-center mb-5 pt-1 pb-3">Sign in to continue saving lives</p>
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
                {!isLoading ? (
                    <>
                        <button
                            type="submit"
                            className="group relative w-full py-3 px-4 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-200 focus:outline-none transition-all duration-300 ease-out font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
                        >
                            <span className="relative z-10">Sign In to Account</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        <div className="relative flex items-center justify-center pt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                            </div>
                            <div className="relative bg-white dark:bg-gray-900 px-4">
                                <span className="text-gray-600 dark:text-gray-400 text-sm">
                                    New to our platform?{" "}
                                    <Link
                                        href='/signup'
                                        className="font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 hover:underline"
                                    >
                                        Sign up
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-3 py-4">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-100 border-t-red-600"></div>
                            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-red-200 opacity-75"></div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium animate-pulse">
                            Authenticating...
                        </p>
                    </div>
                )}

            </form>

        </div>
    )
}