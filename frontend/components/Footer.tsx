"use client";

import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#002366] text-white py-16 px-6 md:px-16 relative">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">Serjeant At Arms Society</h3>
          <p className="text-gray-200 leading-relaxed">
            Uniting communities across Kenya. Connecting, celebrating, and engaging citizens through leadership, discipline, and service.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-200">
            <li><Link href="/" className="hover:text-[#9e9210] transition">Home</Link></li>
            <li><Link href="/about" className="hover:text-[#9e9210] transition">About Us</Link></li>
            <li><Link href="/events" className="hover:text-[#9e9210] transition">Events</Link></li>
            <li><Link href="/membership" className="hover:text-[#9e9210] transition">Membership</Link></li>
            <li><Link href="/Gallery" className="hover:text-[#9e9210] transition">Gallery</Link></li>
            <li><Link href="/faq" className="hover:text-[#9e9210] transition">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-gray-200">
            <li className="flex items-center gap-2"><FaEnvelope /> info@serjeantarms.co.ke</li>
            <li className="flex items-center gap-2"><FaPhoneAlt /> +254 700 000 000</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex items-center gap-4 mt-2">
            <Link href="#"><FaFacebookF className="hover:text-[#9e9210] transition" size={20} /></Link>
            <Link href="#"><FaTwitter className="hover:text-[#9e9210] transition" size={20} /></Link>
            <Link href="#"><FaInstagram className="hover:text-[#9e9210] transition" size={20} /></Link>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-gray-500 pt-6 text-center text-gray-300 text-sm">
        &copy; {new Date().getFullYear()} Serjeant At Arms Society. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;