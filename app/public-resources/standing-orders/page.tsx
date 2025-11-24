"use client";

import React from "react";

const StandingOrdersPage = () => {
    return (
        <div className="w-full">

            {/* Hero Section */}
            <section
                className="relative w-full h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
                style={{ backgroundImage: "url('/public-resources/bylaws-hero.jpeg')" }}
            >
                <div className="absolute inset-0 bg-black/60"></div>

                <div className="relative z-10 px-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
                        Standing Orders
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200">
                        Rules of Procedure
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="w-full bg-white text-gray-900 py-20 px-6 md:px-16">
                <div className="max-w-4xl mx-auto text-center space-y-6">

                    <h2 className="text-2xl md:text-3xl font-bold text-[#002366]">
                        Document Currently Unavailable
                    </h2>

                    <p className="text-gray-700 text-lg leading-relaxed">
                        The Standing Orders are currently being updated.
                        <br /><br />
                        The latest version will be published here soon.
                    </p>

                    <div className="mt-8 p-6 border border-[#9e9210] bg-yellow-50 rounded-xl">
                        <p className="text-[#9e9210] font-semibold">
                            📄 No document uploaded yet.
                        </p>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default StandingOrdersPage;
