"use client";

import Link from "next/link";
import { FaCheckCircle, FaTimesCircle, FaCrown, FaUserShield } from "react-icons/fa";

const MembershipSection = () => {
  return (
    <section className="w-full bg-[#f9f9f9] text-gray-900 py-16 px-4 md:px-16">
      <div className="max-w-6xl mx-auto text-center mb-12">
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#002366] tracking-wide relative inline-block">
          Membership Packages
          <span className="block w-20 h-1 bg-[#9e9210] mx-auto mt-2 rounded-full"></span>
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join the <span className="text-[#9e9210] font-semibold">Serjeant At Arms Society</span> 
          and be part of a nationwide network of discipline, service, and leadership excellence.
        </p>
      </div>

      {/* Membership Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">

        {/* Standard Membership */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 relative overflow-hidden flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="absolute -top-6 -left-6 text-[#002366] opacity-10 text-7xl">
            <FaUserShield />
          </div>

          <h3 className="text-2xl font-bold text-[#002366] mb-2 flex items-center gap-2">
            <FaUserShield className="text-[#9e9210]" /> Standard Membership
          </h3>

          <p className="text-[#9e9210] font-bold text-xl mb-4">KES 1,000 / Year</p>

          <ul className="space-y-2 text-gray-700 flex-1">
            {/* Included Benefits */}
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Access to National Events</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Membership Identification Badge</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> General Voting Rights</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Monthly Newsletter & Reports</li>

            {/* Missing Premium Benefits */}
            <li className="flex items-center gap-2 text-gray-400 line-through"><FaTimesCircle className="text-red-500" /> Priority Access at National Events</li>
            <li className="flex items-center gap-2 text-gray-400 line-through"><FaTimesCircle className="text-red-500" /> Exclusive Leadership Forums</li>
            <li className="flex items-center gap-2 text-gray-400 line-through"><FaTimesCircle className="text-red-500" /> VIP Recognition & Premium Badge</li>
            <li className="flex items-center gap-2 text-gray-400 line-through"><FaTimesCircle className="text-red-500" /> Invitation to Annual National Gala</li>
            <li className="flex items-center gap-2 text-gray-400 line-through"><FaTimesCircle className="text-red-500" /> Discounts on Society Merchandise</li>
          </ul>

          <Link href="/membership/register?plan=standard" className="mt-4">
            <button className="w-full bg-[#002366] text-white py-3 rounded-lg shadow-md hover:bg-[#001847] transition font-semibold transform hover:scale-105">
              Join Standard
            </button>
          </Link>
        </div>

        {/* Premium Membership */}
        <div className="bg-white border-2 border-[#9e9210] rounded-2xl shadow-xl p-8 relative overflow-hidden flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
          
          {/* Badge */}
          <span className="absolute top-4 right-4 bg-[#9e9210] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            Most Popular
          </span>

          <div className="absolute -top-6 -left-6 text-[#9e9210] opacity-10 text-7xl">
            <FaCrown />
          </div>

          <h3 className="text-2xl font-bold text-[#002366] mb-2 flex items-center gap-2">
            <FaCrown className="text-[#9e9210]" /> Premium Membership
          </h3>

          <p className="text-[#9e9210] font-bold text-xl mb-4">KES 5,000 / Year</p>

          <ul className="space-y-2 text-gray-700 flex-1">
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> All Standard Benefits</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Priority Access at National Events</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Exclusive Leadership Forums</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> VIP Recognition & Premium Badge</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Invitation to Annual National Gala</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-[#9e9210]" /> Discounts on Society Merchandise</li>
          </ul>

          <Link href="/membership/register?plan=premium" className="mt-4">
            <button className="w-full bg-[#9e9210] text-white py-3 rounded-lg shadow-md hover:bg-[#7e7411] transition font-semibold transform hover:scale-105">
              Join Premium
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default MembershipSection;