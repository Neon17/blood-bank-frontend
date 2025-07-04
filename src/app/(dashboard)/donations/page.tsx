export default function DonationsPage() {
    const donations = [
        { date: '2024-01-10', place: 'Red Cross', lives: 3 },
        { date: '2024-04-22', place: 'City Hospital', lives: 2 },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">My Donations</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <table className="min-w-full">
                    <thead>
                        <tr className="text-left text-gray-600 dark:text-gray-300">
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Place</th>
                            <th className="pb-2">Lives Saved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((d, i) => (
                            <tr key={i} className="border-t border-gray-300 dark:border-gray-700">
                                <td className="py-2">{d.date}</td>
                                <td className="py-2">{d.place}</td>
                                <td className="py-2">{d.lives}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
