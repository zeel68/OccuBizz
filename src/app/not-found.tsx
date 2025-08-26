import React from "react";
import Link from "next/link";

function Page() {
    return (
        <section className="bg-white dark:bg-gray-900 h-screen flex items-center justify-center w-full">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600 dark:text-blue-500">
                        404
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                        Page Not Found
                    </p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                        Sorry, the page you’re looking for doesn’t exist or has been moved.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                    >
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default Page;
