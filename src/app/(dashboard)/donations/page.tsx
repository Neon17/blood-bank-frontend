export default function DonationsPage() {
  const donations = [
    { date: '2024-01-10', place: 'Red Cross', lives: 3 },
    { date: '2024-04-22', place: 'City Hospital', lives: 2 },
  ];

  return (
    <div className="p-4 sm:p-6 pt-5">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        My Donations
      </h1>

      {/* Make table horizontally scrollable on small screens */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-300">
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4">Place</th>
              <th className="pb-2 pr-4">Lives Saved</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d, i) => (
              <tr
                key={i}
                className="border-t border-gray-300 dark:border-gray-700"
              >
                <td className="py-2 pr-4 whitespace-nowrap">{d.date}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{d.place}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{d.lives}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
