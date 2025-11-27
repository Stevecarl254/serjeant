"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // loading spinner

  // Redirect logged-in users immediately
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole");

      if (token && role) {
        router.replace(role === "admin" ? "/admin" : "/");
      } else {
        setLoading(false);
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/users/login", formData);
      const { token, user } = data;

      if (!token || !user) {
        setError("Invalid response from server");
        return;
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.fullName);

      router.push(user.role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#002366] border-t-[#9e9210] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#002366] to-[#9e9210] px-4">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-[#002366] hover:text-[#9e9210] font-medium"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="bg-white/95 shadow-2xl rounded-xl w-[360px] p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#002366]">
          Login to Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="email"
              placeholder="Email or Membership Number *"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9e9210] focus:outline-none text-gray-900"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password *"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-14 py-3 border rounded-lg focus:ring-2 focus:ring-[#9e9210] focus:outline-none text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#002366] text-white py-3 rounded-lg font-semibold hover:bg-[#9e9210] transition"
          >
            Login
          </button>
        </form>

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
