"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useGuard } from "@/hooks/useGuard";
import { useMember } from "@/context/MemberContext";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

export default function PaymentPage() {
  useGuard("payment");

  const router = useRouter();
  const { member, hydrated, markPaymentConfirmed, refreshMember } = useMember();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);

  // Sync memberId from context or localStorage
  useEffect(() => {
    if (!hydrated) return;

    const stored = localStorage.getItem("memberId");

    if (member?._id) {
      localStorage.setItem("memberId", member._id);
      setMemberId(member._id);
    } else if (stored) {
      setMemberId(stored);
    }
  }, [hydrated, member]);

  const handlePayment = async () => {
    if (!memberId) return toast.error("Member ID missing.");

    const cleaned = phone.replace(/\s+/g, "");
    if (!/^\+?\d{9,15}$/.test(cleaned)) {
      return toast.error("Enter a valid phone number.");
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/payments/process", {
        memberId,
        phone: cleaned,
        amount: member?.packageType === "premium" ? 1000 : 500,
      });

      if (res.status === 200 || res.status === 201) {
        markPaymentConfirmed();

        await refreshMember();

        toast.success("Payment successful! Redirecting…");

        setTimeout(() => {
          router.push("/profile");
        }, 800);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-20 px-6">
      <Toaster position="top-center" />

      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>

        <p className="text-sm text-gray-600 mb-4">
          Member ID: <span className="font-medium">{memberId ?? "—"}</span>
        </p>

        <p className="text-sm text-gray-600 mb-2">
          Package:{" "}
          <span className="font-medium capitalize">
            {member?.packageType || "standard"}
          </span>
        </p>

        <p className="text-sm text-gray-600 mb-4">
          Amount:{" "}
          <span className="font-medium">
            {member?.packageType === "premium" ? "Ksh 1000" : "Ksh 500"}
          </span>
        </p>

        <input
          placeholder="M-Pesa Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-300 text-gray-700"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {loading ? "Processing…" : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
