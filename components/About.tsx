"use client";

import React, { useState } from "react";

const AboutSection: React.FC = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="w-full bg-[#f9f9f9] text-gray-900 py-20 px-6 md:px-16 relative">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#9e9210] rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#002366] rounded-full opacity-10 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center relative z-10">
        
        {/* Text Section */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#002366] relative inline-block">
            Who We Are
            <span className="absolute left-0 bottom-0 w-20 h-1 bg-[#9e9210] rounded-full"></span>
          </h2>

          <p className="mt-4 text-gray-700 text-lg md:text-xl leading-relaxed max-w-xl">
            Serjeant At Arms Society is a professional and community-driven organization, 
            dedicated to fostering leadership, unity, and cultural engagement across Kenya.
            We strive to connect people, celebrate achievements, and empower communities in meaningful ways.
          </p>

          {showMore && (
            <p className="mt-4 text-gray-700 text-lg md:text-xl leading-relaxed max-w-xl">
              Through our programs, mentorship initiatives, and civic activities, we encourage 
              responsible leadership and active participation. Members engage in community 
              projects, cultural events, and educational opportunities, creating a network 
              that uplifts every county.
            </p>
          )}

          <button
            onClick={() => setShowMore(!showMore)}
            className="mt-6 px-6 py-2 bg-[#9e9210] text-white rounded-full font-semibold hover:shadow-lg transition duration-300"
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>

        {/* Enhanced Image Section */}
        <div className="flex-1">
          <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-xl group">
            
            {/* Image with Zoom Effect */}
            <img
              src="home-who.jpeg"
              alt="About Serjeant At Arms"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 opacity-80 pointer-events-none"></div>

            {/* Optional Overlay Text */}
            <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
              <p className="text-lg font-semibold">Serjeant At Arms Society</p>
              <p className="text-sm opacity-90">Leadership • Discipline • Honor</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;