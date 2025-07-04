"use client";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = window.location.pathname;
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Smart Blood Bank</h2>
                <nav className="space-y-4">
                    <a href="/dashboard" className={`block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition ${pathname === '/dashboard' ? 'bg-blue-600 text-white' : ''}`}>
                        Home
                    </a>
                    <a href="/profile" className={`block px-4 py-2 rounded-md  text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition ${(pathname === '/profile' || pathname === '/profile/edit') ? 'bg-blue-600 text-white' : ''}`}>
                        Profile
                    </a>
                    <a href="/donations" className={`block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition ${pathname === '/donations' ? 'bg-blue-600 text-white' : ''}`}>
                        Donations
                    </a>
                    <a href="/settings" className={`block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition ${pathname === '/settings' ? 'bg-blue-600 text-white' : ''}`}>
                        Settings
                    </a>
                </nav>
            </aside>

            <main className="flex-1">{children}</main>
        </div>
    );
}
