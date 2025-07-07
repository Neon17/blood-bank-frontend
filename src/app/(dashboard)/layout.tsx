"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [ currentPath, setCurrentPath ] = useState(pathname);

    useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname);
    }
  }, [pathname]);

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Smart Blood Bank</h2>
                <nav className="space-y-4">
                    <Link href="/dashboard" className={`block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition ${currentPath === '/dashboard' ? 'bg-blue-600 text-white' : ''}`}>
                        Home
                    </Link>
                    <Link href="/profile" className={`block px-4 py-2 rounded-md  text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition ${(currentPath === '/profile' || currentPath === '/profile/edit') ? 'bg-blue-600 text-white' : ''}`}>
                        Profile
                    </Link>
                    <Link href="/donations" className={`block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition ${currentPath === '/donations' ? 'bg-blue-600 text-white' : ''}`}>
                        Donations
                    </Link>
                    <Link href="/settings" className={`block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition ${currentPath === '/settings' ? 'bg-blue-600 text-white' : ''}`}>
                        Settings
                    </Link>
                </nav>
            </aside>

            <main className="flex-1">{children}</main>
        </div>
    );
}
