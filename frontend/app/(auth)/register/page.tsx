"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Lock, ArrowLeft, Hash } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membershipNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, membershipNumber, password, confirmPassword } = formData;

    if (!name || !email || !phone || !membershipNumber || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, membershipNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      const redirectTo = sessionStorage.getItem("previousPage") || "/login";
      router.push(redirectTo);
    } catch (err) {
      setError("Something went wrong");
    }
  };

  if (typeof window !== "undefined") {
    const prev = document.referrer;
    if (prev && !prev.includes('/login') && !prev.includes('/register')) {
      sessionStorage.setItem("previousPage", prev);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#002366] via-[#4a6ed1] to-[#9e9210] px-4">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-[#002366] hover:text-[#9e9210] font-semibold"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back
      </button>

      {/* Card */}
      <div className="bg-white/95 shadow-2xl rounded-3xl w-[390px] max-w-full p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center text-[#002366] mb-6 mt-2">
          Register
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="relative">
            <User className="absolute top-3 left-3 w-5 h-5 text-[#9e9210]" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full Name *"
              className="w-full border border-[#9e9210] rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#002366] transition text-gray-900"
            />
          </div>

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

          <div className="relative">
            <Hash className="absolute top-3 left-3 w-5 h-5 text-[#9e9210]" />
            <input
              type="text"
              name="membershipNumber"
              required
              value={formData.membershipNumber}
              onChange={e => setFormData({ ...formData, membershipNumber: e.target.value })}
              placeholder="Membership Number *"
              className="w-full border border-[#9e9210] rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#002366] transition text-gray-900"
            />
          </div>

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