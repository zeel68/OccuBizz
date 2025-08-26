import React from "react";
import Link from "next/link";
import {getSession} from "next-auth/react";

function Page() {
    return (
        <section className="bg-white dark:bg-gray-900 h-screen flex items-center justify-center w-full">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-600 dark:text-red-500">
                        403
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                        Access Denied
                    </p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                        Sorry, you don’t have permission to access this page.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                    >
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default Page;
