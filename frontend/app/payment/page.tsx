"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

export default function PaymentPage() {
  const params = useSearchParams();
  const router = useRouter();

  const memberId = params.get("memberId");

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!memberId) {
      router.push("/");
    }
  }, [memberId]);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.post("/payments/process", {
        memberId,
        phone,
        amount: 500, // mock for now
      });

      toast.success("Payment successful!");

      setTimeout(() => {
        router.push(`/profile?memberId=${memberId}`);
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-20 px-6">
      <Toaster position="top-center" />
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>

        <input
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="M-Pesa Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white rounded-lg"
        >
          {loading ? "Processing…" : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
