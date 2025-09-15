"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/authInfo";
import { ModeToggle } from "./ModeToggle";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
    const [IsOpen, SetIsOpen] = useState(false);
    const [navbarOpen, setNavbarOpen] = useState(false);
    const { user } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const [currentPath, setCurrentPath] = useState(pathname);

    useEffect(() => {
        if (pathname) {
            setCurrentPath(pathname);
        }
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                SetIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, []);


    return (
        <>
            <header className="shadow-sm bg-red-300 dark:bg-red-700 sticky top-0 z-999">
                <nav className="w-full max-w-7xl justify-self-center flex items-center justify-center px-2">
                    <div className="flex flex-wrap items-center justify-between mx-auto p-3 w-full">
                        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="BloodBank Logo" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap">Blood Bank</span>
                        </Link>
                        <div className="md:hidden">
                            <ModeToggle />
                        </div>
                        <button type="button" onClick={() => setNavbarOpen(!navbarOpen)} className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                        <div className={`${navbarOpen == false && 'hidden sticky top-0'} w-full md:block md:w-auto`} id="navbar-default">
                            <ul className="font-medium flex flex-col items-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                                <li className="w-full text-center">
                                    <Link href="/" className={`block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 ${(currentPath === '/') ? 'text-red-700 dark:text-red-300' : ''}`}>Home</Link>
                                </li>
                                <li className="w-full text-center">
                                    <Link href="/donors" className={`block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 dark:hover:text-red-300 md:p-0 ${(currentPath === '/donors') ? 'text-red-700 dark:text-red-300' : ''}`}>Donors</Link>
                                </li>
                                <li className="w-full text-center">
                                    <Link href="/requests" className={`block py-2 px-3rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 dark:hover:text-red-300 md:p-0 ${(currentPath === '/requests') ? 'text-red-700 dark:text-red-300' : ''}`}>Requests</Link>
                                </li>
                                <li className="w-full flex justify-center py-3">

                                    {!user &&
                                        <div className="relative inline-block text-left">
                                            <Link id="dropdownButton" href="/login" className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 m-1 :hover:bg-red-700 dark:hover:bg-red-600">
                                                Login
                                            </Link>
                                            <Link id="dropdownButton" href="/signup" className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 m-1 :hover:bg-red-700 dark:hover:bg-red-600">
                                                Register
                                            </Link>
                                        </div>
                                    }
                                    {user &&
                                        <div ref={dropdownRef} className="relative inline-block text-left">
                                            <button id="dropdownButton" onClick={() => { SetIsOpen(!IsOpen);}} className="flex items-center px-4 text-red-600 dark:text-red-300 rounded-lg hover:text-red-800 dark:hover:text-red-400 hover:cursor-pointer">
                                                {user.name.split(' ')[0].charAt(0).toUpperCase() + user.name.split(' ')[0].slice(1)}
                                                <ChevronDown className="w-4 h-4 ml-1 inline text-gray-600 dark:text-gray-300" />
                                            </button>


                                            {IsOpen && <div id="dropdownMenu" className="absolute mt-2 p-2 min-w-40 border border-gray-200 bg-gray-300 dark:bg-gray-700 rounded-md shadow-lg z-1000">
                                                <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900" onClick={() => { SetIsOpen(!IsOpen); }}>Profile</Link>
                                                <a href="/logout" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900" onClick={() => { SetIsOpen(!IsOpen); }}>Logout</a>
                                            </div>}

                                        </div>
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="hidden md:flex">
                        <ModeToggle />
                    </div>
                </nav>
            </header>
        </>
    )
}