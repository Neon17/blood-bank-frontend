export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-xl">
        <form className="space-y-5">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Notification Email
            </label>
            <input
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Enable Notifications
            </label>
            <input type="checkbox" className="ml-2" />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
