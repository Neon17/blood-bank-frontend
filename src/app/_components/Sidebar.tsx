"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // Hamburger and close icons

export default function Sidebar(props: { type: string }) {
    const pathname = usePathname();
    const [currentPath, setCurrentPath] = useState(pathname);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;

            const sidebar = document.getElementById("dashboardsidebar");
            if (sidebar && !sidebar.contains(target)) {
                if (sidebarOpen) setSidebarOpen(false);
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick); // Clean up
    });

    useEffect(() => {
        if (pathname) {
            setCurrentPath(pathname);
        }
    }, [pathname]);

    const userNavLinks = [
        { href: "/dashboard", label: "Home" },
        { href: "/profile", label: "Profile", activeOn: ["/profile", "/profile/edit"] },
        { href: "/contacts", label: "Donor Profile" },
        { href: "/donations", label: "Donations" },
        { href: "/settings", label: "Settings" },
    ]
    const adminNavLinks = [
        { href: "/dashboard", label: "Home" },
        { href: "/profile", label: "Profile", activeOn: ["/profile", "/profile/edit"] },
        { href: "/contacts", label: "Donor Profile" },
        { href: "/donations", label: "Donations" },
        { href: "/admin/donors/applications", label: "Donor Application" },
        { href: "/admin/requests/applications", label: "Request Application", activeOn: ["/admin/requests/applications", "/admin/requests"] },
        { href: "/admin/users", label: "Users" },
        { href: "/settings", label: "Settings" },
    ]


    const isActive = (href: string, activeOn?: string[]) =>
        activeOn?.includes(currentPath) || currentPath === href || currentPath?.startsWith(`${href}/`);

    return (
        <div className="flex min-h-screen h-full bg-gray-100 dark:bg-gray-900 fixed z-1002" id="dashboardsidebar">
            {/* Mobile Hamburger Button */}
            <div className={`md:hidden ${sidebarOpen ? "fixed" : "absolute"} top-4 left-4`}>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-800 dark:text-white">
                    {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 pt-10 left-0 h-full min-h-screen w-64 bg-white dark:bg-gray-800 shadow-lg p-6 md:z-40 z-[1001] transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:block`}
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Smart Blood Bank</h2>
                <nav className="space-y-4">
                    {((props.type == "admin") ? adminNavLinks : userNavLinks).map(({ href, label, activeOn }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`block px-4 py-2 rounded-md transition ${isActive(href, activeOn)
                                ? "bg-red-600 text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white"
                                }`}
                            onClick={() => setSidebarOpen(false)} // auto-close on mobile
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="button-holder my-5">
                    <button className="p-3 m-3 bg-red-600 hover:bg-red-400 text-white rounded-md cursor-pointer">Chat</button>
                </div>
            </aside>
        </div>
    );
}
