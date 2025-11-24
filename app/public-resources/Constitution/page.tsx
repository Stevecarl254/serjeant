"use client";

import React from "react";

const ConstitutionPage = () => {
  return (
    <div className="w-full">

      {/* Hero Section */}
      <section
        className="relative w-full h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/public-resources/constitution-hero.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Society Constitution
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Our foundational legal and structural framework
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full bg-white text-gray-900 py-20 px-6 md:px-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">

          <h2 className="text-2xl md:text-3xl font-bold text-[#002366]">
            Constitution Not Yet Published
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            The official Constitution of the Serjeant-At-Arms Society is currently
            being drafted and reviewed by the National Council.
            <br /><br />
            Once finalized and approved, it will be uploaded here for members and the public.
          </p>

          <div className="mt-8 p-6 border border-[#002366] bg-gray-100 rounded-xl">
            <p className="text-[#002366] font-semibold">
              📘 No constitution document has been uploaded.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ConstitutionPage;
