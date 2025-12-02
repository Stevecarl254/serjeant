"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const HeroSection: React.FC = () => {
  const images = [
    { src: "image1.jpeg", top: "70%", left: "10%", mobileTop: "65%", mobileLeft: "5%" },
    { src: "about-who.jpeg", top: "60%", left: "30%", mobileTop: "55%", mobileLeft: "20%" },
    { src: "image2.jpeg", top: "50%", left: "50%", mobileTop: "45%", mobileLeft: "35%" },
    { src: "home-who.jpeg", top: "40%", left: "70%", mobileTop: "35%", mobileLeft: "55%" },
    { src: "image3.jpeg", top: "25%", left: "85%", mobileTop: "20%", mobileLeft: "55%" },
  ];

  const [lines, setLines] = useState<
    { x1: string; y1: string; x2: string; y2: string; strokeWidth: number }[]
  >([]);

  useEffect(() => {
    const generatedLines = Array.from({ length: 20 }, () => ({
      x1: `${Math.random() * 100}%`,
      y1: `${Math.random() * 100}%`,
      x2: `${Math.random() * 100}%`,
      y2: `${Math.random() * 100}%`,
      strokeWidth: Math.random() * 0.8 + 0.2,
    }));

    const generatedLines2 = Array.from({ length: 20 }, () => ({
      x1: `${Math.random() * 100}%`,
      y1: `${Math.random() * 100}%`,
      x2: `${Math.random() * 100}%`,
      y2: `${Math.random() * 100}%`,
      strokeWidth: Math.random() * 0.8 + 0.2,
    }));

    setLines([...generatedLines, ...generatedLines2]);
  }, []);

  return (
    <section className="relative w-full h-screen bg-[#002366] text-white overflow-hidden flex items-center justify-start">
      {/* Map */}
      <img
        src="/map.png"
        alt="Kenya Map"
        className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[130%] h-[130%] object-contain opacity-30 z-0 shadow-lg"
      />

      {/* Patterned Tech Lines Mesh */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={line.strokeWidth}
          />
        ))}
      </svg>

      {/* Tagline & Buttons */}
      <div className="relative z-20 max-w-5xl mx-4 sm:mx-6 flex flex-col items-start justify-center h-full">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-snug text-white text-left hero-title">
          <span className="text-[#9e9210]">Serjeant At Arms</span> Society
        </h1>
        <p className="text-sm sm:text-md md:text-lg text-gray-100 mb-6 leading-relaxed text-left max-w-full sm:max-w-md hero-subtitle">
          Uniting communities across Kenya.
          <br />
          Connect, celebrate, and engage in events across the 47 counties.
        </p>
        <div className="flex flex-wrap gap-4 hero-buttons">
          <Link href="/events">
            <button className="bg-[#9e9210] text-[#002366] px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Explore Events
            </button>
          </Link>
          <Link href="/membership">
            <button className="bg-white text-[#002366] px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Join the Society
            </button>
          </Link>
        </div>
      </div>

      {/* Floating Images */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={`Event ${i + 1}`}
            className="absolute w-48 sm:w-36 xs:w-28 h-auto shadow-lg animate-float opacity-0 floating-img"
            style={{
              top: img.top,
              left: img.left,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(30px); opacity: 0; }
          20% { opacity: 1; }
          50% { transform: translateY(-20px); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(30px); opacity: 0; }
        }
        .animate-float {
          animation: float 10s infinite ease-in-out;
        }

        @media (max-width: 640px) {
  .floating-img {
    width: 3rem !important;
    opacity: 0.7 !important;
  }

  /* Hide all except first two */
  .floating-img:nth-child(n+3) {
    display: none !important;
  }

  .floating-img:nth-child(1) { top: 65% !important; left: 6% !important; }
  .floating-img:nth-child(2) { top: 28% !important; left: 70% !important; }

  .hero-buttons {
    z-index: 50 !important;
    position: relative !important;
  }
}
      `}</style>
    </section>
  );
};

export default HeroSection;