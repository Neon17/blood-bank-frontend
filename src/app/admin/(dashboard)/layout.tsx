"use client";
import dynamic from "next/dynamic";
import { useAuth } from "../../context/authInfo";

const Sidebar = dynamic(() => import('../../_components/Sidebar'), { ssr: false });


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    return (
        <div className="h-full w-full">
            <Sidebar type="admin" />
            <main className="min-h-screen w-full flex sm:justify-end justify-center pt-3">
                <div className="md:[width:calc(100vw-256px)] w-full h-full p-3">
                    {children}
                </div>
            </main>
        </div>
    );
}
