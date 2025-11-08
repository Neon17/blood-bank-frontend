"use client";
import { useAuth } from '@/app/context/authInfo';
import { signUp } from '@/app/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


export default function Signup() {
    const { setUser, setIsLoggedIn } = useAuth();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | string[] }>({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) router.push('/dashboard');
    }, [isAuthenticated])

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        // Reset errors
        setErrors({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });

        if (password !== confirmPassword) {
            setErrors(prevErrors => ({
                ...prevErrors,
                confirmPassword: 'Password doesn\'t match'
            }));
            return;
        }

        const data = await signUp(formData);
        if (!("user" in data)) {
            if ("errors" in data) {
                setError(data.message);
                console.error(data.message);

                const keys = Object.keys(data.errors);
                const values = Object.values(data.errors);

                const errorObject = Object.fromEntries(
                    keys.map((key, index) => [key, values[index]])
                ) as { [key: string]: string[] };

                setErrors(errorObject);
                setIsLoading(false);
            }
        }
        else {
            if ("user" in data && data?.user) {
                setUser(data?.user);
                setIsLoggedIn(true);
                setIsAuthenticated(true);
                setIsLoading(false);
            }
        }
    }

    return (
        <>
            <div className='p-5 w-full'>
                <form action={handleSubmit} className="mx-auto flex flex-col max-w-lg p-8 rounded-lg bg-gray-200 dark:bg-gray-800">
                    <div className="community-title-register text-center pb-8">
                        <h3 className="text-3xl text-red-600 dark:text-red-300 font-bold-semibold py-1 text-spacing-4">
                            Join Our Community
                        </h3>
                        <p className="register-information text-black dark:text-white">
                            Register to become a blood donor and save lives
                        </p>
                    </div>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name
                            <p className="text-red-500 px-0.5 inline">*</p>
                        </label>
                        <input type="text" id="name" name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email
                            <p className="text-red-500 px-0.5 inline">*</p>
                        </label>
                        <input type="email" id="email" name='email' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="test@example.com" required />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password
                            <p className="text-red-500 px-0.5 inline">*</p>
                        </label>
                        <input type="password" id="password" name='password' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password
                            <p className="text-red-500 px-0.5 inline">*</p>
                        </label>
                        <input type="password" id="confirm-password" name='confirmPassword' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                    <button type="submit" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 hover:cursor-pointer text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Submit</button>
                    {!isLoading && <div className="flex justify-center py-2">
                        <p className="newtothiswebsite content-center ps-1">Already have an account?
                            <Link href='/login' className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 ps-1">Login</Link>
                        </p>
                    </div> }
                    {isLoading &&
                        <div className="flex flex-col items-center justify-center space-y-3 py-4">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-100 border-t-red-600"></div>
                                <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-red-200 opacity-75"></div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium animate-pulse">
                                Signing up...
                            </p>
                        </div>
                    }
                </form>

            </div>
        </>
    )
}