"use client";

import { useState } from "react";
import { deleteRequestApplication } from "../lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ActionDropdown({ id, error, success }: { id: string, error: string, success: string }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        const response = await deleteRequestApplication(id);
        if ("message" in response &&  response.status === 'error') {
            // error = response.message;
            console.error(response.message);
        }
        else {
            // success = 'Request deleted successfully';
            router.push('/requests');
        }
    }

    return (
        <>
            <div className="dropdown-chevron p-0 m-0">
                <button className="inline-flex items-center px-3 py-2 hover:cursor-pointer text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300"
                    onClick={() => setOpen(!open)}>Actions</button>


                {/* DropDown Menu */}

                {open &&
                    <div className="dropdown-menu flex flex-col absolute bg-gray-200 p-5">
                        <button type="button" onClick={handleDelete}
                            className="focus:outline-none text-sm hover:cursor-pointer text-white text-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                            Delete
                        </button>
                        <Link type="button" href={`/requests/${id}/edit`}
                            className="px-5 py-2.5 me-2 mb-2 hover:cursor-pointer text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Edit
                        </Link>
                        <form action={`/requests/finish`} method="post">
                            <input type="text" name="id" defaultValue={id} className="hidden" />
                            <button type="submit" className="items-center px-5 py-2.5 me-2 mb-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                Finish Request
                            </button>
                        </form>
                    </div>
                }
            </div>
        </>
    );
}
