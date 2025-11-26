"use client";

import React from "react";

const StrategicPlanPage = () => {
  return (
    <div className="w-full">

      {/* Hero Section */}
      <section
        className="relative w-full h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/public-resources/strategic-hero.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            PSC Strategic Plan 2019–2030
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            A long-term roadmap guiding transformation, excellence, and modernization of the public service.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-white text-gray-900 py-20 px-6 md:px-16">
        <div className="max-w-4xl mx-auto space-y-10">

          <div className="space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002366]">
              Strategic Plan 2019–2030
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              The Public Service Commission Strategic Plan (2019–2030) provides
              a comprehensive framework for enhancing professionalism, efficiency,
              and accountability within Kenya’s public service.
              <br /><br />
              The plan defines the commission’s long-term vision, strategic pillars,
              and key initiatives that shape the future of governance and leadership
              across government institutions.
              <br />
              A downloadable version will be provided here once available.
            </p>
          </div>

          {/* Placeholder Notice */}
          <div className="p-6 border border-[#002366] bg-gray-100 rounded-xl text-center">
            <p className="text-[#002366] font-semibold text-lg">
              📄 Strategic Plan 2019–2030 is not yet uploaded.
            </p>
            <p className="text-gray-600 mt-2 text-sm">
              Please check again later for updates.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default StrategicPlanPage;
