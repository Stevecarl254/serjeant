"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogIn, UserPlus, Settings, LogOut, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);

  const accountRefDesktop = useRef<HTMLDivElement>(null);
  const accountRefMobile = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRefDesktop.current &&
        !accountRefDesktop.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }

      if (
        accountRefMobile.current &&
        !accountRefMobile.current.contains(event.target as Node)
      ) {
        setIsMobileAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/About" },
    { name: "Events", href: "/Event" },
    { name: "Membership", href: "/Membership" },
    { name: "Contact", href: "/Contact" },
  ];

  return (
    <header className="bg-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#002366]">
          Serjeant<span className="text-[#9e9210]">AtArms</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 text-[#002366] font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative group ${
                  isActive ? "font-bold text-[#9e9210]" : "text-[#002366]"
                }`}
              >
                {link.name}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-[#9e9210] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Account */}
        <div className="relative hidden md:block" ref={accountRefDesktop}>
          <button
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md text-[#002366] hover:bg-[#002366] hover:text-[#9e9210] transition-all duration-300"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Account</span>
          </button>

          {isAccountOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 animate-slide-down">
              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 hover:bg-[#9e9210]/20 text-[#002366] transition"
              >
                <LogIn className="w-4 h-4 text-[#002366]" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center space-x-2 px-4 py-2 hover:bg-[#9e9210]/20 text-[#002366] transition"
              >
                <UserPlus className="w-4 h-4 text-[#9e9210]" />
                <span>Register</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center space-x-2 px-4 py-2 hover:bg-[#9e9210]/20 text-[#002366] transition"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span>Profile Settings</span>
              </Link>
              <hr className="my-1" />
              <button className="flex items-center space-x-2 w-full px-4 py-2 text-left text-[#002366] hover:bg-[#9e9210]/20 transition">
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden items-center space-x-4">
          {/* Account Icon */}
          <div ref={accountRefMobile}>
            <button
              onClick={() => setIsMobileAccountOpen(!isMobileAccountOpen)}
              className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md text-[#002366] hover:bg-[#002366] hover:text-[#9e9210] transition-all duration-300"
            >
              <User className="w-5 h-5" />
            </button>
          </div>

          {/* Hamburger Menu */}
          <button
            className="text-[#002366] hover:text-[#9e9210] transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Links */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200">
          <nav className="flex flex-col space-y-2 p-4 text-[#002366] font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`hover:text-[#9e9210] ${
                    isActive ? "font-bold text-[#9e9210]" : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Mobile Account Dropdown */}
      {isMobileAccountOpen && (
        <div className="md:hidden absolute top-16 right-4 w-48 bg-white rounded-xl shadow-lg border border-gray-100 animate-slide-down z-50">
          <Link
            href="/login"
            className="flex items-center space-x-2 px-4 py-2 hover:bg-[#9e9210]/20 text-[#002366] transition"
          >
            <LogIn className="w-4 h-4 text-[#002366]" />
            <span>Login</span>
          </Link>
          <Link
            href="/register"
            className="flex items-center space-x-2 px-4 py-2 hover:bg-[#9e9210]/20 text-[#002366] transition"
          >
            <UserPlus className="w-4 h-4 text-[#9e9210]" />
            <span>Register</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center space-x-2 px-4 py-2 hover:bg-[#9e9210]/20 text-[#002366] transition"
          >
            <Settings className="w-4 h-4 text-gray-500" />
            <span>Profile Settings</span>
          </Link>
          <hr className="my-1" />
          <button className="flex items-center space-x-2 w-full px-4 py-2 text-left text-[#002366] hover:bg-[#9e9210]/20 transition">
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.25s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Navbar;