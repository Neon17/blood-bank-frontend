"use client";
import dynamic from "next/dynamic";

const Sidebar = dynamic(()=>import('../_components/Sidebar'), { ssr: false });


export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="h-full w-full">
            <Sidebar type="user"/>
            <main className="min-h-screen w-full flex sm:justify-end justify-center pt-3">
                <div className="sm:[width:calc(100vw-256px)] h-full p-3">
                    {children}
                </div>
            </main>
        </div>
    );
}
