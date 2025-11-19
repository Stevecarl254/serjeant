"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#002366] to-[#9e9210] px-4">
      
      {/* Back Button OUTSIDE the card */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-[#002366] hover:text-[#9e9210] font-medium"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="bg-white/95 shadow-2xl rounded-xl w-[360px] p-8 flex flex-col items-center">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6 text-[#002366]">
          Login to Your Account
        </h2>

        <form className="w-full space-y-5">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email address *"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9e9210] focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password *"
              required
              className="w-full pl-10 pr-14 py-3 border rounded-lg focus:ring-2 focus:ring-[#9e9210] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#002366] text-white py-3 rounded-lg font-semibold hover:bg-[#9e9210] transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-6 text-[#002366]">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[#9e9210] font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}