import '../globals.css';

export default function AuthLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex justify-center items-center p-3 w-full h-full auth-layout">
            <img src="./wall_simplified.jpg" alt="Wall Background" className='fixed h-full w-full z-0' />
            <div className="h-full w-full z-3">
                {children}
            </div>
        </div>
    )
}