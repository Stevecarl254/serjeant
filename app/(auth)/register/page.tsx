"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance"; 
import { User, Mail, Phone, Lock, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, phone, password, confirmPassword } = formData;

    // Basic validations
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    // Two-name rule
    if (fullName.trim().split(/\s+/).length < 2) {
      setError("Please enter at least two names");
      return;
    }

    // Password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axiosInstance.post("/users/register", {
        fullName,
        email,
        phone,
        password,
      });

      // success
      const redirectTo = sessionStorage.getItem("previousPage") || "/login";
      router.push(redirectTo);

    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
    }
  };

  // Track previous page
  if (typeof window !== "undefined") {
    const prev = document.referrer;
    if (prev && !prev.includes('/login') && !prev.includes('/register')) {
      sessionStorage.setItem("previousPage", prev);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#002366] via-[#4a6ed1] to-[#9e9210] px-4">

      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-[#002366] hover:text-[#9e9210] font-semibold"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back
      </button>

      <div className="bg-white/95 shadow-2xl rounded-3xl w-[390px] max-w-full p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center text-[#002366] mb-6 mt-2">
          Register
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          
          {/* Full Name */}
          <div className="relative">
            <User className="absolute top-3 left-3 w-5 h-5 text-[#9e9210]" />
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Full Name *"
              className="w-full border border-[#9e9210] rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#002366] transition text-gray-900"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-3 left-3 w-5 h-5 text-[#9e9210]" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email *"
              className="w-full border border-[#9e9210] rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#002366] transition text-gray-900"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute top-3 left-3 w-5 h-5 text-[#9e9210]" />
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone Number *"
              className="w-full border border-[#9e9210] rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#002366] transition text-gray-900"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-3 left-3 w-5 h-5 text-[#9e9210]" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password *"
              className="w-full border border-[#9e9210] rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#002366] transition text-gray-900"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute top-3 left-3 w-5 h-5 text-[#9e9210]" />
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm Password *"
              className="w-full border border-[#9e9210] rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#002366] transition text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#002366] to-[#9e9210] text-white font-semibold shadow-lg hover:scale-105 transition transform"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-[#002366] mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-[#9e9210] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
