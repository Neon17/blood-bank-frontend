export default function DashboardPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Donations", value: 8, color: "red" },
                    { label: "Lives Impacted", value: 24, color: "green" },
                    { label: "Nearby Requests", value: 2, color: "orange" },
                    { label: "Nearby Donors", value: 3, color: "blue" },
                ].map(({ label, value, color }) => (
                    <div
                        key={label}
                        className={`rounded-lg shadow-md p-6 bg-white dark:bg-gray-800 border-l-4 border-${color}-500`}
                    >
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">{label}</p>
                        <p className="text-3xl font-bold text-${color}-600 mt-2">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
