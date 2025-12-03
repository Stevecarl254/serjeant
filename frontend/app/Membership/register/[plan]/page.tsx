"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const plan = params.plan === "premium" ? "premium" : "standard";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/members/public/register", {
        ...form,
        packageType: plan,
      });

      // Accept 201 as success
      if (res.status === 201) {
        alert(res.data.message); // Show success message

        if (plan === "premium") {
          router.push("/membership/browse");
        } else {
          router.push(
            "/?msg=Welcome%20to%20the%20Society!%20Your%20membership%20is%20active."
          );
        }
      }
    } catch (err: any) {
      // Handle errors including duplicates
      const message =
        err.response?.data?.message || "Registration failed. Try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-20 px-6">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl border">
        <h1 className="text-3xl font-bold text-[#002366] mb-6">
          {plan === "premium" ? "Premium Membership" : "Standard Membership"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-lg p-3"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <input
            className="w-full border rounded-lg p-3"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="w-full border rounded-lg p-3"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md ${
              plan === "premium"
                ? "bg-[#9e9210] hover:bg-[#7e7411]"
                : "bg-[#002366] hover:bg-[#001847]"
            } transition`}
          >
            {loading ? "Processing…" : `Join ${plan === "premium" ? "Premium" : "Standard"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
