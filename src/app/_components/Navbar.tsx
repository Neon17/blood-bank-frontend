"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../authInfo";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
    const [IsOpen, SetIsOpen] = useState(false);
    const { isLoggedIn, user } = useAuth();
    const pathname = usePathname();
    return (
        <>
            <nav className="container justify-self-center flex items-center justify-center py-2">
                <div className="flex flex-wrap items-center justify-between mx-auto p-4 w-full">
                    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap">Blood Bank</span>
                    </a>
                    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col items-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                            <li>
                                <Link href="/" className={`block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ${(pathname === '/') ? 'text-blue-700' : ''}`}>Home</Link>
                            </li>
                            <li>
                                <Link href="/donors" className={`block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ${(pathname === '/donors') ? 'text-blue-700' : ''}`}>Donors</Link>
                            </li>
                            <li>
                                <Link href="/requests" className={`block py-2 px-3rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ${(pathname === '/requests') ? 'text-blue-700' : ''}`}>Blood Requests</Link>
                            </li>
                            <li>

                                {!user &&
                                    <div className="relative inline-block text-left">
                                        <a id="dropdownButton" href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 m-1 :hover:bg-blue-700">
                                            Login
                                        </a>
                                        <a id="dropdownButton" href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 m-1 :hover:bg-blue-700">
                                            Register
                                        </a>
                                    </div>
                                }
                                {user &&
                                    <>
                                        <div className="relative inline-block text-left">
                                            <button id="dropdownButton" onClick={() => { SetIsOpen(!IsOpen); console.log(IsOpen) }} className="px-4 py-2 text-blue-600 rounded-lg hover:text-blue-800 hover:cursor-pointer">
                                                {user.name}
                                            </button>
                                        </div>
                                    </>
                                }

                                {IsOpen && <div id="dropdownMenu" className="absolute mt-2 border border-gray-200 rounded-md shadow-lg z-10">
                                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => { SetIsOpen(!IsOpen); }}>See Profile</Link>
                                    <Link href="/logout" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => { SetIsOpen(!IsOpen); }}>Logout</Link>
                                </div>}
                            </li>
                        </ul>
                    </div>
                </div>

                <ModeToggle />
            </nav>
        </>
    )
}