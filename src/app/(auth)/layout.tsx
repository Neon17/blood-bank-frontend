import '../globals.css';

export default function AuthLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex justify-center items-center p-3 w-full h-full auth-layout">
            {children}
        </div>
    )
}