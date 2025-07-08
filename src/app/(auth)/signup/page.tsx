"use client";
import { useAuth } from '@/app/authInfo';
import { signUp } from '@/app/lib/auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'


export default function Signup() {
    const { setUser, setIsLoggedIn } = useAuth();
    const router = useRouter();
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) => {
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
            if (data?.message) {
                setError(data.message);
                console.error(data.message);
            }
            console.log(errors);
        }
        else {
            if ("user" in data && data?.user) {
                setUser(data?.user);
                setIsLoggedIn(true);
                router.push('/dashboard');
            }
        }
    }

    return (
        <>
            <div className='p-5 w-full'>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <form action={handleSubmit} className="mx-auto flex flex-col max-w-lg p-8 rounded-lg bg-gray-200 dark:bg-gray-800">
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" id="name" name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email" id="email" name='email' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" id="password" name='password' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                        <input type="password" id="confirm-password" name='confirmPassword' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                    <button type="submit" className="mx-auto text-white bg-blue-700 hover:bg-blue-800 hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register</button>
                </form>

            </div>
        </>
    )
}