"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaTimesCircle, FaUserShield, FaCrown } from "react-icons/fa";
import axiosInstance from "../../lib/axiosInstance"; // adjust path if needed

interface Member {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  packageType: string;
  isActive: boolean;
  createdAt: string;
}

const MembershipPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"who" | "benefits">("who");
  const [memberships, setMemberships] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleTab = (tab: "who" | "benefits") => setActiveTab(tab);

  const scrollToPackages = () => {
    const el = document.getElementById("membership-packages");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Load memberships for display (optional, if user should see their info)
  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await axiosInstance.get("/members");
        setMemberships(Array.isArray(res.data) ? res.data : res.data.members || []);
      } catch (err) {
        console.error("Failed to fetch membership data:", err);
        setMemberships([]);
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

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
            Join the <span className="text-[#9e9210] font-semibold">Serjeant At Arms Society</span> 
            and be part of a nationwide network of discipline, service, and leadership excellence.
          </p>
          <button
            onClick={scrollToPackages}
            className="bg-[#9e9210] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#7e7411] transition"
          >
            Join Now
          </button>
        </div>
      </section>

      {/* Tabs and Benefits */}
      <section className="w-full py-20 px-6 md:px-16 bg-[#f9f9f9]">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <p className="text-lg md:text-xl mb-6 leading-relaxed text-gray-700">
            Membership provides a platform to engage in shaping the society, develop leadership skills,
            participate in national initiatives, and connect with a diverse network.
          </p>

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

          <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
            {activeTab === "who" ? (
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Anyone aged 18+ with a commitment to community service</li>
                <li>Individuals dedicated to discipline, leadership, and national unity</li>
                <li>Professionals, students, and community leaders seeking engagement opportunities</li>
              </ul>
            ) : (
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Access to events</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Leadership forums</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Networking</li>
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Membership Packages */}
      <section id="membership-packages" className="w-full py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#002366] tracking-wide relative inline-block">
            Membership Packages
            <span className="block w-20 h-1 bg-[#9e9210] mx-auto mt-2 rounded-full"></span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose the plan that fits your commitment and benefits.
          </p>
        </div>
        {/* Render packages buttons with Links */}
      </section>
    </div>
  );
};

export default MembershipPage;
