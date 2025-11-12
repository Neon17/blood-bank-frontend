'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <svg
          className="h-16 w-16 text-red-500 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
          Oops! Something went wrong.
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400 max-w-md">
          We apologize for the inconvenience. Please try again or contact
          support if the problem persists.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Error: {error.message}
        </p>
        <button
          onClick={() => reset()}
          className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
