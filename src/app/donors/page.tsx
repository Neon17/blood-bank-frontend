import { bloodDonors } from "../lib/actions"
import { User } from "../lib/definitions";

export default async function Donors() {
    const data = await bloodDonors();

    return (
        <main className="flex flex-col min-h-screen max-w-7xl mx-auto p-3 requests-page container">
            <h1 className="text-4xl font-bold text-center m-10">Donors</h1>

            <div className="flex flex-wrap gap-4 mt-6">
                <div className="button-container my-2 mt-5 w-full">
                    <button type="button" className="text-white bg-blue-700 hover:cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Register as Donor
                    </button>
                </div>

            </div>

            <div className="title-container text-center m-10">
                <h1 className="text-4xl font-bold text-center">Users</h1>
                <p className="text-sm text-center">users who are willing to donate</p>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">

                {data && data.data?.map((elem: User, index: Number) => (
                    <div
                        key={index.toString()}
                        className="max-w-sm p-6 bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-sm"
                    >
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Name: {elem.name}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Blood Type: {elem.blood_type}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Verified as Donor: {elem.verified_as_donor ? "Yes" : "No"}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Contact Number: {elem.contact_number}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                            Current City: {elem.current_city}
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
                    </div>
                ))}

            </div>


        </main>
    )
}