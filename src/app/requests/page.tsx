import { bloodRequests } from "../lib/actions"
import { BloodRequest } from "../lib/definitions";

export default async function Requests() {
    const data = await bloodRequests();

    return (
        <main className="flex flex-col min-h-screen w-full items-center justify-center requests-page">
            <h1 className="text-4xl font-bold">Requests</h1>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
                {data && data.data?.map((elem: BloodRequest, index: Number) => (
                    <div
                        key={index.toString()}
                        className="max-w-sm p-6 bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-sm"
                    >
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Requested By: {elem.user.name}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Blood Type: {elem.blood_type}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Quantity: {elem.quantity}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Date: {elem.date_time}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Exact location: {elem.exact_location}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Contact Number: {elem.contact_number}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            City: {elem.quantity}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Country: {elem.quantity}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Verified By: {elem.quantity}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Verification Photo: {elem.verification_photo}
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
                        <form action={`/requests/finish`}  className="inline-flex m-2 items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" method="post">
                            <input type="text" name="id" value={`${elem.id}`} className="hidden" />
                            <button type="submit">
                                Finish Request
                            </button>
                        </form>
                    </div>
                ))}
            </div>


        </main>
    )
}