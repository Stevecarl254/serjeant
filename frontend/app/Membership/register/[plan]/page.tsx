"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [plan, setPlan] = useState<"standard" | "premium">("standard");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/members/public/register", {
        ...form,
        packageType: plan,
      });

      if (res.status === 201) {
        toast.success("Registration successful! Redirecting to payment…");

        setTimeout(() => {
          router.push(
            `/payment?memberId=${res.data.memberId}&plan=${plan}&fullName=${encodeURIComponent(
              form.fullName
            )}&email=${encodeURIComponent(form.email)}`
          );
        }, 1200);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-20 px-6">
      <Toaster position="top-center" />

      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-xl border">
        <h1 className="text-3xl font-bold text-[#002366] mb-6">
          Register as a Member
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <div className="flex gap-4">
            <button
              type="button"
              className={`flex-1 py-3 rounded-lg border font-semibold ${
                plan === "standard"
                  ? "bg-[#002366] text-white"
                  : "bg-white text-[#002366]"
              }`}
              onClick={() => setPlan("standard")}
            >
              Standard
            </button>

            <button
              type="button"
              className={`flex-1 py-3 rounded-lg border font-semibold ${
                plan === "premium"
                  ? "bg-[#002366] text-white"
                  : "bg-white text-[#002366]"
              }`}
              onClick={() => setPlan("premium")}
            >
              Premium
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#9e9210] text-white rounded-lg font-semibold hover:bg-[#7e7411] transition"
          >
            {loading ? "Processing…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
