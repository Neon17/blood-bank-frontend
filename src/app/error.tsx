'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-black">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <p className="mt-4 text-lg">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Try again
      </button>
    </main>
  )
}