import ActionDropdown from "../_components/ActionDropdown";
import { bloodRequests } from "../lib/actions"
import { BloodRequest } from "../lib/definitions";

export default async function Requests() {
    const data = await bloodRequests();
    var success = '';
    var error = '';

    return (
        <main className="flex flex-col min-h-screen w-full requests-page p-3 container">
            <h1 className="text-4xl font-bold text-center m-10">Requests</h1>
            <div className="button-container my-2 mt-5 w-full">
                <a type="button" href="/requests/create" className="text-white bg-blue-700 hover:cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Create Blood Request
                </a>
            </div>


            <div className="flex flex-wrap gap-4 mt-6">
                {success &&
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        {success}
                    </div>}
                {error &&
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        {error}
                    </div>}
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
                            Date: {elem.date_time.toString()}
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

                        <div className="actions-flex-menu flex gap-2">
                            <a
                                href="#"
                                className="inline-flex items-center px-3 py-2 hover:cursor-pointer text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
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

                            <ActionDropdown id={elem.id.toString()} error={error} success={success} />

                        </div>
                    </div>
                ))}
            </div>


        </main>
    )
}