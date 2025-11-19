"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaTimesCircle, FaUserShield, FaCrown, FaUsers, FaStar } from "react-icons/fa";

const MembershipPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"who" | "benefits">("who");

  const toggleTab = (tab: "who" | "benefits") => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full text-gray-900">

      {/* Hero Section */}
      <section
        className="relative w-full h-96 flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('about-hero.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 text-white px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Membership</h1>
          <p className="text-lg md:text-xl mb-6">
            Join the <span className="text-[#9e9210] font-semibold">Serjeant At Arms Society</span> and be part of a nationwide network of discipline, service, and leadership excellence.
          </p>
          <Link href="/membership/register?plan=standard">
            <button className="bg-[#9e9210] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#7e7411] transition">
              Join Now
            </button>
          </Link>
        </div>
      </section>

     {/* Overview Section */}
<section className="w-full py-20 px-6 md:px-16 bg-[#f9f9f9]">
  <div className="max-w-5xl mx-auto text-center md:text-left">
    <p className="text-lg md:text-xl mb-6 leading-relaxed text-gray-700">
      Being a member of the <span className="font-semibold text-[#9e9210]">Serjeant At Arms Society</span> 
      is more than just a title. Membership gives you a platform to actively engage in shaping the society, 
      develop leadership skills, participate in national and local initiatives, and connect with a diverse 
      network of individuals committed to discipline, service, and excellence. Our members take pride in 
      contributing to the society's legacy while growing personally and professionally.
    </p>
    <p className="text-gray-700 mb-4">
      Currently, we have <span className="font-bold text-[#9e9210]">1,200 active members</span> across the country, 
      spanning professionals, students, and community leaders. By joining, you become part of a network that 
      values integrity, collaboration, and national unity.
    </p>

    {/* Tabs */}
    <div className="flex gap-4 mt-8 justify-center md:justify-start">
      <button
        onClick={() => toggleTab("who")}
        className={`px-4 py-2 rounded-lg font-semibold shadow-md transition ${
          activeTab === "who" ? "bg-[#002366] text-white" : "bg-white text-gray-900 border border-gray-300"
        }`}
      >
        Who can become a member
      </button>
      <button
        onClick={() => toggleTab("benefits")}
        className={`px-4 py-2 rounded-lg font-semibold shadow-md transition ${
          activeTab === "benefits" ? "bg-[#002366] text-white" : "bg-white text-gray-900 border border-gray-300"
        }`}
      >
        Benefits of a member
      </button>
    </div>

    {/* Tab Content */}
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
      {activeTab === "who" && (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Anyone aged 18+ with a commitment to community service</li>
          <li>Individuals dedicated to discipline, leadership, and national unity</li>
          <li>Professionals, students, and community leaders seeking engagement opportunities</li>
        </ul>
      )}
      {activeTab === "benefits" && (
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Access to national and local events</li>
          <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Leadership development forums</li>
          <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Networking with fellow members</li>
          <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Membership identification badge</li>
          <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Monthly newsletters & reports</li>
        </ul>
      )}
    </div>
  </div>
</section>
      {/* Membership Packages */}
      <section className="w-full py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#002366] tracking-wide relative inline-block">
            Membership Packages
            <span className="block w-20 h-1 bg-[#9e9210] mx-auto mt-2 rounded-full"></span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose the plan that fits your commitment and benefits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">

          {/* Standard */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition relative overflow-hidden">
            <div className="absolute -top-6 -left-6 text-[#002366] opacity-10 text-7xl">
              <FaUserShield />
            </div>
            <h3 className="text-2xl font-bold text-[#002366] mb-2 flex items-center gap-2">
              <FaUserShield className="text-[#9e9210]" /> Standard Membership
            </h3>
            <p className="text-[#9e9210] font-bold text-xl mb-6">KES 1,000 / Year</p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Access to National Events</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Membership Identification Badge</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> General Voting Rights</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Monthly Newsletter & Reports</li>
              <li className="flex items-center gap-2 line-through text-gray-400"><FaTimesCircle className="text-red-500" /> Priority Access at National Events</li>
              <li className="flex items-center gap-2 line-through text-gray-400"><FaTimesCircle className="text-red-500" /> Exclusive Leadership Forums</li>
              <li className="flex items-center gap-2 line-through text-gray-400"><FaTimesCircle className="text-red-500" /> VIP Recognition & Premium Badge</li>
              <li className="flex items-center gap-2 line-through text-gray-400"><FaTimesCircle className="text-red-500" /> Invitation to Annual National Gala</li>
              <li className="flex items-center gap-2 line-through text-gray-400"><FaTimesCircle className="text-red-500" /> Discounts on Society Merchandise</li>
            </ul>
            <Link href="/membership/register?plan=standard">
              <button className="w-full bg-[#002366] text-white py-3 rounded-lg shadow-md hover:bg-[#001847] transition font-semibold">
                Join Standard
              </button>
            </Link>
          </div>

          {/* Premium */}
          <div className="bg-white border-2 border-[#9e9210] rounded-2xl shadow-xl p-8 hover:shadow-2xl transition relative overflow-hidden">
            <span className="absolute top-4 right-4 bg-[#9e9210] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              Most Popular
            </span>
            <div className="absolute -top-6 -left-6 text-[#9e9210] opacity-10 text-7xl">
              <FaCrown />
            </div>
            <h3 className="text-2xl font-bold text-[#002366] mb-2 flex items-center gap-2">
              <FaCrown className="text-[#9e9210]" /> Premium Membership
            </h3>
            <p className="text-[#9e9210] font-bold text-xl mb-6">KES 5,000 / Year</p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> All Standard Benefits</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Priority Access at National Events</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Exclusive Leadership Forums</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> VIP Recognition & Premium Badge</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Invitation to Annual National Gala</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Discounts on Society Merchandise</li>
            </ul>
            <Link href="/membership/register?plan=premium">
              <button className="w-full bg-[#9e9210] text-white py-3 rounded-lg shadow-md hover:bg-[#7e7411] transition font-semibold">
                Join Premium
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section: Meet the Council */}
      <section className="w-full py-16 px-6 md:px-16 bg-white text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-[#002366] mb-6">Meet the Council Members</h3>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Our council members lead the society with vision, integrity, and dedication to excellence.
        </p>
        <Link href="/council">
          <button className="bg-[#9e9210] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#7e7411] transition">
            View Council Members
          </button>
        </Link>
      </section>
    </div>
  );
};

export default MembershipPage;