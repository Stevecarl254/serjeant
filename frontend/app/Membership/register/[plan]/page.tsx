"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const plan = params.plan === "premium" ? "premium" : "standard";

  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
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

      if (res.status === 201) {
        const membershipNo = res.data.member.membershipNumber;

        toast.success(
          `🎉 ${res.data.message}\nMembership Number: ${membershipNo}`,
          { duration: 60000 } 
        );

        setTimeout(() => {
          if (plan === "premium") router.push("/membership/browse");
          else router.push("/?msg=Welcome to the Society! Your membership is active.");
        }, 2000);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed. Try again.";
      toast.error(message, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-20 px-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl border">
        <h1 className="text-3xl font-bold text-[#002366] mb-6">
          {plan === "premium" ? "Premium Membership" : "Standard Membership"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="w-full border rounded-lg p-3"/>
          <input name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="w-full border rounded-lg p-3"/>
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="w-full border rounded-lg p-3"/>

          <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-white font-semibold shadow-md ${plan==="premium"?"bg-[#9e9210] hover:bg-[#7e7411]":"bg-[#002366] hover:bg-[#001847]"} transition`}>
            {loading ? "Processing…" : `Join ${plan==="premium"?"Premium":"Standard"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
