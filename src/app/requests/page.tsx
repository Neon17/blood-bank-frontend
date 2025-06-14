import { BloodRequests } from "../lib/actions"

export default async function Requests() {
    const data = await BloodRequests();

    return (
        <main className="flex flex-col min-h-screen w-full items-center justify-center text-black requests-page">
            <h1 className="text-4xl font-bold">Requests</h1>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
                {data && data.data?.map((elem, index) => (
                    <div
                        key={index}
                        className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                        <a href="#">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                                {elem.user?.name || "Anonymous"}
                            </h5>
                        </a>
                        <p className="mb-3 font-normal text-gray-700">
                            This is a sample request description.
                        </p>
                        <a
                            href="#"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                        >
                            Read more
                            <svg
                                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 10"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 5h12m0 0L9 1m4 4L9 9"
                                />
                            </svg>
                        </a>
                    </div>
                ))}
            </div>


        </main>
    )
}