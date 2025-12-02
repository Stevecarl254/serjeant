"use client";

import React from "react";

const PCSAct2019Page = () => {
  return (
    <div className="w-full">

      {/* Hero Section */}
      <section
        className="relative w-full h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/public-resources/pcs-hero.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Public Service Commission Act, 2019
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            An essential legal framework guiding public service discipline, ethics, and operations.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full bg-white text-gray-900 py-20 px-6 md:px-16">
        <div className="max-w-4xl mx-auto space-y-10">

          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002366]">
              PCS Act 2019 — Document Not Yet Uploaded
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              The Public Service Commission Act (2019) provides regulations guiding
              recruitment, discipline, ethics, and governance in the public service.
              <br /><br />
              The Society references the Act for standard procedures and leadership guidelines.
              <br />
              A downloadable version will be made available here soon.
            </p>
          </div>

          {/* Placeholder Box */}
          <div className="p-6 border border-[#002366] bg-gray-100 rounded-xl text-center">
            <p className="text-[#002366] font-semibold text-lg">
              📄 PCS Act 2019 is not yet uploaded.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Please check again later.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default PCSAct2019Page;
